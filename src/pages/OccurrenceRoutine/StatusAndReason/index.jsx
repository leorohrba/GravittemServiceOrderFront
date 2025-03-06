/**
 * breadcrumb: Status e motivo
 */
import { apiAttendance } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  showApiMessages,
  showApiNotifications,
} from '@utils'
import { message, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import StatusAndReasonHeader from './components/StatusAndReasonHeader'
import StatusAndReasonTable from './components/StatusAndReasonTable'
import NewStatusModal from './modals/NewStatusModal'

const { confirm } = Modal

const params = {
  id: null,
  descricao: null,
  descricaoMotivo: null,
  status: null,
  documento: 1, // documento padrão
}

export default function StatusAndReason() {
  const [selectedRows, setSelectedRows] = useState([])
  const [newStatusModal, setNewStatusModal] = useState(false)
  const [data, setData] = useState([])
  const [statusId, setStatusId] = useState(null)
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [keyModal, setKeyModal] = useState(0)

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

  function clearParams() {
    params.id = null
    params.descricao = null
    params.descricaoMotivo = null
    params.status = null
    params.documento = 1 // documento padrão
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/StatusMotivo`,
        params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.statusCadastrado)
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

  function confirmDeleteStatus() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteStatus(),
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
  async function deleteStatus() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'DELETE',
        url: `/api/StatusMotivo`,
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

  function startSearch(fieldName, searchFieldValue) {
    setSearchValues(fieldName, searchFieldValue)
    getData()
  }

  function setSearchValues(fieldName, searchFieldValue) {
    clearParams()
    if (fieldName === 'description') {
      params.descricao = searchFieldValue
    } else if (fieldName === 'status') {
      params.status = searchFieldValue
    } else if (fieldName === 'reasonDescription') {
      params.descricaoMotivo = searchFieldValue
    }
  }
  const editStatus = idToEdit => {
    setStatusId(idToEdit)
    setNewStatusModal(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="container">
      <NewStatusModal
        newStatusModal={newStatusModal}
        setNewStatusModal={setNewStatusModal}
        key={keyModal}
        statusId={statusId}
        setStatusId={setStatusId}
        refreshData={() => getData()}
        userPermissions={userPermissions}
      />
      <Spin spinning={loading} size="large">
        <StatusAndReasonHeader
          userPermissions={userPermissions}
          editStatus={editStatus}
          selectedRows={selectedRows}
          startSearch={startSearch}
          setSearchValues={setSearchValues}
          confirmDeleteStatus={confirmDeleteStatus}
        />
        <StatusAndReasonTable
          data={data}
          userPermissions={userPermissions}
          keyTable={keyTable}
          editStatus={editStatus}
          rowSelection={rowSelection}
        />
      </Spin>
    </div>
  )
}
