import constate from 'constate'
import moment from 'moment'
import { useState } from 'react'

function usePurchaseRequest() {
  const [tags, setTags] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState()
  const [
    visiblePurchaseRequestModal,
    setVisiblePurchaseRequestModal,
  ] = useState(false)

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
      descricao: 'Tirante',
      codigo: '2280',
      dataSolicitacao: moment(),
      solicitado: 18,
      aComprar: 12,
      status: 1,
      tipo: 'Compra venda balcão',
      motivo: 'Encontrado produto em estoque',
    },
    {
      id: 3,
      descricao: 'Etc',
      codigo: '5894',
      dataSolicitacao: moment(),
      solicitado: 3,
      aComprar: 1,
      status: 4,
    },
  ])

  const [itemsData, setItemsData] = useState([
    { id: 1, descricao: 'Tirante', codigo: '2280' },
  ])

  // eslint-disable-next-line no-unused-vars
  const [provider, setProvider] = useState([
    {
      id: 1,
      nome: 'Millium',
      email: 'teste@teste.com',
    },
  ])

  const [
    visibleQuotationRequestModal,
    setVisibleQuotationRequestModal,
  ] = useState(false)

  const [visibleJustifyModal, setVisibleJustifyModal] = useState(false)

  return {
    tags,
    setTags,
    selectedRows,
    setSelectedRows,
    startSearch,
    searchOptions,
    rowSelection,
    provider,
    editData,
    setEditData,
    data,
    setData,
    itemsData,
    setItemsData,
    dropdownVisible,
    setDropdownVisible,
    visiblePurchaseRequestModal,
    setVisiblePurchaseRequestModal,
    visibleQuotationRequestModal,
    setVisibleQuotationRequestModal,
    visibleJustifyModal,
    setVisibleJustifyModal,
  }
}

const [PurchaseRequestProvider, usePurchaseRequestContext] = constate(
  usePurchaseRequest,
)

export { PurchaseRequestProvider, usePurchaseRequestContext }
