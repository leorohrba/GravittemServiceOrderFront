import React from 'react'
import { Button } from 'antd'
import NewSimpleSearch from '@components/NewSimpleSearch'
import PropTypes from 'prop-types'
import Link from 'umi/link'

function PermissionsGroupsHeader({
  searchOptions,
  setTags,
  tags,
  startSearch,
}) {
  return (
    <div>
      <div className="ml-auto" style={{ width: '44%' }}>
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          startSearch={startSearch}
        />
      </div>
      <div className="flex justify-between mt-5">
        <Link to="PermissionsGroups/NewPermissionGroup">
          <Button type="primary" className="mb-3">
            <i className="fa fa-plus fa lg mr-2" />
            Novo grupo
          </Button>
        </Link>
        <div className="mb-3" style={{ width: '16%' }}>
          <Button>
            <i className="fa fa-download fa-lg mr-3" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  )
}
PermissionsGroupsHeader.propTypes = {
  searchOptions: PropTypes.any,
  setTags: PropTypes.any,
  tags: PropTypes.any,
  startSearch: PropTypes.any,
}
export default PermissionsGroupsHeader
