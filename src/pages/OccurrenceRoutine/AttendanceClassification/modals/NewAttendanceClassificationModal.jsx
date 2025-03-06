import { Form } from '@ant-design/compatible'
import { apiAttendance } from '@services/api'
import {
  fieldsValidationToast,
  handleAuthError,
  hasPermission,
  showApiMessages,
} from '@utils'
import { Alert, Button, message, Modal, Row, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewAttendanceClassificationModalForm from './NewAttendanceClassificationModalForm'

function NewAttendanceClassificationModal({
  form,
  visibleAttendanceClassificationModal,
  setVisibleAttendanceClassificationModal,
  id,
  refreshData,
  userPermissions,
  setId,
}) {
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const ref = React.useRef()

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  function refreshForm() {
    setCanBeUpdated(hasPermission(userPermissions, 'Alter'))
    if (id) {
      getAttendanceClassification()
    } else {
      setEditData(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && ref.current) {
      ref.current.focus()
    }
  }, [loading])

  async function getAttendanceClassification() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/ClassificacaoAtendimento`,
        params: { id },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk && data.classificacaoAtendimento.length > 0) {
        setEditData(data.classificacaoAtendimento[0])
      } else if (data.isOk && data.classificacaoAtendimento.length === 0) {
        message.error(formatMessage({ id: 'recordNotFound' }))
        setVisibleAttendanceClassificationModal(false)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function handleSave(addAnother) {
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        saveAttendanceClassification(addAnother)
      }
    })
  }

  async function saveAttendanceClassification(addAnother) {
    setIsSaving(true)
    setLoading(true)
    const attendanceClassificationBody = {
      id,
      descricao: form.getFieldValue('description'),
      status: form.getFieldValue('status'),
    }
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/ClassificacaoAtendimento`,
        data: attendanceClassificationBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        refreshData()
        if (addAnother) {
          setId(null)
          form.resetFields()
          setEditData(null)
          if (ref.current) {
            ref.current.focus()
          }
        } else {
          setVisibleAttendanceClassificationModal(false)
        }
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      handleAuthError(error)
    }
  }

  return (
    <Modal
      title={formatMessage({
        id:
          'occurrenceRoutine.attendanceClassification.attendanceClassification',
      })}
      visible={visibleAttendanceClassificationModal}
      onCancel={() => setVisibleAttendanceClassificationModal(false)}
      centered
      footer={
        <Row type="flex">
          {(!loading || isSaving) && canBeUpdated && (
            <React.Fragment>
              <Button
                loading={isSaving}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                }}
                onClick={() => handleSave(false)}
              >
                {formatMessage({ id: 'saveButton' })}
              </Button>
              <Button
                loading={isSaving}
                ghost
                style={{
                  color: '#4CAF50',
                  border: '1px solid #4CAF50',
                  marginRight: 'auto',
                }}
                onClick={() => handleSave(true)}
              >
                {formatMessage({ id: 'saveAndAddAnother' })}
              </Button>
            </React.Fragment>
          )}
          <Button
            type="secondary"
            style={{
              marginLeft: 'auto',
            }}
            onClick={() => setVisibleAttendanceClassificationModal(false)}
          >
            {formatMessage({ id: 'cancelButton' })}
          </Button>
        </Row>
      }
    >
      <Spin size="large" spinning={loading}>
        <div>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message.mensagem}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}
        </div>

        <Skeleton
          loading={loading && !isSaving}
          paragraph={{ rows: 4 }}
          active
        />

        <div style={{ display: loading && !isSaving ? 'none' : 'block' }}>
          <NewAttendanceClassificationModalForm
            form={form}
            editData={editData}
            visibleAttendanceClassificationModal={
              visibleAttendanceClassificationModal
            }
            refreshForm={refreshForm}
            canBeUpdated={canBeUpdated}
            ref={ref}
          />
        </div>
      </Spin>
    </Modal>
  )
}

NewAttendanceClassificationModal.propTypes = {
  id: PropTypes.string,
  refreshData: PropTypes.func,
  userPermissions: PropTypes.array,
  form: PropTypes.any,
  setVisibleAttendanceClassificationModal: PropTypes.any,
  visibleAttendanceClassificationModal: PropTypes.any,
  setId: PropTypes.func,
}

const WrappedNewAttendanceClassificationModal = Form.create()(
  NewAttendanceClassificationModal,
)
export default WrappedNewAttendanceClassificationModal
