import { getLocaleCurrency } from '@utils'
import { Col, Form, Input, InputNumber } from 'antd'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewPurchaseOrderContext } from '../context/NewPurchaseOrderContext'

export default function NewPurchaseOrderTableFooter() {
  const {
    form,
    resumeQuantity,
    resumeTotal,
    total,
    setTotal,
  } = useNewPurchaseOrderContext()

  function handleChange(frete) {
    setTotal(resumeTotal + frete)
  }
  return (
    <Form layout="vertical" form={form} className="mt-2 mb-3">
      <div className="flex justify-between mb-3">
        <span>Resumo</span>
        <span style={{ marginRight: '32%' }}>{resumeQuantity}</span>
        <span style={{ marginRight: '26%' }}>
          {formatNumber(resumeTotal, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Frete</span>
        <Col style={{ marginRight: '24%' }}>
          <Form.Item name="valorFrete" initialValue={0} className="mb-1">
            <InputNumber
              precision={2}
              decimalSeparator=","
              formatter={value => value && `R$ ${value}`}
              parser={value => value.replace('R$ ', '')}
              onChange={handleChange}
            />
          </Form.Item>
        </Col>
      </div>
      <div className="flex justify-between">
        <h2 className="font-semibold">Total</h2>
        <h2 className="font-semibold" style={{ marginRight: '24%' }}>
          {formatNumber(total, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </h2>
      </div>
      <Form.Item label="Condição de pagamento" name="condicaoPagamento">
        <Input.TextArea />
      </Form.Item>
    </Form>
  )
}
