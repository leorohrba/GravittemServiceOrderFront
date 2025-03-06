import SimpleSearch from '@components/SimpleSearch'
import { Button, Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'

export default function StatusAndReasonHeader({
  selectedRows,
  userPermissions,
  editStatus,
  confirmDeleteStatus,
  startSearch,
  setSearchValues,
}) {
  const searchOptions = [
    {
      value: 'description',
      label: 'Descrição',
      placeholder: 'Informe a descrição do status',
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
    {
      value: 'reasonDescription',
      label: 'Motivo',
      placeholder: 'Informe a descrição do motivo',
      type: 'search',
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
              onClick={() => editStatus(null)}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              {formatMessage({
                id:
                  'occurrenceRoutine.statusAndReason.newStatus',
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
              onClick={confirmDeleteStatus}
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

StatusAndReasonHeader.propTypes = {
  confirmDeleteStatus: PropTypes.any,
  selectedRows: PropTypes.any,
  editStatus: PropTypes.func,
  startSearch: PropTypes.func,
  setSearchValues: PropTypes.func,
  userPermissions: PropTypes.array,
}

