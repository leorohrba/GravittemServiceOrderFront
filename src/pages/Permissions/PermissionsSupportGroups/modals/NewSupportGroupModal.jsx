import { Form } from '@ant-design/compatible'
import { fieldsValidationToast } from '@utils/index'
import { Button, message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React from 'react'
import NewSupportGroupForm from './NewSupportGroupForm'

function NewSupportGroupModal({
  newSupportGroupModalVisible,
  setNewSupportGroupModalVisible,
  form,
  data,
  setData,
  editData,
  setEditData,
  users,
}) {
  const maxIndex = data.map(n => n.id)
  function saveGroup() {
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        const editIndex = data.findIndex(n => n.id === values.id)
        if (editIndex === -1) {
          const newGroup = {
            id:
              Object.keys(maxIndex).length === 0
                ? 0
                : Math.max(...maxIndex) + 1,
            grupo: values.group,
            status: values.status,
            grupoEmpresas: values.companiesGroup,
            usuarios: values.users,
          }
          setData([...data, { ...newGroup }])
        } else {
          setData(
            update(data, {
              [editIndex]: {
                id: { $set: values.id },
                grupo: { $set: values.group },
                status: {
                  $set: values.status,
                },
                grupoEmpresas: {
                  $set: values.companiesGroup,
                },
                usuarios: {
                  $set: values.users,
                },
              },
            }),
          )
        }
        form.resetFields()
        message.success('Dados salvos com sucesso.')
        setNewSupportGroupModalVisible(false)
      }
    })
  }
  function handleCancel() {
    setNewSupportGroupModalVisible(false)
    setEditData()
  }
  return (
    <div>
      <Modal
        title="Novo grupo"
        visible={newSupportGroupModalVisible}
        onCancel={handleCancel}
        destroyOnClose
        footer={
          <Row type="flex">
            <Button
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              onClick={saveGroup}
            >
              Salvar
            </Button>
            <Button onClick={handleCancel}>Cancelar</Button>
          </Row>
        }
      >
        <NewSupportGroupForm {...{ form, editData, users }} />
      </Modal>
    </div>
  )
}
NewSupportGroupModal.propTypes = {
  newSupportGroupModalVisible: PropTypes.bool,
  setNewSupportGroupModalVisible: PropTypes.func,
  form: PropTypes.any,
  data: PropTypes.any,
  setData: PropTypes.any,
  editData: PropTypes.array,
  setEditData: PropTypes.func,
  users: PropTypes.any,
}
const WrappedNewSupportGroupModal = Form.create()(NewSupportGroupModal)

export default WrappedNewSupportGroupModal
