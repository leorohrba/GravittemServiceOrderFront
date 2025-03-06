import constate from 'constate'
import moment from 'moment'
import { useState } from 'react'

function usePurchaseOrder() {
  const [tags, setTags] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState()

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }
  const searchOptions = [
    {
      value: 'fornecedor',
      label: 'Fornecedor',
      type: 'search',
    },
  ]
  function startSearch() {}
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([
    {
      id: 1,
      pedido: '2280',
      fornecedor: 'Millium',
      dataPedido: moment(),
      solicitante: 'Rodrigo Silveira',
      cotacao: '4732',
      valorPedido: 500,
      origem: 'Sugestão de compra',
      status: 1,
    },
    {
      id: 3,
      pedido: '5894',
      fornecedor: 'Whirlpool',
      dataPedido: moment(),
      solicitante: 'Flávio Bortolassi',
      cotacao: '3434',
      valorPedido: 467.6,
      origem: 'Lista de compra',
      status: 3,
    },
  ])

  return {
    tags,
    setTags,
    selectedRows,
    setSelectedRows,
    startSearch,
    searchOptions,
    rowSelection,
    editData,
    setEditData,
    data,
    setData,
    dropdownVisible,
    setDropdownVisible,
  }
}

const [PurchaseOrderProvider, usePurchaseOrderContext] = constate(
  usePurchaseOrder,
)

export { PurchaseOrderProvider, usePurchaseOrderContext }
