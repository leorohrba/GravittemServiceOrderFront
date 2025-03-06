import React from 'react'
import { Button } from 'antd'
import NewSimpleSearch from '@components/NewSimpleSearch'
import PropTypes from 'prop-types'
import NewUserModal from '../modals/NewUserModal'

function UsersListHeader({
  searchOptions,
  setTags,
  tags,
  startSearch,
  newUserModalVisible,
  setNewUserModalVisible,
  editData,
  setEditData,
  data,
  setData,
}) {
  return (
    <div>
      <NewUserModal
        {...{
          newUserModalVisible,
          setNewUserModalVisible,
          data,
          setData,
          editData,
          setEditData,
        }}
      />
      <div className="ml-auto" style={{ width: '44%' }}>
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          startSearch={startSearch}
        />
      </div>
      <Button
        onClick={() => setNewUserModalVisible(true)}
        className="mb-3"
        type="primary"
      >
        <i className="fa fa-plus fa-lg mr-3" />
        Novo usuário
      </Button>
    </div>
  )
}
UsersListHeader.propTypes = {
  searchOptions: PropTypes.any,
  setTags: PropTypes.func,
  tags: PropTypes.any,
  data: PropTypes.any,
  setData: PropTypes.any,
  editData: PropTypes.any,
  setEditData: PropTypes.any,
  startSearch: PropTypes.any,
  newUserModalVisible: PropTypes.bool,
  setNewUserModalVisible: PropTypes.func,
}
export default UsersListHeader
