import { Form } from '@ant-design/compatible'
import { Checkbox, List } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

function UsersList({ form, content, editData }) {
  const { getFieldDecorator } = form
  return (
    <div>
      <List className="-mt-4" size="small">
        {content.map((c, index) => (
          <List.Item>
            <Form.Item>
              {getFieldDecorator(`${c.field}`, {
                initialValue: editData && editData.usuarios[index],
                valuePropName: 'checked',
              })(
                <Checkbox className="flex mt-2 -mb-5">
                  <div className="text-base ml-4">{c.text}</div>
                </Checkbox>,
              )}
            </Form.Item>
          </List.Item>
        ))}
      </List>
    </div>
  )
}
UsersList.propTypes = {
  editData: PropTypes.any,
  form: PropTypes.any,
  content: PropTypes.any,
}
export default UsersList
