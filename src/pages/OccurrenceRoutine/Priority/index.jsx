/**
 * breadcrumb: Prioridade
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
import PriorityHeader from './components/PriorityHeader'
import PriorityTable from './components/PriorityTable'
import NewPriorityModal from './modals/NewPriorityModal'

const { confirm } = Modal

const params = {
  id: null,
  descricao: null,
  ativo: null,
}

export default function Priority() {
  const [selectedRows, setSelectedRows] = useState([])
  const [visiblePriorityModal, setVisiblePriorityModal] = useState(false)

  const [data, setData] = useState([])
  const [id, setId] = useState(0)
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
    params.ativo = null
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Prioridade`,
        params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.prioridade)
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

  function confirmDeletePriority() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deletePriority(),
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
  async function deletePriority() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'DELETE',
        url: `/api/Prioridade`,
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
      params.ativo = searchFieldValue
    }
  }

  const editPriority = idToEdit => {
    setId(idToEdit)
    setVisiblePriorityModal(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="container">
      <NewPriorityModal
        id={id}
        setId={setId}
        userPermissions={userPermissions}
        refreshData={() => getData()}
        key={keyModal}
        visiblePriorityModal={visiblePriorityModal}
        setVisiblePriorityModal={setVisiblePriorityModal}
      />
      <Spin spinning={loading} size="large">
        <PriorityHeader
          userPermissions={userPermissions}
          editPriority={editPriority}
          selectedRows={selectedRows}
          startSearch={startSearch}
          setSearchValues={setSearchValues}
          confirmDeletePriority={confirmDeletePriority}
        />
        <PriorityTable
          data={data}
          userPermissions={userPermissions}
          keyTable={keyTable}
          editPriority={editPriority}
          rowSelection={rowSelection}
        />
      </Spin>
    </div>
  )
}
