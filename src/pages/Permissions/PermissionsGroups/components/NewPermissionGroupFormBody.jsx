import React, { useEffect } from 'react'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import UsersList from './UsersList'
import PermissionsList from './PermissionsList'

function NewPermissionGroupFormBody({
  form,
  users,
  activedKeys,
  setActivedKeys,
  checkedValues,
  setCheckedValues,
  editData,
  permissions,
}) {
  useEffect(() => {
    if (editData) {
      setActivedKeys(editData.permissoes.permissoesGerais)
      setCheckedValues(editData.permissoes.permissoes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])
  const { TabPane } = Tabs

  const content = []
  users.map(c =>
    content.push({
      field: c.username,
      text: c.nome,
    }),
  )
  return (
    <div>
      <Tabs>
        <TabPane tab="Usuários" key="1">
          <UsersList {...{ form, content, editData }} />
        </TabPane>
        <TabPane tab="Permissões" key="2">
          <PermissionsList
            {...{
              form,
              permissions,
              activedKeys,
              setActivedKeys,
              checkedValues,
              editData,
              setCheckedValues,
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}
NewPermissionGroupFormBody.propTypes = {
  form: PropTypes.any,
  users: PropTypes.any,
  activedKeys: PropTypes.any,
  setActivedKeys: PropTypes.any,
  checkedValues: PropTypes.any,
  setCheckedValues: PropTypes.any,
  editData: PropTypes.any,
  permissions: PropTypes.any,
}
export default NewPermissionGroupFormBody
