import { Button, Modal, Row } from 'antd'
import React from 'react'
import { useNewFieldContext } from '../context/DocumentGeneratorContext'
import NewFieldModalForm from './NewFieldModalForm'

export default function NewFieldModal() {
  const { NewFieldModalVisible, setNewFieldModalVisible } = useNewFieldContext()

  return (
    <Modal
      title="Cadastrar campo"
      visible={NewFieldModalVisible}
      destroyOnClose
      onCancel={() => setNewFieldModalVisible(false)}
      footer={
        <Row>
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => setNewFieldModalVisible(false)}
          >
            Salvar
          </Button>
          <Button onClick={() => setNewFieldModalVisible(false)}>Voltar</Button>
        </Row>
      }
    >
      <NewFieldModalForm />
    </Modal>
  )
}
