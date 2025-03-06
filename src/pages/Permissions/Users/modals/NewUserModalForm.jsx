import { Form } from '@ant-design/compatible'
import { Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

function NewUserModalForm({ form, editData }) {
  const { Option } = Select

  const { getFieldDecorator } = form
  return (
    <div>
      <Form>
        <Form.Item>
          {getFieldDecorator('id', {
            initialValue: editData && editData.id,
          })}
        </Form.Item>
        <Form.Item label="Usuário (e-mail)">
          {getFieldDecorator('email', {
            initialValue: editData && editData.email,
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
                  <Option value="Bloqueado">Bloqueado</Option>
                  <Option value="Inativo">Inativo</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Grupo de permissão">
              {getFieldDecorator('permissionGroup', {
                initialValue: editData && editData.grupoPermissao,
              })(
                <Select>
                  <Option value="Ativo">Gerente</Option>
                  <Option value="Vendedor">Vendedor</Option>
                  <Option value="Estoquista">Estoquista</Option>
                  <Option value="Técnico">Técnico</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
NewUserModalForm.propTypes = { form: PropTypes.any, editData: PropTypes.any }
export default NewUserModalForm
