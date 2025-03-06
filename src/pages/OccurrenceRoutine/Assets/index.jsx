/**
 * breadcrumb: Ativos
 */
import { apiAttendance } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  setParamValues,
  showApiMessages,
  showApiNotifications,
} from '@utils'
import { Badge, message, Modal, Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import AssetsHeader from './components/AssetsHeader'
import AssetsTable from './components/AssetsTable'

const { confirm } = Modal

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
    label: 'Ativo',
    type: 'search',
    placeholder: 'Informe a descrição do ativo',
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
    placeholder: 'Informe o número da série',
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
        render: <Badge style={{ color: 'green' }} color="green" text="Ativo" />,
      },
      {
        label: 'Inativo',
        value: false,
        render: <Badge style={{ color: 'red' }} color="red" text="Inativo" />,
      },
    ],
  },
  {
    value: 'dataCompra',
    label: 'Data de compra',
    type: 'rangeDate',
  },
]

function Assets() {
  const [tags, setTags] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  useEffect(() => {
    setPermissions()
    clearParams()
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        setKeyTable(keyTable + 1)
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

  function confirmDeleteAssets() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteAssets(),
      okType: 'danger',
      cancelText: formatMessage({
        id: 'globalComponents.confirmModal.no',
      }),
      okText: formatMessage({
        id: 'globalComponents.confirmModal.yes',
      }),
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  }
  async function deleteAssets() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'DELETE',
        url: `/api/Ativo`,
        data: { ids: selectedRows.map(record => record.id) },
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getData()
        message.success(
          formatMessage({
            id: 'successDelete',
          }),
        )
      } else {
        showApiNotifications(data)
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
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

  return (
    <div className="container">
      <Spin spinning={loading} size="large">
        <AssetsHeader
          editAsset={editAsset}
          selectedRows={selectedRows}
          confirmDeleteAssets={confirmDeleteAssets}
          userPermissions={userPermissions}
          startSearch={startSearch}
          searchOptions={searchOptions}
          tags={tags}
          setTags={setTags}
          dataExport={dataExport}
        />
        <AssetsTable
          data={data}
          userPermissions={userPermissions}
          editAsset={editAsset}
          rowSelection={rowSelection}
          keyTable={keyTable}
        />
      </Spin>
    </div>
  )
}

export default Assets
