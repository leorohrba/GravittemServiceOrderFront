import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

export default function PostageModalForm({ form }) {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item label="Área de postagem" name="areaPostagem">
        <Select placeholder="Selecionar">
          <Option value={1}>Opção 1</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Canal de vendas NET" name="canalVendas">
        <Select placeholder="Selecionar">
          <Option value={1}>Opção 1</Option>
        </Select>
      </Form.Item>
    </Form>
  )
}
