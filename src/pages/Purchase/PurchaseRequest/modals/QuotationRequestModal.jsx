import { Button, Form, message, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { usePurchaseRequestContext } from '../context/PurchaseRequestContext'
import QuotationRequestModalForm from './QuotationRequestModalForm'

export default function QuotationRequestModal() {
  const {
    visibleQuotationRequestModal,
    setVisibleQuotationRequestModal,
    setSelectedRows,
  } = usePurchaseRequestContext()

  const [selectedProvider, setSelectedProvider] = useState({})

  const [form] = Form.useForm()
  function handleSave() {
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    handleClose()
  }

  function handleClose() {
    setSelectedRows([])
    form.resetFields()
    setVisibleQuotationRequestModal(false)
  }
  return (
    <Modal
      title="Solicitação de cotação"
      visible={visibleQuotationRequestModal}
      destroyOnClose
      footer={
        <Row>
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button type="secondary" className="ml-3" onClick={handleClose}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <QuotationRequestModalForm
        {...{ form, selectedProvider, setSelectedProvider }}
      />
    </Modal>
  )
}
