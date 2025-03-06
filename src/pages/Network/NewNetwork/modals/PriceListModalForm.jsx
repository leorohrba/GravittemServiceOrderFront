import { Form } from '@ant-design/compatible'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function PriceListModalForm({ form, priceList }) {
  const { getFieldDecorator } = form
  return (
    <Form layout="vertical">
      <Form.Item label="Nome da lista">
        {getFieldDecorator('list', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ],
        })(
          <Select>
            {priceList.map(e => (
              <Option key={e.id} value={e.id}>
                {e.name}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
}
PriceListModalForm.propTypes = {
  form: PropTypes.any,
  priceList: PropTypes.shape({
    map: PropTypes.func,
  }),
}
