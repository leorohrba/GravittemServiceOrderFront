import constate from 'constate'
import { useState } from 'react'

function useLicenseManagement() {
  const [data, setData] = useState([
    {
      id: 1,
      nome: 'Resolve Tudo',
      documento: '452.236.548/0001-00',
      modulo: 'Netco',
      licencas: 4,
      numeroSerie: 'ESWD',
      status: 'ativo',
    },
  ])
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [tags, setTags] = useState([])

  const searchOptions = [
    {
      value: 'nome',
      label: 'Nome',
      type: 'search',
    },
  ]

  function startSearch() {}

  const [visibleJustifyModal, setVisibleJustifyModal] = useState(false)
  const [visibleHistoryModal, setVisibleHistoryModal] = useState(false)

  return {
    data,
    setData,
    searchOptions,
    selectedRows,
    setSelectedRows,
    selectedRowKeys,
    setSelectedRowKeys,
    startSearch,
    tags,
    setTags,
    visibleJustifyModal,
    setVisibleJustifyModal,
    visibleHistoryModal,
    setVisibleHistoryModal,
  }
}

const [LicenseManagementProvider, useLicenseManagementContext] = constate(
  useLicenseManagement,
)

export { LicenseManagementProvider, useLicenseManagementContext }
