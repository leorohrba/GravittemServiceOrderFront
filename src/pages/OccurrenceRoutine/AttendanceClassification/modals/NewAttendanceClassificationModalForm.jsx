import { Form } from '@ant-design/compatible'
import { Badge, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

const NewAttendanceClassificationModalForm = React.forwardRef((props, ref) => {
  const {
    form,
    editData,
    visibleAttendanceClassificationModal,
    refreshForm,
    canBeUpdated,
  } = props

  useEffect(() => {
    if (visibleAttendanceClassificationModal) {
      refreshForm()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleAttendanceClassificationModal])

  const { getFieldDecorator } = form

  return (
    <Form layout="vertical">
      <Form.Item
        label={formatMessage({
          id: 'occurrenceRoutine.attendanceClassification.description',
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
          id: 'occurrenceRoutine.attendanceClassification.status',
        })}
      >
        {getFieldDecorator('status', {
          initialValue: editData ? editData.status : 1,
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
            <Option value={1}>
              <Badge style={{ color: 'green' }} color="green" text="Ativo" />
            </Option>
            <Option value={2}>
              <Badge style={{ color: 'red' }} color="red" text="Inativo" />
            </Option>
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
})

NewAttendanceClassificationModalForm.propTypes = {
  editData: PropTypes.any,
  form: PropTypes.any,
  refreshForm: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  visibleAttendanceClassificationModal: PropTypes.bool,
}

export default NewAttendanceClassificationModalForm
