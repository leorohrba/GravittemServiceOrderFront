import { Button, Form, message, Modal, Row } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import AddServiceModalForm from './AddServiceModalForm'

export default function AddServiceModal({ selectedService }) {
  const {
    setServicesTableData,
    visibleServiceModal,
    setVisibleServiceModal,
  } = useNewServiceOrderContext()

  const [form] = Form.useForm()

  function handleClose() {
    form.resetFields()
    setVisibleServiceModal(false)
  }

  function handleSave() {
    form.validateFields().then(values => {
      setServicesTableData(services => [...services, values])
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
      setVisibleServiceModal(false)
    })
  }

  return (
    <Modal
      title="Serviço"
      visible={visibleServiceModal}
      width="60%"
      onCancel={handleClose}
      footer={
        <Row type="flex">
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
            className="ml-3"
            style={{
              marginRight: 'auto',
            }}
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <AddServiceModalForm {...{ form, selectedService }} />
    </Modal>
  )
}
