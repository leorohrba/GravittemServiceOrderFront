/* eslint-disable no-unused-vars */
import { apiLayoutGenerator } from '@services/api'
import { handleAuthError } from '@utils'
import constate from 'constate'
import { useEffect, useState } from 'react'

function useNewFieldType({ documentTypeId }) {
  const [newFieldTypeModalVisible, setNewFieldTypeModalVisible] = useState(
    false,
  )
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState({})
  const [selectedRows, setSelectedRows] = useState([])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiLayoutGenerator({
        method: 'GET',
        url: `/api/CategoriaObjeto`,
        params: { TipoDocumentoId: documentTypeId },
      })
      setLoading(false)
      const { data } = response
      setData(data || [])
      // setKeyTable(keyTable + 1)
    } catch (error) {
      handleAuthError(error)
    }
  }
  return {
    newFieldTypeModalVisible,
    setNewFieldTypeModalVisible,
    data,
    editData,
    setEditData,
    rowSelection,
    selectedRows,
    setSelectedRows,
    loading,
    getData,
  }
}

const [NewFieldTypeProvider, useNewFieldTypeContext] = constate(useNewFieldType)

export { NewFieldTypeProvider, useNewFieldTypeContext }
