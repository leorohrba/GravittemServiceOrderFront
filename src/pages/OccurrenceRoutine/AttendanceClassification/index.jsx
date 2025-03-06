/**
 * breadcrumb: Classificação do atendimento
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
import AttendanceClassificationHeader from './components/AttendanceClassificationHeader'
import AttendanceClassificationTable from './components/AttendanceClassificationTable'
import NewAttendanceClassificationModal from './modals/NewAttendanceClassificationModal'

const { confirm } = Modal

const params = {
  id: null,
  descricao: null,
  status: null,
}

export default function AttendanceClassification() {
  const [selectedRows, setSelectedRows] = useState([])
  const [
    visibleAttendanceClassificationModal,
    setVisibleAttendanceClassificationModal,
  ] = useState(false)

  const [data, setData] = useState([])
  const [id, setId] = useState(null)
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
    params.status = null
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/ClassificacaoAtendimento`,
        params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.classificacaoAtendimento)
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

  function confirmDeleteAttendanceClassification() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteAttendanceClassification(),
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
  async function deleteAttendanceClassification() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'DELETE',
        url: `/api/ClassificacaoAtendimento`,
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
    }
  }
  const editAttendanceClassification = idToEdit => {
    setId(idToEdit)
    setVisibleAttendanceClassificationModal(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="container">
      <NewAttendanceClassificationModal
        id={id}
        setId={setId}
        userPermissions={userPermissions}
        refreshData={() => getData()}
        key={keyModal}
        visibleAttendanceClassificationModal={
          visibleAttendanceClassificationModal
        }
        setVisibleAttendanceClassificationModal={
          setVisibleAttendanceClassificationModal
        }
      />
      <Spin spinning={loading} size="large">
        <AttendanceClassificationHeader
          userPermissions={userPermissions}
          editAttendanceClassification={editAttendanceClassification}
          selectedRows={selectedRows}
          startSearch={startSearch}
          setSearchValues={setSearchValues}
          confirmDeleteAttendanceClassification={
            confirmDeleteAttendanceClassification
          }
        />
        <AttendanceClassificationTable
          data={data}
          userPermissions={userPermissions}
          keyTable={keyTable}
          editAttendanceClassification={editAttendanceClassification}
          rowSelection={rowSelection}
        />
      </Spin>
    </div>
  )
}
