import React from 'react'
import NewSimpleSearch from '@components/NewSimpleSearch'
import PropTypes from 'prop-types'

function NewPermissionGroupHeader({
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
    </div>
  )
}
NewPermissionGroupHeader.propTypes = {
  searchOptions: PropTypes.any,
  setTags: PropTypes.any,
  tags: PropTypes.any,
  startSearch: PropTypes.any,
}
export default NewPermissionGroupHeader
