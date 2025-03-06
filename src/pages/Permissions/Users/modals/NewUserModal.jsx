import { Form } from '@ant-design/compatible'
import { fieldsValidationToast } from '@utils/index'
import { Button, message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React from 'react'
import NewUserModalForm from './NewUserModalForm'

function NewUserModal({
  setData,
  data,
  editData,
  setEditData,
  newUserModalVisible,
  form,
  setNewUserModalVisible,
}) {
  function handleCancel() {
    setNewUserModalVisible(false)
    setEditData()
  }
  function saveUser() {
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        const maxIndex = data.map(n => n.id)
        const editIndex = data.findIndex(n => n.id === values.id)
        if (editIndex === -1) {
          const newUser = {
            id:
              Object.keys(maxIndex).length === 0
                ? 0
                : Math.max(...maxIndex) + 1,
            email: values.email,
            status: values.status,
            grupoPermissao: values.permissionGroup,
          }
          setData([...data, { ...newUser }])
        } else {
          setData(
            update(data, {
              [editIndex]: {
                id: { $set: values.id },
                email: { $set: values.email },
                status: {
                  $set: values.status,
                },
                grupoPermissao: {
                  $set: values.permissionGroup,
                },
              },
            }),
          )
        }
        form.resetFields()
        message.success('Dados salvos com sucesso.')
        setNewUserModalVisible(false)
      }
    })
  }
  return (
    <div>
      <Modal
        title="Novo usuário"
        visible={newUserModalVisible}
        onCancel={handleCancel}
        footer={
          <Row type="flex">
            <Button
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              onClick={saveUser}
            >
              Salvar
            </Button>
            <Button onClick={handleCancel}>Cancelar</Button>
          </Row>
        }
      >
        <NewUserModalForm {...{ form, setNewUserModalVisible, editData }} />
      </Modal>
    </div>
  )
}
NewUserModal.propTypes = {
  newUserModalVisible: PropTypes.bool,
  setNewUserModalVisible: PropTypes.func,
  form: PropTypes.any,
  data: PropTypes.array,
  setData: PropTypes.func,
  editData: PropTypes.array,
  setEditData: PropTypes.func,
}
const WrappedNewUserModal = Form.create()(NewUserModal)
export default WrappedNewUserModal
