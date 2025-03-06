import { Button, message, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useAssetContext } from '../context/AssetContext'
import TagModalForm from './TagModalForm'

export default function TagModal() {
  const { visibleTagModal, setVisibleTagModal } = useAssetContext()
  const [selectedTags, setSelectedTags] = useState([])

  function handleSave() {
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    handleClose()
  }

  function handleClose() {
    setSelectedTags([])
    setVisibleTagModal(false)
  }

  return (
    <Modal
      title="Vincular tag"
      visible={visibleTagModal}
      centered
      onCancel={handleClose}
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
          <Button type="secondary" className="ml-3" onClick={handleClose}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <TagModalForm {...{ selectedTags, setSelectedTags }} />
    </Modal>
  )
}
