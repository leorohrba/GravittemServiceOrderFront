/* eslint-disable react/jsx-boolean-value */
import { Form } from '@ant-design/compatible'
import { Badge, Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

const NewPriorityModalForm = React.forwardRef((props, ref) => {
  const {
    form,
    editData,
    visiblePriorityModal,
    refreshForm,
    canBeUpdated,
  } = props

  useEffect(() => {
    if (visiblePriorityModal) {
      refreshForm()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePriorityModal])

  const { getFieldDecorator } = form

  const colorOptions = [
    { color: '#4CAF50' },
    { color: '#FDD835' },
    { color: '#FB8C00' },
    { color: '#D32F2F' },
    { color: '#AB47BC' },
    { color: '#1976D2' },
    { color: '#26C6DA' },
    { color: '#795548' },
    { color: '#F06292' },
    { color: '#3949AB' },
  ]

  return (
    <Form layout="vertical">
      <Row type="flex" gutter={8}>
        <Col style={{ width: '75%' }}>
          <Form.Item label="Descrição">
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
            })(<Input ref={ref} autoFocus disabled={!canBeUpdated} />)}
          </Form.Item>
        </Col>
        <Col style={{ width: '25%' }}>
          <Form.Item label="Cor">
            {getFieldDecorator('color', {
              initialValue: editData ? editData.cor : '',
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
                dropdownMenuStyle={{
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                {colorOptions.map(c => (
                  <Option value={c.color}>
                    <i
                      className="fa fa-exclamation-circle fa-lg"
                      style={{
                        color: c.color,
                      }}
                    />
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label={formatMessage({
          id: 'occurrenceRoutine.priority.status',
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

NewPriorityModalForm.propTypes = {
  editData: PropTypes.any,
  form: PropTypes.any,
  refreshForm: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  visiblePriorityModal: PropTypes.bool,
}

export default NewPriorityModalForm
