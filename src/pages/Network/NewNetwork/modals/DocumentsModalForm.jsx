import { Form } from '@ant-design/compatible'
import { Checkbox } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function DocumentsModalForm({ form, documents }) {
  const { getFieldDecorator } = form
  return (
    <Form.Item>
      {getFieldDecorator(
        'documents',
        {},
      )(
        <Checkbox.Group>
          {documents.map(d => (
            <React.Fragment>
              <Checkbox value={d.id} className="mb-3">
                {d.document}
              </Checkbox>
              <br />
            </React.Fragment>
          ))}
        </Checkbox.Group>,
      )}
    </Form.Item>
  )
}

DocumentsModalForm.propTypes = {
  documents: PropTypes.shape({
    map: PropTypes.func,
  }),
  form: PropTypes.any,
}
