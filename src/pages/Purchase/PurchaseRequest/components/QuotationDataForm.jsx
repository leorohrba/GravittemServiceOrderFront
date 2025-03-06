import { getLocaleCurrency } from '@utils'
import { Card, Col, Form, Input, InputNumber, List, Row } from 'antd'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useQuotationDataContext } from '../context/QuotationDataContext'

export default function QuotationDataForm() {
  const { form, total, subtotal } = useQuotationDataContext()

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col sm={24} md={12}>
          <h3 className="my-2">
            Preencha as condições de prazo, validade e pagamento.
          </h3>
          <Card size="small" title={<h2>Condições</h2>}>
            <List>
              <List.Item className="flex justify-between">
                <p>Prazo de entrega estimado (dias)</p>
                <Form.Item name="prazo" className="mb-0">
                  <InputNumber />
                </Form.Item>
              </List.Item>
              <List.Item className="flex justify-between">
                <p>Validade dessa cotação (dias)</p>
                <Form.Item name="validade" className="mb-0">
                  <InputNumber />
                </Form.Item>
              </List.Item>
              <List.Item className="flex justify-between">
                <p>Condição de pagamento</p>
                <Form.Item name="condicao" className="mb-0">
                  <Input.TextArea />
                </Form.Item>
              </List.Item>
            </List>
          </Card>
        </Col>
        <Col sm={24} md={12}>
          <h3 className="my-2">
            Preencha o valor de frete e desconto caso necessário.
          </h3>
          <Card size="small" title={<h2>Valores</h2>}>
            <List>
              <List.Item className="flex justify-between">
                <p>Subtotal</p>
                <p>
                  {formatNumber(subtotal || 0, {
                    style: 'currency',
                    currency: getLocaleCurrency(),
                  })}
                </p>
              </List.Item>
              <List.Item className="flex justify-between">
                <p>Frete (+)</p>
                <Form.Item name="frete" className="mb-0">
                  <InputNumber
                    decimalSeparator=","
                    formatter={value => value && `R$ ${value}`}
                    parser={value => value.replace('R$ ', '')}
                    precision={2}
                  />
                </Form.Item>
              </List.Item>
              <List.Item className="flex justify-between">
                <h2 className="font-bold">Total</h2>
                <p>
                  {formatNumber(total || 0, {
                    style: 'currency',
                    currency: getLocaleCurrency(),
                  })}
                </p>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>
      <Form.Item label="Observação" name="observacao" className="mt-2">
        <Input.TextArea />
      </Form.Item>
    </Form>
  )
}
