import { Form } from '@ant-design/compatible'
import { Button, Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

function NewPermissionGroupFormHeader({ form, editData, nameModalVisible }) {
  const { getFieldDecorator } = form
  const { Option } = Select
  return (
    <div>
      <Row type="flex">
        <Col span="6">
          <Form.Item className="mr-4" label="Grupo de permissões">
            {getFieldDecorator('permissionsGroup', {
              initialValue: editData && editData.grupoPermissao,
              rules: [
                { required: !nameModalVisible, message: 'Campo Obrigatório' },
              ],
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span="5">
          <Form.Item label="Status">
            {getFieldDecorator('status', {
              initialValue: editData && editData.status,
              rules: [{ required: true, message: 'Campo Obrigatório' }],
            })(
              <Select>
                <Option value="Ativo">Ativo</Option>
                <Option value="Inativo">Inativo</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            {getFieldDecorator('id', {
              initialValue: editData && editData.id,
            })}
          </Form.Item>
        </Col>
        <div className="ml-auto" style={{ marginTop: 70, width: '16%' }}>
          <Button>
            <i className="fa fa-download fa-lg mr-3" />
            Exportar
          </Button>
        </div>
      </Row>
    </div>
  )
}
NewPermissionGroupFormHeader.propTypes = {
  form: PropTypes.any,
  editData: PropTypes.any,
  nameModalVisible: PropTypes.any,
}
export default NewPermissionGroupFormHeader
