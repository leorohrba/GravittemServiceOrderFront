import { Alert, Button } from 'antd'
import React from 'react'
import { useQuotationDataContext } from '../context/QuotationDataContext'

export default function QuotationDataFooter() {
  const {
    solicitante,
    fornecedor,
    form,
    showFeedback,
    setShowFeedback,
  } = useQuotationDataContext()

  function handleSave() {
    form.resetFields()
    setShowFeedback(true)
  }

  return (
    <div>
      <Button type="primary" onClick={handleSave}>
        Confirmar
      </Button>
      {showFeedback && (
        <Alert
          className="mt-4"
          message={`E-mail enviado automaticamente para o solicitante (${solicitante}) com cópia para o fornecedor (${fornecedor.email})`}
          type="success"
          showIcon
        />
      )}
    </div>
  )
}
