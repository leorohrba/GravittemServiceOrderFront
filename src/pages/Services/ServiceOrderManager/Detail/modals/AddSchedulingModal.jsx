import { Button, Form, message, Modal, Row } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import AddSchedulingModalForm from './AddSchedulingModalForm'

export default function AddSchedulingModal() {
  const {
    visibleSchedulingModal,
    setVisibleSchedulingModal,
  } = useNewServiceOrderContext()

  const [form] = Form.useForm()

  function saveService() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
    })
    setVisibleSchedulingModal(false)
  }

  return (
    <Modal
      title="Agendamento"
      visible={visibleSchedulingModal}
      width="70%"
      onCancel={() => setVisibleSchedulingModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => saveService()}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            style={{
              marginRight: 'auto',
            }}
            onClick={() => setVisibleSchedulingModal(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <AddSchedulingModalForm {...{ form }} />
    </Modal>
  )
}
