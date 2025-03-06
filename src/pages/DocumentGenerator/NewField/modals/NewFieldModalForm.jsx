import { Form, Input, Select } from 'antd'
import React from 'react'

const { Option } = Select

export default function NewFieldModalForm() {
  return (
    <React.Fragment>
      <Form layout="vertical">
        <Form.Item label="Nome do campo">
          <Input />
        </Form.Item>
        <Form.Item label="Tipo de campo">
          <Select>
            <Option value={1}>Contato</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Caminho de acesso a api">
          <Input />
        </Form.Item>
      </Form>
    </React.Fragment>
  )
}
