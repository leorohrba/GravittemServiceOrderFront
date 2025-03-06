import { Form } from '@ant-design/compatible'
import { Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function GenerateServiceOrderModalForm({ form }) {
  const { getFieldDecorator } = form

  return (
    <Form layout="vertical">
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Ofício">
            {getFieldDecorator('craft', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Defeito reclamado">
            {getFieldDecorator('defectClaimed', {
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
              <Select>
                <Option value={1}>Opção 1</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Observação da reclamação">
        {getFieldDecorator('observation', {
          initialValue: '',
        })(<Input />)}
      </Form.Item>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Serviço">
            {getFieldDecorator('service', {
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
              <Select
                suffixIcon={<i className="fa fa-search fa-lg" />}
                showSearch
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value={1}>Opção 1</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Canal de atendimento">
            {getFieldDecorator('attendanceChannel', {
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
              <Select>
                <Option value={1}>Opção 1</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Classificação">
            {getFieldDecorator('classification', {
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
              <Select>
                <Option value={1}>Opção 1</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Prioridade">
            {getFieldDecorator('priority', {
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
              <Select>
                <Option value={1}>Opção 1</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

GenerateServiceOrderModalForm.propTypes = {
  form: PropTypes.any,
}
