import { Col, Form, Input, Row, Select } from 'antd'
import React from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

const { Option } = Select

export default function ConfirmOrderModalForm({ form }) {
  const { provider, orderType, installment } = useNewServiceOrderContext()

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Fornecedor" name="fornecedor">
            <Select>
              {provider.map(p => (
                <Option value={p.id}>{p.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tipo do pedido" name="tipoPedido">
            <Select>
              {orderType.map(p => (
                <Option value={p.id}>{p.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Parcelamento" name="parcelamento">
            <Select>
              {installment.map(p => (
                <Option value={p.id}>{p.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Observação" name="observacao">
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 3 }}
          placeholder="Digite aqui"
        />
      </Form.Item>
    </Form>
  )
}
