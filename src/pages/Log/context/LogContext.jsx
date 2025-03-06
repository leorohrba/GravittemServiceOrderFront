/* eslint-disable react-hooks/exhaustive-deps */
import constate from 'constate'
import { useState, useEffect } from 'react'
import { apiLog } from '@services/api'
import { handleAuthError, setParamValues, } from '@utils'
import moment from 'moment'

let params

let executeSearch = false

const statuses = [
  {
     id: 1,
     description: 'Inicializado',
     icon: "fa-circle",
     color: 'yellow'
  },
  {
    id: 2,
    description: 'Encerrado com sucesso',
    icon: "fa-check",
    color: 'green'
  },
  {
    id: 3,
    description: 'Encerrado com erro',
    icon: "fa-times",
    color: 'red'
  },
]

function useLog() {
  const [tags, setTags] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [logDetailModalVisible, setLogDetailModalVisible] = useState(false)
  const [ownerId, setOwnerId] = useState(null)
  const [transactionId, setTransactionId] = useState(null) 
  const [period, setPeriod] = useState(null)
  const [statusId, setStatusId] = useState(null)
  const [owners, setOwners] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [logInicializacaoId, setLogInicializacaoId] = useState(null)
  const [dataExport, setDataExport] = useState([])
  const [keyTable, setKeyTable] = useState(0)
  
  useEffect(() => {
    const source = [
      {
        columns: [
          'Empresa',
          'Usuário',
          'Descrição da transação',
          'Nome da transação',
          'Status',
          'Data inicial',
          'Data final',
          'Tempo',
        ],
        data: [],
      },
    ]

    data.map(d => {
      source[0].data.push([
        d.empresaNome,
        d.usuarioNome,
        d.interfaceLogDescricao,
        d.interfaceLogNome,
        d.statusDescricao,
        d.dataInicial && moment(d.dataInicial).format('DD/MM/YYYY HH:mm:ss'),
        d.dataFinal && moment(d.dataFinal).format('DD/MM/YYYY HH:mm:ss'),
        d.tempo
      ])
      return true
    })

    setDataExport(source)
  },[data])

  useEffect(() => {
    if (executeSearch) {
      startSearch()
    }
    executeSearch = true
  },[statusId, ownerId, transactionId, period])

  useEffect(() => {
    getTransactions()
    getOwners()
  },[])

  async function getTransactions() {
    try {
      const response = await apiLog({
        method: 'GET',
        url: `/api/InterfaceLog`,
        params: { status: 1 }
      })
      const { data } = response
      setTransactions(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }  

  async function getOwners() {
    try {
      const response = await apiLog({
        method: 'GET',
        url: `/api/Empresa`,
        params: { ocultarEmpresaSemLog: true }
      })
      const { data } = response
      setOwners(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }  

  async function getData() {
    setLoading(true)
    try {
      const response = await apiLog({
        method: 'GET',
        url: `/api/Log/Inicializacao`,
        params,
      })
      setLoading(false)
      const { data } = response
      setData(data || [])
      setKeyTable(keyTable + 1)
    } catch (error) {
      handleAuthError(error)
    }
  }  

  const buildParams = () => {
    params = {}
    if (period) {
      params.dataInicial = period[0].format('YYYY-MM-DD')
      params.dataFinal = period[1].format('YYYY-MM-DD')
    }
    params.empresaId = ownerId
    params.interfaceLogId = transactionId
    params.statusLog = statusId
  }

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const searchOptions = [
    {
      value: 'mensagem',
      label: 'Mensagem',
      type: 'search',
    },
    {
      value: 'nrDocumento',
      label: 'Documento',
      type: 'search',
    },
    {
      value: 'entidadeId',
      label: 'Id',
      type: 'search',
    },        
  ]

  function startSearch() 
  {
    buildParams() 
    setParamValues(params, searchOptions, tags, 1)
    getData()
  }

  const statusRender = (id) =>
  {
    const status = statuses.find(x => x.id === id)
    if (status) {
      return (
         <div>
           <i className={`mr-2 fa ${status.icon}`} style={{ color: status.color }} />
           {status.description}
         </div>
      )
    }
    return null
  }

  return {
    tags,
    setTags,
    selectedRows,
    startSearch,
    searchOptions,
    rowSelection,
    logDetailModalVisible,
    setLogDetailModalVisible,
    ownerId,
    setOwnerId,
    transactionId,
    setTransactionId,
    period,
    setPeriod,
    owners,
    transactions,
    data,
    loading,
    statusId,
    setStatusId,
    statuses,
    logInicializacaoId,
    setLogInicializacaoId,
    statusRender,
    dataExport,
    keyTable,
    getOwners,
  }
}

const [LogProvider, useLogContext] = constate(useLog)

export { LogProvider, useLogContext }
