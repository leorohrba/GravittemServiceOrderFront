import { Button, Form, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewNotificationTypeModalForm from './NewNotificationTypeModalForm'

export default function NewNotificationTypeModal({
  newNotificationModal,
  setNewNotificationModal,
  editData,
}) {
  const [form] = Form.useForm()

  const handleSave = async () => {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
      setNewNotificationModal(false)
    })
  }

  return (
    <Modal
      title="Tipo de notificação"
      visible={newNotificationModal}
      width={612}
      onCancel={() => setNewNotificationModal(false)}
      footer={
        <div className="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            style={{
              marginRight: 'auto',
            }}
            onClick={() => setNewNotificationModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <NewNotificationTypeModalForm {...{ form, editData }} />
    </Modal>
  )
}

NewNotificationTypeModal.propTypes = {
  editData: PropTypes.object,
  newNotificationModal: PropTypes.bool,
  setNewNotificationModal: PropTypes.func,
}
