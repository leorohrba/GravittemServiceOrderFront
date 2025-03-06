import { Form } from '@ant-design/compatible'
import { Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

function NewSupportGroupForm({ form, editData, users }) {
  const usersOptions = users.map(u => <Option value={u.id}>{u.nome}</Option>)

  const { getFieldDecorator } = form
  return (
    <div>
      <Form>
        <Form.Item>
          {getFieldDecorator('id', {
            initialValue: editData && editData.id,
          })}
        </Form.Item>
        <Form.Item label="Grupo">
          {getFieldDecorator('group', {
            initialValue: editData && editData.grupo,
            rules: [
              {
                required: true,
                message: 'Campo Obrigatório.',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Row type="flex" gutter="16">
          <Col span={12}>
            <Form.Item label="Status">
              {getFieldDecorator('status', {
                initialValue: editData && editData.status,
                rules: [
                  {
                    required: true,
                    message: 'Campo Obrigatório.',
                  },
                ],
              })(
                <Select>
                  <Option value="Ativo">Ativo</Option>
                  <Option value="Inativo">Inativo</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Grupo de empresa">
              {getFieldDecorator('companiesGroup', {
                initialValue: editData && editData.grupoEmpresas,
              })(
                <Select showSearch showArrow={false}>
                  <Option value="EPP">EPP</Option>
                  <Option value="Corp">Corp</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Usuarios">
          {getFieldDecorator('users', {
            initialValue: editData && editData.usuarios,
            rules: [
              {
                required: true,
                message: 'Campo Obrigatório.',
              },
            ],
          })(<Select mode="multiple">{usersOptions}</Select>)}
        </Form.Item>
      </Form>
    </div>
  )
}
NewSupportGroupForm.propTypes = {
  form: PropTypes.any,
  users: PropTypes.any,
  editData: PropTypes.any,
}
export default NewSupportGroupForm
