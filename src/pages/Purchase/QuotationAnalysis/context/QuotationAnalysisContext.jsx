import constate from 'constate'
import moment from 'moment'
import { useState } from 'react'

function useQuotationAnalysis() {
  const [tags, setTags] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState()

  const searchOptions = [
    {
      value: 'status',
      label: 'Status',
      type: 'search',
    },
  ]
  function startSearch() {}

  const [viewData, setViewData] = useState({})
  const [data, setData] = useState([
    {
      id: 1,
      cotacao: '4732',
      dataSolicitacao: moment(),
      solicitante: 'Rodrigo Silveira',
      status: 1,
    },
    {
      id: 3,
      cotacao: '3434',
      dataSolicitacao: moment(),
      solicitante: 'Flávio Bortolassi',
      status: 2,
    },
  ])

  return {
    tags,
    setTags,
    startSearch,
    searchOptions,
    data,
    setData,
    viewData,
    setViewData,
    dropdownVisible,
    setDropdownVisible,
  }
}

const [QuotationAnalysisProvider, useQuotationAnalysisContext] = constate(
  useQuotationAnalysis,
)

export { QuotationAnalysisProvider, useQuotationAnalysisContext }
