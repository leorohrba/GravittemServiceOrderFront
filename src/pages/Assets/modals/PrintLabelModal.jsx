import { Button, Form, message, Modal, Row } from 'antd'
import React from 'react'
import { useAssetContext } from '../context/AssetContext'
import PrintLabelModalForm from './PrintLabelModalForm'

export default function PrintLabelModal() {
  const {
    visiblePrintLabelModal,
    setVisiblePrintLabelModal,
  } = useAssetContext()

  const [form] = Form.useForm()

  function printLabel() {
    form.validateFields().then(values => {
      message.success('Impressão realizada com sucesso!')
      form.resetFields()
      setVisiblePrintLabelModal(false)
    })
  }

  return (
    <Modal
      title="Imprimir etiqueta"
      width={450}
      visible={visiblePrintLabelModal}
      onCancel={() => setVisiblePrintLabelModal(false)}
      destroyOnClose
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={printLabel}
          >
            Imprimir etiqueta
          </Button>
          <Button
            type="secondary"
            onClick={() => setVisiblePrintLabelModal(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <PrintLabelModalForm {...{ form }} />
    </Modal>
  )
}
