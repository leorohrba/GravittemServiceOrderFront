/**
 * breadcrumb: Grupo de pessoas
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
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import PersonGroupHeader from './components/PersonGroupHeader'
import PersonGroupTable from './components/PersonGroupTable'

const { confirm } = Modal

const params = {
  id: [],
  descricao: [],
  status: [],
  nomeColaborador: [],
  trazerColaboradores: false,
}

const searchOptions = [
  {
    value: 'descricao',
    label: 'Descrição',
    type: 'search',
    placeholder: 'Informe a descrição do grupo',
  },
  {
    value: 'nomeColaborador',
    label: 'Colaborador',
    type: 'search',
    placeholder: 'Informe o nome do colaborador',
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
]

function PersonGroup() {
  const [tags, setTags] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)

  useEffect(() => {
    setPermissions()
    clearParams()
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function clearParams() {
    params.id = []
    params.descricao = []
    params.nomeColaborador = []
    params.status = []
    params.trazerColaboradores = false
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaGrupoColaborador`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.grupoColaborador)
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

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  function confirmDeletePersonGroup() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deletePersonGroup(),
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

  async function deletePersonGroup() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'DELETE',
        url: `/api/GrupoColaborador`,
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

  const editPersonGroup = id => {
    if (id) {
      router.push(`PersonGroup/detail/${id}`)
    } else {
      router.push(`PersonGroup/detail`)
    }
  }

  return (
    <div className="container">
      <Spin spinning={loading} size="large">
        <PersonGroupHeader
          editPersonGroup={editPersonGroup}
          selectedRows={selectedRows}
          confirmDeletePersonGroup={confirmDeletePersonGroup}
          userPermissions={userPermissions}
          startSearch={startSearch}
          searchOptions={searchOptions}
          tags={tags}
          setTags={setTags}
        />
        <PersonGroupTable
          data={data}
          userPermissions={userPermissions}
          editPersonGroup={editPersonGroup}
          rowSelection={rowSelection}
          keyTable={keyTable}
        />
      </Spin>
    </div>
  )
}

export default PersonGroup
