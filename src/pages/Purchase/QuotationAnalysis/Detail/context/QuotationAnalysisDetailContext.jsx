import constate from 'constate'
import { useEffect, useState } from 'react'

function useQuotationAnalysisDetail() {
  const [selectedRows, setSelectedRows] = useState([])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const [itemsData, setItemsData] = useState([
    {
      id: 1,
      codigo: '4732',
      item: 'Gaxeta',
      quantidade: 4,
      fornecedor: 2,
      valor: 10.98,
      melhorValor: 2,
    },
    {
      id: 3,
      codigo: '3434',
      item: 'Trempe',
      quantidade: 8,
      fornecedor: 1,
      valor: 18.4,
      melhorValor: 1,
    },
  ])

  const providers = [
    {
      id: 1,
      nome: 'Millium Tem de Tudo',
    },
    {
      id: 2,
      nome: 'Whirlpool',
    },
    {
      id: 3,
      nome: `Casa d'Água`,
    },
  ]

  const optionsList = [
    {
      id: 1,
      nome: 'Millium Tem De Tudo',
      itens: 50,
      frete: 0,
      condicaoPagamento: 'À vista',
      total: 50,
    },
    {
      id: 3,
      nome: `Casa d'Água`,
      itens: 48.8,
      frete: 12.2,
      condicaoPagamento: 'À vista',
      total: 61,
    },
    {
      id: 2,
      nome: 'Whirlpool',
      itens: 46.55,
      frete: 8.4,
      condicaoPagamento: 'À vista',
      total: 54.95,
    },
    {
      id: 4,
      nome: 'Americanas',
      status: 2,
    },
  ]

  const [total, setTotal] = useState(0)

  useEffect(() => {
    const itensTotal = selectedRows.reduce(
      (accumulator, { valor }) => accumulator + parseFloat(valor),
      0,
    )
    const freteTotal = selectedRows
      .map(s => optionsList.find(p => p.id === s.fornecedor))
      .reduce((accumulator, { frete }) => accumulator + parseFloat(frete), 0)

    setTotal(itensTotal + freteTotal)
  }, [selectedRows])

  return {
    itemsData,
    setItemsData,
    selectedRows,
    rowSelection,
    providers,
    optionsList,
    total,
  }
}

const [
  QuotationAnalysisDetailProvider,
  useQuotationAnalysisDetailContext,
] = constate(useQuotationAnalysisDetail)

export { QuotationAnalysisDetailProvider, useQuotationAnalysisDetailContext }
