import { columnsAtom } from '@atoms/tableAtoms'
import { message } from 'antd'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

export function useGetColumnsConfiguration(apiHost, tableName, defaultColumns) {
  const [loadingColumns, setLoadingData] = useState(true)
  const [columns, setColumns] = useAtom(columnsAtom)
  const getColumns = async () => {
    setLoadingData(true)
    try {
      const response = await apiHost.get(
        `/api/ConfiguracaoColunas/${tableName}`,
      )
      let columnData = response.data?.configuracoes
      if (columnData) {
        columnData = columnData
          .filter(c => c.ativo)
          .sort((a, b) => a.ordem - b.ordem)
        const newColumnArray = []
        // eslint-disable-next-line array-callback-return
        columnData.map((c, index) => {
          const col = defaultColumns.find(
            col => c.nomeColuna === col.nomeColuna,
          )
          col && newColumnArray.splice(index, 0, col)
        })
        newColumnArray.length > 0
          ? setColumns(newColumnArray)
          : setColumns(defaultColumns.filter(col => col.obrigatorio))
      } else {
        setColumns(defaultColumns.filter(col => col.padrao))
      }
    } catch (error) {
      setColumns(defaultColumns.filter(col => col.padrao))
      message.error('Não foi possível obter a configuração de colunas')
    }
    setLoadingData(false)
  }
  useEffect(() => {
    getColumns()
  }, [tableName])
  return [columns, loadingColumns, getColumns]
}

export function useGetDefaultColumn(column) {
  const [tableColumns, setTableColumns] = useAtom(columnsAtom)

  useEffect(() => {
    setTableColumns(column)
  }, [])

  return [tableColumns]
}
