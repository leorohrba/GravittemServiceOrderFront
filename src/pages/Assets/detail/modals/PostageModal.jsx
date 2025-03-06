import { Button, Form, message, Modal, Row } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'
import PostageModalForm from './PostageModalForm'

export default function PostageModal() {
  const { visiblePostageModal, setVisiblePostageModal } = useNewAssetContext()

  const [form] = Form.useForm()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      setVisiblePostageModal(false)
    })
  }

  return (
    <Modal
      title="Postagem"
      visible={visiblePostageModal}
      onCancel={() => setVisiblePostageModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button onClick={() => setVisiblePostageModal(false)}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <PostageModalForm {...{ form }} />
    </Modal>
  )
}
