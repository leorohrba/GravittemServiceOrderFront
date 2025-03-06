import { Button, Form, message, Modal, Row } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useAssetContext } from '../context/AssetContext'
import GenerateServiceOrderModalForm from './GenerateServiceOrderModalForm'

export default function GenerateServiceOrderModal() {
  const {
    visibleGenerateSOModal,
    setVisibleGenerateSOModal,
  } = useAssetContext()

  const [form] = Form.useForm()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      setVisibleGenerateSOModal(false)
    })
  }

  return (
    <Modal
      title="Gerar ordem de serviço"
      visible={visibleGenerateSOModal}
      onCancel={() => setVisibleGenerateSOModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Gerar ordem de serviço
          </Button>
          <Button onClick={() => setVisibleGenerateSOModal(false)}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <GenerateServiceOrderModalForm {...{ form }} />
    </Modal>
  )
}
