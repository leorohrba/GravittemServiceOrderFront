import { Form } from '@ant-design/compatible'
import { Checkbox } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function DataProviderModalForm({ form, providers }) {
  const { getFieldDecorator } = form
  return (
    <Form.Item>
      {getFieldDecorator(
        'providers',
        {},
      )(
        <Checkbox.Group>
          {providers.map(d => (
            <React.Fragment>
              <Checkbox value={d.id} className="mb-3">
                {d.provider}
              </Checkbox>
              <br />
            </React.Fragment>
          ))}
        </Checkbox.Group>,
      )}
    </Form.Item>
  )
}

DataProviderModalForm.propTypes = {
  providers: PropTypes.shape({
    map: PropTypes.func,
  }),
  form: PropTypes.any,
}
