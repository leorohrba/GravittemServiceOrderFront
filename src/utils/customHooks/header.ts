import { message } from 'antd'
import { Dispatch, useEffect, useState } from 'react'
import { handleAuthError } from '@utils'
import { apiSearch } from '@services/api'
import { SetStateAction } from 'jotai'
/** Esse custom foi modificado para aceitar o params agora. Assim deixando a pesquisa correta.
 *  Utilizar ele a partir de agora
 */
export function useGetTableData<T>(
  { apiHost, screenName },
  searchQuery,
  screen,
  microservice,
  setTags,
  tags,
  urlTags = '[]',
  params,
  doFirst,
  externalSetTableData: Dispatch<SetStateAction<any>> = null,
  externalSetLoadingTable: Dispatch<SetStateAction<boolean>> = null,
) {
  const [tableData, setTableData] = useState<T>({})
  const [loadingTableData, setLoadingTableData] = useState<boolean>(true)
  const [initialSearch, setInitialSearch] = useState(null)
  const originPath = sessionStorage.getItem('originPath')
  const effectiveSetTableData = externalSetTableData || setTableData
  const effectiveSetLoadingTable =
    externalSetLoadingTable || setLoadingTableData
  const backToGrid = async () => {
    const response = await apiHost.get(`/api/${screenName}`)
    effectiveSetTableData(response.data)
    effectiveSetLoadingTable(false)
  }
  const getTableData = async () => {
    effectiveSetLoadingTable(true)
    try {
      const response = await apiHost({
        method: 'GET',
        url: `/api/${screenName}${searchQuery}`,
        params,
      })
      effectiveSetTableData(response.data)
      effectiveSetLoadingTable(false)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os dados da tabela')
      backToGrid()
    }
  }
  useEffect(() => {
    const getInitialSearch = async () => {
      effectiveSetLoadingTable(true)
      try {
        const response = await apiSearch.get(
          `/api/Pesquisa/PesquisaInicial?Tela=${screen}&MicroserviceOrigem=${microservice}`,
        )
        const search = response.data?.condicoes
        const isCustom = response.data?.usandoConsultaPersonalizada
        if (search && isCustom) {
          const newQuery = search.map(c => {
            const isRange = c.tipo === 'rangeDate'
            return {
              fieldName: c.descricao || c.propriedade,
              fieldValue: c.propriedade,
              searchField: c.valor,
              searchFieldValue: isRange
                ? [c.chave.split('|')[0], c.chave.split('|')[1]]
                : c.chave || c.valor,
              fieldType: c.tipo || 'search',
            }
          })
          if (urlTags === '[]' || !urlTags) {
            setTags(newQuery)
          } else if (!tags || tags.length === 0) {
            setTags(JSON.parse(urlTags) ?? [])
          } else {
            getTableData()
          }
        } else if (
          urlTags &&
          urlTags !== '[]' &&
          (!tags || tags.length === 0)
        ) {
          setTags(JSON.parse(urlTags) ?? [])
        } else {
          setTags([])
          doFirst ? getTableData() : effectiveSetLoadingTable(false)
        }
        sessionStorage.setItem('originPath', screen)
      } catch (error) {
        getTableData()
        handleAuthError(error)
        message.error('Não foi possível obter a pesquisa padrão')
      }
    }
    getInitialSearch()
    setInitialSearch(searchQuery)
  }, [screen, screenName])
  useEffect(() => {
    if (initialSearch && originPath === screen && tags.length !== 0) {
      getTableData()
    }
  }, [searchQuery])
  return [tableData, loadingTableData, getTableData] as const
}
