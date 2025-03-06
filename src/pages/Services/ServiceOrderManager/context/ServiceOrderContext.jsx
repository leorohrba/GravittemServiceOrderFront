import constate from 'constate'
import moment from 'moment'
import { useState } from 'react'

function useServiceOrder() {
  const [tags, setTags] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [visibleServiceOrderModal, setVisibleServiceOrderModal] = useState()

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }
  const searchOptions = [
    {
      value: 'descricao',
      label: 'Descrição',
      type: 'search',
    },
  ]
  function startSearch() {}
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([
    {
      id: 1,
      OS: '003',
      cliente: 'Letícia Ribeiro',
      dataAbertura: moment(),
      prioridade: 'Baixa',
      idade: '3 dias',
      status: 3,
    },
    {
      id: 2,
      OS: '005',
      cliente: 'Maria da Silva',
      dataAbertura: moment().subtract(1, 'week'),
      prioridade: 'Baixa',
      dataConclusao: moment(),
      idade: '7 dias',
      status: 2,
    },
  ])

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
    visibleServiceOrderModal,
    setVisibleServiceOrderModal,
  }
}

const [ServiceOrderProvider, useServiceOrderContext] = constate(useServiceOrder)

export { ServiceOrderProvider, useServiceOrderContext }
