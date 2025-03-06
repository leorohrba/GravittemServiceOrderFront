import { Form } from '@ant-design/compatible'
import { fieldsValidationToast } from '@utils/index'
import { message } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import NewPermissionGroupFormBody from './NewPermissionGroupFormBody'
import NewPermissionGroupFormFooter from './NewPermissionGroupFormFooter'
import NewPermissionGroupFormHeader from './NewPermissionGroupFormHeader'

function NewPermissionGroupForm({
  data,
  setData,
  permissions,
  form,
  editData,
  users,
  activedKeys,
  setActivedKeys,
  checkedValues,
  setCheckedValues,
}) {
  const maxIndex = data.map(n => n.id)
  const [nameModalVisible, setNameModalVisible] = useState()

  function checkPermissions() {
    const checkedLength = permissions
      .map(p =>
        p.conteudo.reduce(
          (accumulator, { children }) => accumulator + children.length,
          0,
        ),
      )
      .reduce((accumulator, value) => accumulator + value, 0)
    const checked = []
    for (let n = 1; n <= checkedLength; n++) {
      checkedValues.find(c => c === n) &&
        checked.push(checkedValues.find(c => c === n))
    }

    const permissionsCheckedLength = permissions.reduce(
      (accumulator, { conteudo }) => accumulator + conteudo.length,
      0,
    )
    const permissionsChecked = []
    for (let n = 1; n <= permissionsCheckedLength; n++) {
      activedKeys.find(a => a === n) &&
        permissionsChecked.push(activedKeys.find(a => a === n))
    }

    return {
      permissoesGerais: permissionsChecked,
      permissoes: checked,
    }
  }

  function checkUsers() {
    const checkedUsers = []
    users.map(u =>
      checkedUsers.push(form.getFieldValue(`${u.username}`) || false),
    )
    return checkedUsers
  }

  function savePermissionGroup() {
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
            grupoPermissao: values.permissionsGroupAs
              ? values.permissionsGroupAs
              : values.permissionsGroup,
            status: values.status,
            usuarios: checkUsers(),
            permissoes: checkPermissions(),
          }
          setData([...data, { ...newGroup }])
        } else {
          setData(
            update(data, {
              [editIndex]: {
                grupoPermissao: {
                  $set: values.permissionsGroupAs
                    ? values.permissionsGroupAs
                    : values.permissionsGroup,
                },
                grupo: { $set: values.group },
                status: {
                  $set: values.status,
                },
                permissoes: {
                  $set: checkPermissions(),
                },
                usuarios: {
                  $set: checkUsers(),
                },
              },
            }),
          )
        }
        form.resetFields()
        message.success('Dados salvos com sucesso.')
        setNameModalVisible(false)
      }
    })
  }
  return (
    <div>
      <Form>
        <NewPermissionGroupFormHeader
          {...{ form, editData, nameModalVisible }}
        />
        <NewPermissionGroupFormBody
          {...{
            form,
            permissions,
            users,
            activedKeys,
            setActivedKeys,
            checkedValues,
            setCheckedValues,
            editData,
          }}
        />
        <NewPermissionGroupFormFooter
          {...{
            form,
            savePermissionGroup,
            editData,
            nameModalVisible,
            setNameModalVisible,
          }}
        />
      </Form>
    </div>
  )
}
NewPermissionGroupForm.propTypes = {
  form: PropTypes.any,
  users: PropTypes.any,
  editData: PropTypes.any,
  data: PropTypes.any,
  setData: PropTypes.any,
  activedKeys: PropTypes.any,
  setActivedKeys: PropTypes.any,
  checkedValues: PropTypes.any,
  setCheckedValues: PropTypes.any,
  permissions: PropTypes.any,
}
export default NewPermissionGroupForm
