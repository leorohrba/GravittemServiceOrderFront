import { warrantyStatus } from '@pages/Services/enums'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import React from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

const { Option } = Select

export default function WarrantyBlockForm({ form }) {
  const { setVisibleAuditHistoryModal } = useNewServiceOrderContext()

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16} className="items-center">
        <Col span={6}>
          <Form.Item label="Número de ordem de serviço de fábrica">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Status da garantia">
            <Select>
              {warrantyStatus.map(w => (
                <Option value={w.id}>{w.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Button
            style={{
              color: '#2d73d0',
              borderColor: '#2d73d0',
            }}
            onClick={() => setVisibleAuditHistoryModal(true)}
          >
            <i className="fa fa-history fa-lg mr-3" />
            Histórico da auditoria
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
