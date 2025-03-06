import { Button, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import NewItemModalForm from './NewItemModalForm'
import NewItemModalSearch from './NewItemModalSearch'

export default function NewItemModal() {
  const { visibleItemModal, setVisibleItemModal } = useNewServiceOrderContext()
  const [selectedRows, setSelectedRows] = useState([])
  const [showForm, setShowForm] = useState(true)

  function handleClose() {
    setSelectedRows([])
    setShowForm(false)
    setVisibleItemModal(false)
  }

  return (
    <Modal
      title="Novo item"
      visible={visibleItemModal}
      width="60%"
      onCancel={handleClose}
      footer={
        <Row type="flex">
          {showForm ? (
            <Button
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
            >
              Salvar
            </Button>
          ) : (
            <Button
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
              disabled={selectedRows.length === 0}
              onClick={() => setShowForm(true)}
            >
              Adicionar
            </Button>
          )}
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
      {showForm ? (
        <NewItemModalForm />
      ) : (
        <NewItemModalSearch {...{ selectedRows, setSelectedRows }} />
      )}
    </Modal>
  )
}
