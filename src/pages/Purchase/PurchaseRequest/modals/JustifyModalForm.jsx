import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { TextArea } = Input

export default function JustifyModalForm({ form }) {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        label="Descrição"
        name="justificativa"
        initialValue=""
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <TextArea
          autoSize={{
            minRows: 3,
            maxRows: 5,
          }}
        />
      </Form.Item>
    </Form>
  )
}

JustifyModalForm.propTypes = {
  form: PropTypes.any,
}
