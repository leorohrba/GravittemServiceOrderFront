import { Alert, Button, message } from 'antd'
import React, { useState } from 'react'
import router from 'umi/router'
import { useQuotationAnalysisDetailContext } from '../context/QuotationAnalysisDetailContext'

export default function QuotationAnalysisDetailFooter() {
  const { selectedRows, providers } = useQuotationAnalysisDetailContext()

  const [showSuccess, setShowSuccess] = useState(false)

  function generateInvoice() {
    if (selectedRows.length === 0) {
      message.warn('Selecione os itens para gerar o boleto.')
    } else {
      setShowSuccess(true)
    }
  }

  return (
    <div>
      <Button
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
        }}
        onClick={generateInvoice}
      >
        Gerar boleto
      </Button>
      <Button type="secondary" className="ml-3" onClick={() => router.goBack()}>
        Cancelar
      </Button>
      {showSuccess &&
        selectedRows.map(s => (
          <Alert
            type="success"
            showIcon
            message={
              <div>
                Pedido gerado para{' '}
                <b>{providers.find(p => s.fornecedor === p.id).nome}</b> com
                sucesso
              </div>
            }
            className="my-2"
          />
        ))}
    </div>
  )
}
