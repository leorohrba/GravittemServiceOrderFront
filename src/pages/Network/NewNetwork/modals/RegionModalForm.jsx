import { Form } from '@ant-design/compatible'
import { AutoComplete, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function RegionModalForm({ form, regions }) {
  const { getFieldDecorator } = form
  return (
    <Form layout="vertical">
      <Form.Item label="Região">
        {getFieldDecorator('region', {
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
          <AutoComplete
            dataSource={regions.map(e => (
              <Option key={e.id} value={e.region}>
                {e.region}
              </Option>
            ))}
          >
            <Input.Search size="large" />
          </AutoComplete>,
        )}
      </Form.Item>
    </Form>
  )
}

RegionModalForm.propTypes = {
  form: PropTypes.any,
  regions: PropTypes.shape({
    map: PropTypes.func,
  }),
}
