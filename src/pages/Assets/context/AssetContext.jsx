import { apiAttendance } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  setParamValues,
  showApiMessages,
} from '@utils'
import constate from 'constate'
import moment from 'moment'
import { useEffect, useState } from 'react'
import router from 'umi/router'

function useAsset() {
  const [data, setData] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [dataExport, setDataExport] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [tags, setTags] = useState([])

  const [visiblePrintLabelModal, setVisiblePrintLabelModal] = useState(false)

  const [visibleTagModal, setVisibleTagModal] = useState(false)
  const registeredTags = [{ id: 1, descricao: 'Teste' }]

  const [visibleGenerateSOModal, setVisibleGenerateSOModal] = useState(false)

  const params = {
    id: [],
    nomeCliente: [],
    descricaoProduto: [],
    numeroSerie: [],
    ativo: [],
    dataCompraInicial: null,
    dataCompraFinal: null,
  }

  const searchOptions = [
    {
      value: 'descricaoProduto',
      label: 'Descrição',
      type: 'search',
      placeholder: 'Informe a descrição do ativo',
    },
    {
      value: 'codigo',
      label: 'Código',
      type: 'search',
      placeholder: 'Informe o código do ativo',
    },
    {
      value: 'nomeCliente',
      label: 'Cliente',
      type: 'search',
      placeholder: 'Informe o nome do cliente',
    },
    {
      value: 'numeroSerie',
      label: 'Número de série',
      type: 'search',
      placeholder: 'Informe o número de série',
    },
    {
      value: 'dataCompra',
      label: 'Data de compra',
      type: 'rangeDate',
    },
    {
      value: 'terminoGarantia',
      label: 'Término de garantia',
      type: 'rangeDate',
    },
    {
      value: 'patrimonio',
      label: 'Número de patrimônio',
      type: 'search',
      placeholder: 'Informe o número de patrimônio',
    },
    {
      value: 'tag',
      label: 'Tag',
      type: 'search',
      placeholder: 'Informe a tag',
    },

    {
      value: 'ativo',
      label: 'Status',
      placeholder: 'Selecione o status',
      type: 'select',
      options: [
        {
          label: 'Ativo',
          value: true,
        },
        {
          label: 'Inativo',
          value: false,
        },
      ],
    },
    {
      value: 'motivo',
      label: 'Motivo',
      type: 'search',
      placeholder: 'Informe o motivo',
    },
  ]

  useEffect(() => {
    setPermissions()
    clearParams()
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function clearParams() {
    params.id = []
    params.nomeCliente = []
    params.descricaoProduto = []
    params.dataCompraInicial = null
    params.dataCompraFinal = null
    params.numeroSerie = []
    params.ativo = []
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtivo`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.ativo)
        // setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  function startSearch() {
    clearParams()
    setParamValues(params, searchOptions, tags)
    getData()
  }

  const editAsset = id => {
    if (id) {
      router.push(`Assets/detail/${id}`)
    } else {
      router.push(`Assets/detail`)
    }
  }

  useEffect(() => {
    const source = [
      {
        columns: [
          'Ativo',
          'Código do produto',
          'Identificação',
          'Número de série',
          'Motivo número série não informado',
          'Versão',
          'Cliente',
          'CPF/CNPJ',
          'Nota fiscal',
          'Data compra',
          'Data instalação',
          'Status',
        ],
        data: [],
      },
    ]

    data.map(d =>
      source[0].data.push([
        d.descricaoProduto,
        d.codigoProduto,
        d.identificacao,
        d.numeroSerie,
        d.descricaoNumeroSerieNaoInformado,
        d.versao,
        d.nomeCliente,
        d.cpfCnpjFormatado,
        d.numeroNotaFiscal,
        d.dataCompra ? moment(d.dataCompra).format('DD/MM/YYYY') : '',
        d.dataInstalacao ? moment(d.dataInstalacao).format('DD/MM/YYYY') : '',
        d.ativo ? 'Ativo' : 'Inativo',
      ]),
    )

    setDataExport(source)
  }, [data])

  return {
    data,
    setData,
    userPermissions,
    loading,
    dataExport,
    selectedRows,
    searchOptions,
    setSelectedRows,
    startSearch,
    editAsset,
    keyTable,
    setKeyTable,
    tags,
    setTags,
    visiblePrintLabelModal,
    setVisiblePrintLabelModal,
    visibleTagModal,
    setVisibleTagModal,
    registeredTags,
    visibleGenerateSOModal,
    setVisibleGenerateSOModal,
  }
}

const [AssetProvider, useAssetContext] = constate(useAsset)

export { AssetProvider, useAssetContext }
