import { Col, Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

export default function ContractBlock() {
  return (
    <Form layout="vertical">
      <Col span={6}>
        <Form.Item label="Contrato">
          <Select showSearch suffixIcon={<i className="fa fa-search" />}>
            <Option value={1}>Teste</Option>
          </Select>
        </Form.Item>
      </Col>
    </Form>
  )
}
