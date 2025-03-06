import NewSimpleSearch from '@components/NewSimpleSearch'
import { hasPermission } from '@utils'
import { Button, Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function PersonGroupHeader({
  selectedRows,
  confirmDeletePersonGroup,
  editPersonGroup,
  userPermissions,
  startSearch,
  tags,
  setTags,
  searchOptions,
}) {
  return (
    <div>
      <Row type="flex" justify="end">
        <Col>
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            screenName="grupo_pessoas"
          />
        </Col>
      </Row>
      <Row type="flex">
        {selectedRows.length === 0 ? (
          <div>
            {hasPermission(userPermissions, 'Include') && (
              <Button type="primary" onClick={() => editPersonGroup(0)}>
                <i className="fa fa-plus fa-lg mr-3" />
                Novo grupo
              </Button>
            )}
          </div>
        ) : (
          <div>
            {hasPermission(userPermissions, 'Exclude') && (
              <Button
                style={{
                  color: 'red',
                  borderColor: 'red',
                }}
                onClick={confirmDeletePersonGroup}
              >
                <i className="fa fa-trash fa-lg mr-3" />
                {formatMessage({
                  id: 'delete',
                })}{' '}
                ({selectedRows.length})
              </Button>
            )}
          </div>
        )}
      </Row>
    </div>
  )
}
PersonGroupHeader.propTypes = {
  confirmDeletePersonGroup: PropTypes.func,
  selectedRows: PropTypes.any,
  editPersonGroup: PropTypes.func,
  startSearch: PropTypes.func,
  userPermissions: PropTypes.array,
  setTags: PropTypes.func,
  tags: PropTypes.array,
  searchOptions: PropTypes.array,
}
