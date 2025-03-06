import { Form } from '@ant-design/compatible'
import { defaultStatus } from '@pages/financial/enums'
import { Col, DatePicker, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function EditParticipantModalForm({ form, editData }) {
  const { getFieldDecorator } = form
  return (
    <Form layout="vertical">
      <Form.Item label="Participante">
        {getFieldDecorator('participante', {
          initialValue: editData.participante,
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Credenciamento">
            {getFieldDecorator('credenciamento', {
              initialValue: editData.credenciamento,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(<DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Descredenciamento">
            {getFieldDecorator('descredenciamento', {
              initialValue: editData.descredenciamento,
            })(<DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Status">
        {getFieldDecorator('status', {
          initialValue: editData.status,
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ],
        })(
          <Select style={{ width: '50%' }}>
            {defaultStatus.map(s => (
              <Option value={s.id}>{s.name}</Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
}

EditParticipantModalForm.propTypes = {
  editData: PropTypes.any,
  form: PropTypes.any,
}
