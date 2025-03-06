import { Form } from '@ant-design/compatible'
import { Button, Dropdown, Input, Menu, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

function NewPermissionGroupFormFooter({
  form,
  savePermissionGroup,
  editData,
  nameModalVisible,
  setNameModalVisible,
}) {
  const { getFieldDecorator } = form
  const [dropdownVisible, setDropdownVisible] = useState()

  return (
    <div className="flex mt-8">
      <Modal
        title="Salvar como"
        visible={nameModalVisible}
        onCancel={() => setNameModalVisible(false)}
        footer={
          <Row type="flex">
            <Button
              onClick={savePermissionGroup}
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
            >
              Salvar
            </Button>
            <Button onClick={() => setNameModalVisible(false)} className="ml-4">
              Cancelar
            </Button>
          </Row>
        }
      >
        <Form.Item label="Grupo de permissões">
          {getFieldDecorator('permissionsGroupAs', {
            initialValue: editData && editData.grupoPermissao,
            rules: [
              { required: nameModalVisible, message: 'Campo Obrigatório.' },
            ],
          })(<Input />)}
        </Form.Item>
      </Modal>
      <Input.Group>
        <Button
          onClick={savePermissionGroup}
          style={{ backgroundColor: '#4CAF50', color: 'white' }}
        >
          Salvar
        </Button>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => setNameModalVisible(true)} key="1">
                Salvar como
              </Menu.Item>
            </Menu>
          }
          visible={dropdownVisible}
          trigger={['click']}
          onVisibleChange={visible => setDropdownVisible(visible)}
          className="ml-1"
        >
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <i className="fa fa-angle-down fa-lg" aria-hidden="true" />
          </Button>
        </Dropdown>
        <Button className="ml-4">Cancelar</Button>
      </Input.Group>
    </div>
  )
}
NewPermissionGroupFormFooter.propTypes = {
  form: PropTypes.any,
  editData: PropTypes.any,
  nameModalVisible: PropTypes.any,
  setNameModalVisible: PropTypes.any,
  savePermissionGroup: PropTypes.any,
}
export default NewPermissionGroupFormFooter
