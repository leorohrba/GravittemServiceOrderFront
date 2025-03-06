import { Form } from '@ant-design/compatible'
import { fieldsValidationToast } from '@utils/index'
import { Button, message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React from 'react'
import NewCompaniesGroupForm from './NewCompaniesGroupForm'

function NewCompaniesGroupModal({
  newCompaniesGroupModalVisible,
  setNewCompaniesGroupModalVisible,
  data,
  setData,
  form,
  companies,
  editData,
  setEditData,
  supports,
}) {
  function handleCancel() {
    setNewCompaniesGroupModalVisible(false)
    setEditData()
  }

  function saveGroup() {
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        const maxIndex = data.map(n => n.id)
        const editIndex = data.findIndex(n => n.id === values.id)
        if (editIndex === -1) {
          const newGroup = {
            id:
              Object.keys(maxIndex).length === 0
                ? 0
                : Math.max(...maxIndex) + 1,
            grupo: values.group,
            status: values.status,
            suportes: values.support,
            empresas: values.companies,
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
                suportes: {
                  $set: values.support,
                },
                empresas: {
                  $set: values.companies,
                },
              },
            }),
          )
        }
        form.resetFields()
        message.success('Dados salvos com sucesso.')
        setNewCompaniesGroupModalVisible(false)
      }
    })
  }

  return (
    <div>
      <Modal
        visible={newCompaniesGroupModalVisible}
        onCancel={handleCancel}
        title="Novo grupo"
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
        <NewCompaniesGroupForm {...{ form, companies, editData, supports }} />
      </Modal>
    </div>
  )
}
NewCompaniesGroupModal.propTypes = {
  newCompaniesGroupModalVisible: PropTypes.bool,
  setNewCompaniesGroupModalVisible: PropTypes.func,
  form: PropTypes.any,
  companies: PropTypes.any,
  editData: PropTypes.any,
  setEditData: PropTypes.func,
  supports: PropTypes.any,
  data: PropTypes.array,
  setData: PropTypes.func,
}

const WrappedNewCompaniesGroupModal = Form.create()(NewCompaniesGroupModal)
export default WrappedNewCompaniesGroupModal
