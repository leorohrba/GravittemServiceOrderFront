/* eslint-disable react/jsx-boolean-value */
import { Form } from '@ant-design/compatible'
import { Badge, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

const NewAttendanceChannelModalForm = React.forwardRef((props, ref) => {
  const {
    form,
    editData,
    visibleAttendanceChannelModal,
    refreshForm,
    canBeUpdated,
  } = props

  useEffect(() => {
    if (visibleAttendanceChannelModal) {
      refreshForm()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleAttendanceChannelModal])

  const { getFieldDecorator } = form

  return (
    <Form layout="vertical">
      <Form.Item
        label={formatMessage({
          id: 'occurrenceRoutine.attendanceChannel.description',
        })}
      >
        {getFieldDecorator('description', {
          initialValue: editData ? editData.descricao : '',
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ],
        })(
          <Input
            ref={ref}
            autoFocus
            disabled={!canBeUpdated}
            style={{
              width: '100%',
            }}
          />,
        )}
      </Form.Item>
      <Form.Item
        label={formatMessage({
          id: 'occurrenceRoutine.attendanceChannel.status',
        })}
      >
        {getFieldDecorator('status', {
          initialValue: editData ? editData.ativo : true,
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ],
        })(
          <Select
            disabled={!canBeUpdated}
            style={{
              width: '50%',
            }}
          >
            <Option value={true}>
              <Badge style={{ color: 'green' }} color="green" text="Ativo" />
            </Option>
            <Option value={false}>
              <Badge style={{ color: 'red' }} color="red" text="Inativo" />
            </Option>
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
})

NewAttendanceChannelModalForm.propTypes = {
  editData: PropTypes.any,
  form: PropTypes.any,
  refreshForm: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  visibleAttendanceChannelModal: PropTypes.bool,
}

export default NewAttendanceChannelModalForm
