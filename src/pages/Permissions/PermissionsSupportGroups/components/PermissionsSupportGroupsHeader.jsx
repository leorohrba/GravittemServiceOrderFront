import React from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import NewSimpleSearch from '@components/NewSimpleSearch'
import NewSupportGroupModal from '../modals/NewSupportGroupModal'

function PermissionsSupportGroupsHeader({
  editData,
  setEditData,
  data,
  setData,
  newSupportGroupModalVisible,
  setNewSupportGroupModalVisible,
  searchOptions,
  setTags,
  tags,
  startSearch,
  users,
}) {
  return (
    <div>
      <NewSupportGroupModal
        {...{
          newSupportGroupModalVisible,
          setNewSupportGroupModalVisible,
          data,
          setData,
          editData,
          setEditData,
          users,
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
        style={{ marginBottom: 30 }}
        onClick={() => setNewSupportGroupModalVisible(true)}
        size="default"
        type="primary"
      >
        <i className="fa fa-plus fa-lg mr-3" />
        Novo Preço
      </Button>
    </div>
  )
}
PermissionsSupportGroupsHeader.propTypes = {
  editData: PropTypes.any,
  setEditData: PropTypes.func,
  data: PropTypes.array,
  setData: PropTypes.func,
  searchOptions: PropTypes.any,
  setTags: PropTypes.any,
  tags: PropTypes.any,
  startSearch: PropTypes.any,
  setNewSupportGroupModalVisible: PropTypes.func,
  newSupportGroupModalVisible: PropTypes.bool,
  users: PropTypes.any,
}
export default PermissionsSupportGroupsHeader
