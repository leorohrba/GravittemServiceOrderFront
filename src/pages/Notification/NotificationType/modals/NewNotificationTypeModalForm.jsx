import { defaultStatus } from '@pages/financial/enums'
import { Col, Form, Input, Radio, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function NewNotificationTypeModalForm({ form, editData }) {
  const icons = [
    'phone',
    'users',
    'user',
    'comment',
    'video-camera',
    'paper-plane',
    'thumbs-o-up',
    'comments',
    'hourglass-end',
    'flag',
    'calendar',
    'camera',
  ]

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Tipo"
            name="type"
            initialValue={editData.descricao}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Status"
            name="status"
            initialValue={editData.status || 1}
          >
            <Select>
              {defaultStatus.map(s => (
                <Option value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="icon" initialValue={editData.icon} className="mb-0 mt-1">
        <Radio.Group>
          {icons.map(i => (
            <Radio.Button value={i}>
              <i className={`fa fa-${i} fa-lg`} />
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
    </Form>
  )
}

NewNotificationTypeModalForm.propTypes = {
  editData: PropTypes.object,
  form: PropTypes.any,
}
