import { purchaseOrderStatus } from '@pages/Purchase/enums'
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewPurchaseOrderContext } from '../context/NewPurchaseOrderContext'

const { Option } = Select

export default function NewPurchaseOrderForm() {
  const { form, provider } = useNewPurchaseOrderContext()
  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item
            label="Fornecedor"
            name="fornecedor"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Select>
              {provider.map(s => (
                <Option value={s.id}>{s.nome}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Data do pedido"
            name="dataPedido"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Solicitante" name="solicitante">
            <Select disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Origem" name="origem">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Cotação" name="cotacao">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Select>
              {purchaseOrderStatus.map(s => (
                <Option value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <div className="flex justify-between">
        <Button type="primary">Novo item</Button>
        <Button className="ml-2">
          <i className="fa fa-ellipsis-v" />
        </Button>
      </div>
    </Form>
  )
}
