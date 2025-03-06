import { apiLayoutGenerator } from '@services/api'
import { handleAuthError } from '@utils'
import constate from 'constate'
import { useEffect, useState } from 'react'

function useDocumentGenerator({ documentTypeId }) {
  const [tags, setTags] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState()
  const [loading, setLoading] = useState(true)

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const searchOptions = [
    {
      value: 'nome',
      label: 'Nome',
      type: 'search',
    },
  ]

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiLayoutGenerator({
        method: 'GET',
        url: `/api/ModeloDocumento/Select`,
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

  function startSearch() {}

  const [editData, setEditData] = useState({})
  const [data, setData] = useState([])
  return {
    tags,
    setTags,
    selectedRows,
    startSearch,
    searchOptions,
    rowSelection,
    editData,
    setEditData,
    data,
    setData,
    dropdownVisible,
    setDropdownVisible,
    loading,
    setLoading,
    getData,
  }
}

const [DocumentGeneratorProvider, useDocumentGeneratorContext] = constate(
  useDocumentGenerator,
)

export { DocumentGeneratorProvider, useDocumentGeneratorContext }
