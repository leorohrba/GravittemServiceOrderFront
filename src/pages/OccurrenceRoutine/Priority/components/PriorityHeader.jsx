import SimpleSearch from '@components/SimpleSearch'
import { Button, Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'

export default function PriorityHeader({
  selectedRows,
  userPermissions,
  editPriority,
  confirmDeletePriority,
  startSearch,
  setSearchValues,
}) {
  const searchOptions = [
    {
      value: 'description',
      label: 'Descrição',
      type: 'search',
    },
    {
      value: 'status',
      label: 'Status',
      placeholder: 'Selecione o status',
      type: 'select',
      options: [
        { label: 'Ativo', value: true },
        { label: 'Inativo', value: false },
        { label: 'Todos', value: null },
      ],
    },
  ]

  return (
    <div>
      <Row>
        <Col
          style={{
            width: '480px',
            marginLeft: 'auto',
          }}
        >
          <SimpleSearch 
            searchOptions={searchOptions} 
            startSearch={startSearch}
            setSearchValues={setSearchValues}
            fixedTypeWidth={150} 
          />
        </Col>
      </Row>
      <Row type="flex" className="mb-5">
        {selectedRows.length === 0 ? (
          <React.Fragment>
            {hasPermission(userPermissions, 'Include') && (
            <Button
              type="primary"
              onClick={() => editPriority(0)}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              {formatMessage({
                id:
                  'occurrenceRoutine.priority.newPriority',
              })}
            </Button>
            )}
          </React.Fragment>  
        ) : (
          <React.Fragment>
            {hasPermission(userPermissions,'Exclude') && (
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
              }}
              onClick={confirmDeletePriority}
            >
              <i className="fa fa-trash fa-lg mr-3" />
              {formatMessage({
                id: 'delete',
              })}{' '}
              ({selectedRows.length})
            </Button>
            )}
          </React.Fragment>  
        )}
      </Row>
    </div>
  )
}

PriorityHeader.propTypes = {
  confirmDeletePriority: PropTypes.any,
  selectedRows: PropTypes.any,
  editPriority: PropTypes.func,
  startSearch: PropTypes.func,
  setSearchValues: PropTypes.func,
  userPermissions: PropTypes.array,
}
