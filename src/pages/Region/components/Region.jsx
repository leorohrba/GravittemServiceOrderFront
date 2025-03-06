import { apiCRM, apiRegion } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  setParamValues,
  showApiMessages,
  showApiNotifications,
} from '@utils'
import { getInitialSearch } from '@utils/customHooks'
import { Badge, message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import RegionHeader from './RegionHeader'
import RegionTable from './RegionTable'

const { confirm } = Modal

const params = {}

const initialOptions = [
  {
    value: 'nome',
    label: 'Nome',
    type: 'search',
    placeholder: 'Nome da região',
  },
  {
    value: 'descricao',
    label: 'Descrição',
    type: 'search',
    placeholder: 'Descrição da região',
  },
  {
    value: 'delimitadoPor',
    label: 'Delimitado por',
    placeholder: 'Selecione o tipo de delimitação',
    type: 'select',
    options: [
      { label: 'Sem delimitação', value: 1 },
      { label: 'CEP', value: 2 },
      { label: 'Bairro/município', value: 3 },
    ],
  },
  {
    value: 'status',
    label: 'Status',
    placeholder: 'Selecione o status',
    type: 'select',
    options: [
      {
        label: 'Ativo',
        value: 1,
        render: <Badge style={{ color: 'green' }} color="green" text="Ativo" />,
      },
      {
        label: 'Inativo',
        value: 2,
        render: <Badge style={{ color: 'red' }} color="red" text="Inativo" />,
      },
    ],
  },
  {
    value: 'municipio',
    label: 'Município',
    type: 'search',
    placeholder: 'Município vinculado a região',
  },
  {
    value: 'estadoSigla',
    label: 'Estado',
    placeholder: 'Selecione o estado vinculado a região',
    type: 'select',
    options: [],
  },
  {
    value: 'rua',
    label: 'Rua',
    type: 'search',
    placeholder: 'Rua vinculada a região',
  },
  {
    value: 'bairro',
    label: 'Bairro',
    type: 'search',
    placeholder: 'Bairro vinculado a região',
  },
  {
    value: 'cep',
    label: 'Cep',
    type: 'search',
    placeholder: 'Cep vinculado a região',
  },
]

function Region() {
  const [ownerProfile, setOwnerProfile] = useState(null)
  const [searchOptions, setSearchOptions] = useState(initialOptions)
  const [tags, setTags] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])

  useEffect(() => {
    getOwnerProfile()
    clearParams()
    getStates()
    getData()

    getInitialSearch('regioes', 'financial', setTags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tags.length > 0) {
      startSearch()
    }
  }, [tags])

  async function getOwnerProfile() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Owner`,
      })
      const { data } = response
      if (data.isOk) {
        setOwnerProfile(data.ownerProfile)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    if (ownerProfile) {
      setPermissions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerProfile])

  async function setPermissions() {
    let permissions = await getPermissions()
    if (ownerProfile === 'Franchise') {
      permissions = permissions.filter(
        x =>
          !(x.name === 'Include' || x.name === 'Alter' || x.name === 'Exclude'),
      )
    }
    setUserPermissions(permissions)
  }

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  useEffect(() => {
    const source = [
      {
        columns: ['Nome', 'Descrição', 'Delimitado por', 'Status'],
        data: [],
      },
    ]

    data.map(d =>
      source[0].data.push([
        d.nome,
        d.descricao,
        d.delimitadoPorDescricao,
        d.statusDescricao,
      ]),
    )

    setDataExport(source)
  }, [data])

  function clearParams() {
    params.regiaoId = []
    params.nome = []
    params.descricao = []
    params.delimitadoPor = []
    params.status = []
    params.municipio = []
    params.bairro = []
    params.cep = []
    params.estadoSigla = []
  }

  async function getStates() {
    try {
      const response = await apiRegion({
        method: 'GET',
        url: `/api/Estado`,
        params: { paisId: 1 },
      })
      const { data } = response
      if (data.isOk) {
        const states = data.estado.map(d => ({ label: d.nome, value: d.sigla }))
        const index = searchOptions.findIndex(x => x.value === 'estadoSigla')
        if (index > -1) {
          searchOptions[index].options = states
          setSearchOptions([...searchOptions])
        }
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/Regiao/Select`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.regiao)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteRegion() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteRegion(),
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
  async function deleteRegion() {
    setLoading(true)
    try {
      const response = await apiRegion({
        method: 'DELETE',
        url: `/api/Regiao`,
        data: { regiaoIds: selectedRows.map(record => record.regiaoId) },
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

  const editRegion = id => {
    if (id) {
      router.push(`Region/detail/${id}`)
    } else {
      router.push(`Region/detail`)
    }
  }

  return (
    <div>
      <Spin spinning={loading} size="large">
        <RegionHeader
          editRegion={editRegion}
          selectedRows={selectedRows}
          confirmDeleteRegion={confirmDeleteRegion}
          userPermissions={userPermissions}
          startSearch={startSearch}
          searchOptions={searchOptions}
          tags={tags}
          setTags={setTags}
          dataExport={dataExport}
        />
        <RegionTable
          data={data}
          userPermissions={userPermissions}
          editRegion={editRegion}
          rowSelection={rowSelection}
          keyTable={keyTable}
          tags={tags}
          loading={loading}
        />
      </Spin>
    </div>
  )
}

export default Region
