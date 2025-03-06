import { Button, Form, message, Modal, Row } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import ConfirmOrderModalForm from './ConfirmOrderModalForm'

export default function ConfirmOrderModal() {
  const {
    visibleConfirmOrderModal,
    setVisibleConfirmOrderModal,
  } = useNewServiceOrderContext()
  const [form] = Form.useForm()

  function saveOrder() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
      setVisibleConfirmOrderModal(false)
    })
  }

  return (
    <Modal
      title="Confirmar pedido"
      visible={visibleConfirmOrderModal}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => saveOrder()}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            style={{
              marginRight: 'auto',
            }}
            onClick={() => setVisibleConfirmOrderModal(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <ConfirmOrderModalForm {...{ form }} />
    </Modal>
  )
}
