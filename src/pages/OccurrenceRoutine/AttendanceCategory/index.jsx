/**
 * breadcrumb: Categoria do atendimento
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
import AttendanceCategoryHeader from './components/AttendanceCategoryHeader'
import AttendanceCategoryTable from './components/AttendanceCategoryTable'
import NewAttendanceCategoryModal from './modals/NewAttendanceCategoryModal'

const { confirm } = Modal

const params = {
  id: null,
  descricao: null,
  status: null,
}

export default function AttendanceCategory() {
  const [selectedRows, setSelectedRows] = useState([])
  const [
    visibleAttendanceCategoryModal,
    setVisibleAttendanceCategoryModal,
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
        url: `/api/CategoriaAtendimento`,
        params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.categoriaAtendimento)
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

  function confirmDeleteAttendanceCategory() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteAttendanceCategory(),
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
  
  async function deleteAttendanceCategory() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'DELETE',
        url: `/api/CategoriaAtendimento`,
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
  const editAttendanceCategory = idToEdit => {
    setId(idToEdit)
    setVisibleAttendanceCategoryModal(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="container">
      <NewAttendanceCategoryModal
        id={id}
        setId={setId}
        userPermissions={userPermissions}
        refreshData={() => getData()}
        key={keyModal}
        visibleAttendanceCategoryModal={
          visibleAttendanceCategoryModal
        }
        setVisibleAttendanceCategoryModal={
          setVisibleAttendanceCategoryModal
        }
      />
      <Spin spinning={loading} size="large">
        <AttendanceCategoryHeader
          userPermissions={userPermissions}
          editAttendanceCategory={editAttendanceCategory}
          selectedRows={selectedRows}
          startSearch={startSearch}
          setSearchValues={setSearchValues}
          confirmDeleteAttendanceCategory={
            confirmDeleteAttendanceCategory
          }
        />
        <AttendanceCategoryTable
          data={data}
          userPermissions={userPermissions}
          keyTable={keyTable}
          editAttendanceCategory={editAttendanceCategory}
          rowSelection={rowSelection}
        />
      </Spin>
    </div>
  )
}
