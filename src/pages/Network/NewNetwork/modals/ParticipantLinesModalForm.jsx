import { Form } from '@ant-design/compatible'
import { Checkbox } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function ParticipantLinesModalForm({ form, lines }) {
  const { getFieldDecorator } = form
  return (
    <Form.Item>
      {getFieldDecorator(
        'lines',
        {},
      )(
        <Checkbox.Group>
          {lines.map(d => (
            <React.Fragment>
              <Checkbox value={d.id} className="mb-3">
                {d.line}
              </Checkbox>
              <br />
            </React.Fragment>
          ))}
        </Checkbox.Group>,
      )}
    </Form.Item>
  )
}

ParticipantLinesModalForm.propTypes = {
  lines: PropTypes.shape({
    map: PropTypes.func,
  }),
  form: PropTypes.any,
}
