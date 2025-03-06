/* eslint-disable no-unused-vars */
import { Button, Form, message, Modal } from 'antd'
import { convertToRaw, EditorState } from 'draft-js'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNotificationManagementDataContext } from '../context/NotificationManagementData'
import NewNotificationModalForm from './NewNotificationModalForm'

export default function NewNotificationModal() {
  const {
    newNotificationModal,
    setNewNotificationModal,
  } = useNotificationManagementDataContext()

  const [form] = Form.useForm()
  const [tags, setTags] = useState([])
  const [textContent, setTextContent] = useState(EditorState.createEmpty())

  const handleSave = async () => {
    const dataToServer = JSON.stringify(
      convertToRaw(textContent.getCurrentContent()),
    )
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
    })
  }

  function handleClose() {
    form.resetFields()
    setTags([])
    setTextContent(EditorState.createEmpty())
    setNewNotificationModal(false)
  }

  return (
    <Modal
      title="Nova notificação"
      visible={newNotificationModal}
      onCancel={handleClose}
      destroyOnClose
      footer={
        <div className="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Enviar
          </Button>
          <Button type="secondary" className="ml-3" onClick={handleClose}>
            Cancelar
          </Button>
        </div>
      }
    >
      <NewNotificationModalForm
        {...{
          form,
          tags,
          setTags,
          textContent,
          setTextContent,
        }}
      />
    </Modal>
  )
}
