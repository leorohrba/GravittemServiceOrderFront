import SimpleSearch from '@components/SimpleSearch'
import { Button, Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'

export default function AttendanceClassificationHeader({
  selectedRows,
  userPermissions,
  editAttendanceClassification,
  confirmDeleteAttendanceClassification,
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
        { label: 'Ativo', value: 1 },
        { label: 'Inativo', value: 2 },
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
              onClick={() => editAttendanceClassification(null)}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              {formatMessage({
                id:
                  'occurrenceRoutine.attendanceClassification.newAttendanceClassification',
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
              onClick={confirmDeleteAttendanceClassification}
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

AttendanceClassificationHeader.propTypes = {
  confirmDeleteAttendanceClassification: PropTypes.any,
  selectedRows: PropTypes.any,
  editAttendanceClassification: PropTypes.func,
  startSearch: PropTypes.func,
  setSearchValues: PropTypes.func,
  userPermissions: PropTypes.array,
}
