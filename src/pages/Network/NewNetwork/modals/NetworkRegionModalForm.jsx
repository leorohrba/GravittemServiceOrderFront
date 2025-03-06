import { Form } from '@ant-design/compatible'
import { InputNumber, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function NetworkRegionModalForm({ form }) {
  const { getFieldDecorator } = form

  const [selectedType, setSelectedType] = useState(1)

  return (
    <Form layout="vertical">
      <Form.Item label="Definir regiões por">
        {getFieldDecorator('regionsBy', {
          initialValue: selectedType,
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ],
        })(
          <Select onChange={e => setSelectedType(e)}>
            <Option value={1}>CEP/Bairro</Option>
            <Option value={2}>Raio</Option>
          </Select>,
        )}
      </Form.Item>
      {selectedType === 2 && (
        <Form.Item label="Raio">
          {getFieldDecorator('raio', {
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
            <InputNumber
              formatter={value => `${value} km`}
              parser={value => value.replace(' km', '')}
              style={{ width: '50%' }}
            />,
          )}
        </Form.Item>
      )}
    </Form>
  )
}

NetworkRegionModalForm.propTypes = {
  form: PropTypes.any,
}
