import { Form } from '@ant-design/compatible'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

export default function PostageModalForm({ form }) {
  const { getFieldDecorator } = form
  return (
    <Form layout="vertical">
      <Form.Item label="Área de postagem">
        {getFieldDecorator(
          'postageArea',
          {},
        )(
          <Select placeholder="Selecionar">
            <Option value={1}>Opção 1</Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Canal de vendas NET">
        {getFieldDecorator(
          'saleChannel',
          {},
        )(
          <Select placeholder="Selecionar">
            <Option value={1}>Opção 1</Option>
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
}

PostageModalForm.propTypes = {
  form: PropTypes.any,
}
