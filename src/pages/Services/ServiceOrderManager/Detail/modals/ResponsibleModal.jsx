import { Button, message, Modal, Row } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import ResponsibleModalForm from './ResponsibleModalForm'
import ResponsibleModalTable from './ResponsibleModalTable'

export default function ResponsibleModal() {
  const {
    visibleResponsibleModal,
    setVisibleResponsibleModal,
  } = useNewServiceOrderContext()

  function handleSave() {
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    setVisibleResponsibleModal(false)
  }
  return (
    <Modal
      title="Responsável"
      visible={visibleResponsibleModal}
      width="60%"
      onCancel={() => setVisibleResponsibleModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => handleSave()}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            style={{
              marginRight: 'auto',
            }}
            onClick={() => setVisibleResponsibleModal(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <ResponsibleModalForm />
      <ResponsibleModalTable />
    </Modal>
  )
}
