/**
 * breadcrumb: Tipo de notificação
 */
import React, { useState } from 'react'
import NotificationTypeHeader from './components/NotificationTypeHeader'
import NotificationTypeTable from './components/NotificationTypeTable'
import NewNotificationTypeModal from './modals/NewNotificationTypeModal'

export default function NotificationType() {
  const [newNotificationModal, setNewNotificationModal] = useState(false)
  const [tags, setTags] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [selectedRows, setSelectedRows] = useState([])
  const [editData, setEditData] = useState({})
  const tableData = [{ id: 1, descricao: 'Marketing', status: 1 }]

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const handleEdit = edit => {
    setEditData(edit || {})
    setNewNotificationModal(true)
  }

  return (
    <div className="container">
      <NewNotificationTypeModal
        {...{ newNotificationModal, setNewNotificationModal, editData }}
      />
      <NotificationTypeHeader {...{ tags, setTags, setNewNotificationModal }} />
      <NotificationTypeTable {...{ tableData, rowSelection, handleEdit }} />
    </div>
  )
}
