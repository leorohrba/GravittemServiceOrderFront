import { Button, Form, message, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { usePurchaseRequestContext } from '../context/PurchaseRequestContext'
import JustifyModalForm from './JustifyModalForm'

export default function JustifyModal() {
  const {
    visibleJustifyModal,
    setVisibleJustifyModal,
    setSelectedRows,
  } = usePurchaseRequestContext()
  const [form] = Form.useForm()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      handleClose()
    })
  }

  function handleClose() {
    setSelectedRows([])
    form.resetFields()
    setVisibleJustifyModal(false)
  }

  return (
    <Modal
      title="Justificativa"
      visible={visibleJustifyModal}
      destroyOnClose
      onCancel={handleClose}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button type="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <JustifyModalForm {...{ form }} />
    </Modal>
  )
}
