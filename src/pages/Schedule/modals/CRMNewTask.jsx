/* eslint-disable react/jsx-no-bind */
// import { Form } from '@ant-design/compatible'
import { hasPermission, getPermissions } from '@utils'
import { Col, Modal, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useScheduleContext } from '../context/ScheduleContext'
import CRMTaskModal from './CRMTaskModal.tsx'

function CRMNewTask(props) {
  const { visibleTaskModal, setVisibleTaskModal, editTaskId } = props

  const { setUpdateKey } = useScheduleContext()

  const [newModal, setNewModal] = useState(true)

  const [userPermissions, setUserPermissions] = useState([])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  const canBeUpdated = hasPermission(userPermissions, 'Alter')

  const [editData, setEditData] = useState()

  const [loadingForm, setLoadingForm] = useState(true)

  useEffect(() => {
    setPermissions()
  }, [])

  function handleCancel() {
    setVisibleTaskModal(false)
    setEditData(undefined)
    setUpdateKey(key => key + 1)
  }

  return (
    <Modal
      visible={visibleTaskModal}
      bodyStyle={{ paddingBottom: 0, paddingTop: 0 }}
      title={
        <Row align="middle" type="flex">
          <Col>
            {editTaskId === 0
              ? 'Nova tarefa'
              : canBeUpdated
              ? 'Alterar tarefa'
              : 'Consultar tarefa'}
          </Col>
        </Row>
      }
      width="770px"
      // onOk={e => handleSubmit(e, false)}
      onCancel={handleCancel}
      centered
      footer={null}
    >
      <CRMTaskModal
        show={visibleTaskModal}
        taskId={editTaskId}
        handleClose={handleCancel}
        newModal={newModal}
        editData={editData}
        setEditData={setEditData}
        loadingForm={loadingForm}
        setLoadingForm={setLoadingForm}
      />
    </Modal>
  )
}

export default CRMNewTask
