import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function NewDistributionListForm({ form }) {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item label={<b>Nome da lista</b>} name="name">
        <Input
          placeholder="Digite um nome para a lista"
          style={{ width: '50%' }}
        />
      </Form.Item>
    </Form>
  )
}

NewDistributionListForm.propTypes = {
  form: PropTypes.any,
}
