import { Form } from '@ant-design/compatible'
import { Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

function NewCompaniesGroupForm({ form, editData, companies, supports }) {
  const { getFieldDecorator } = form
  const supportsOptions = supports.map(c => (
    <Option value={c.id}>{c.nome}</Option>
  ))
  const companiesOptions = companies.map(c => (
    <Option value={c.id}>{c.nome}</Option>
  ))

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
            <Form.Item label="Suporte">
              {getFieldDecorator('support', {
                initialValue: editData && editData.suportes,
              })(<Select mode="multiple">{supportsOptions}</Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Empresas">
          {getFieldDecorator('companies', {
            initialValue: editData && editData.empresas,
            rules: [
              {
                required: true,
                message: 'Campo Obrigatório.',
              },
            ],
          })(<Select mode="multiple">{companiesOptions}</Select>)}
        </Form.Item>
      </Form>
    </div>
  )
}
NewCompaniesGroupForm.propTypes = {
  form: PropTypes.any,
  editData: PropTypes.any,
  companies: PropTypes.any,
  supports: PropTypes.any,
}
export default NewCompaniesGroupForm
