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
import NewStatusModalForm from './NewStatusModalForm'
import NewStatusModalTable from './NewStatusModalTable'

const { confirm } = Modal

function NewStatusModal({
  form,
  statusId,
  newStatusModal,
  setNewStatusModal,
  refreshData,
  setStatusId,
  userPermissions,
}) {
  const [editData, setEditData] = useState(null)
  const [reasonList, setReasonList] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [editReason, setEditReason] = useState(null)
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const ref = React.useRef()
  const refAlert = React.useRef()

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    setReasonList(
      editData?.motivos.map((record, index) => {
        const reason = {
          id: record.id,
          description: record.descricao,
          key: index,
        }
        return reason
      }) || [],
    )
    setEditReason(null)
  }, [editData])

  function refreshForm() {
    setCanBeUpdated(hasPermission(userPermissions, 'Alter'))
    if (statusId) {
      getStatusAndReason()
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

  async function getStatusAndReason() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/StatusMotivo`,
        params: { id: statusId },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk && data.statusCadastrado.length > 0) {
        setEditData(data.statusCadastrado[0])
      } else if (data.isOk && data.statusCadastrado.length === 0) {
        message.error(formatMessage({ id: 'recordNotFound' }))
        setNewStatusModal(false)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function checkInitialStatus() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/StatusMotivo`,
        params: { docimento: 1, statusInicial: true },
      })
      const { data } = response
      if (
        data.isOk &&
        data.statusCadastrado.length > 0 &&
        (!statusId || statusId !== data.statusCadastrado[0].id)
      ) {
        confirm({
          title: 'Atenção',
          content: `Já existe o status '${data.statusCadastrado[0].descricao}' como sendo inicial. Deseja configurar este status como inicial?`,
          onCancel: () => {
            form.setFieldsValue({ initial: false })
          },
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
    } catch (error) {
      handleAuthError(error)
    }
  }

  function handleSave(addAnother) {
    setAlertMessages([])
    form.validateFieldsAndScroll(
      ['description', 'color', 'status', 'initial'],
      { force: true },
      (err, values) => {
        if (err) {
          fieldsValidationToast(err)
        } else {
          saveStatusAndReason(addAnother)
        }
      },
    )
  }

  async function saveStatusAndReason(addAnother) {
    setIsSaving(true)
    setLoading(true)
    const statusBody = {
      id: statusId,
      descricao: form.getFieldValue('description'),
      status: form.getFieldValue('status'),
      cor: form.getFieldValue('color'),
      statusInicial: form.getFieldValue('initial'),
      motivos: reasonList.map(record => {
        const reason = { id: record.id, descricao: record.description }
        return reason
      }),
    }

    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/StatusMotivo`,
        data: statusBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        refreshData()
        if (addAnother) {
          setStatusId(null)
          form.resetFields()
          setEditData(null)
          setReasonList([])
          if (ref.current) {
            ref.current.focus()
          }
        } else {
          setNewStatusModal(false)
        }
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
      } else {
        setAlertMessages(data.notificacoes)

        if (refAlert.current) {
          refAlert.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }

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
        id: 'occurrenceRoutine.statusAndReason.statusAndReason',
      })}
      centered
      width="620px"
      visible={newStatusModal}
      onCancel={() => setNewStatusModal(false)}
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
            onClick={() => setNewStatusModal(false)}
          >
            {formatMessage({ id: 'cancelButton' })}
          </Button>
        </Row>
      }
    >
      <Spin size="large" spinning={loading}>
        <div className="mb-2" ref={refAlert}>
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
          paragraph={{ rows: 8 }}
          active
        />

        <div style={{ display: loading && !isSaving ? 'none' : 'block' }}>
          <NewStatusModalForm
            form={form}
            ref={ref}
            editData={editData}
            reasonList={reasonList}
            setReasonList={setReasonList}
            editReason={editReason}
            setEditReason={setEditReason}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            canBeUpdated={canBeUpdated}
            refreshForm={refreshForm}
            newStatusModal={newStatusModal}
            checkInitialStatus={checkInitialStatus}
          />
          <NewStatusModalTable
            reasonList={reasonList}
            setEditReason={setEditReason}
            setSelectedRows={setSelectedRows}
            canBeUpdated={canBeUpdated}
            editReason={editReason}
          />
        </div>
      </Spin>
    </Modal>
  )
}

NewStatusModal.propTypes = {
  form: PropTypes.any,
  newStatusModal: PropTypes.bool,
  setNewStatusModal: PropTypes.any,
  statusId: PropTypes.string,
  refreshData: PropTypes.func,
  setStatusId: PropTypes.func,
  userPermissions: PropTypes.array,
}

const WrappedNewStatusModal = Form.create()(NewStatusModal)
export default WrappedNewStatusModal
