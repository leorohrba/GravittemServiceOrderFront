import React from 'react'
import { Button } from 'antd'
import NewSimpleSearch from '@components/NewSimpleSearch'
import PropTypes from 'prop-types'
import NewCompaniesGroupModal from '../modals/NewCompaniesGroupModal'

function PermissionsCompaniesGroupsHeader({
  searchOptions,
  setTags,
  tags,
  editData,
  setEditData,
  startSearch,
  newCompaniesGroupModalVisible,
  setNewCompaniesGroupModalVisible,
  companies,
  supports,
  data,
}) {
  return (
    <div>
      <NewCompaniesGroupModal
        {...{
          newCompaniesGroupModalVisible,
          setNewCompaniesGroupModalVisible,
          companies,
          editData,
          supports,
          setEditData,
          data,
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
        onClick={() => setNewCompaniesGroupModalVisible(true)}
        type="primary"
      >
        <i className="fa fa-plus fa-lg mr-3" />
        Novo Grupo
      </Button>
    </div>
  )
}
PermissionsCompaniesGroupsHeader.propTypes = {
  searchOptions: PropTypes.any,
  setTags: PropTypes.any,
  tags: PropTypes.any,
  companies: PropTypes.any,
  startSearch: PropTypes.any,
  newCompaniesGroupModalVisible: PropTypes.bool,
  setNewCompaniesGroupModalVisible: PropTypes.func,
  editData: PropTypes.any,
  data: PropTypes.any,
  supports: PropTypes.any,
  setEditData: PropTypes.func,
}
export default PermissionsCompaniesGroupsHeader
