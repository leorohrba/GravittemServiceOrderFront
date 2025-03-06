import { hasPermission } from '@utils'
import { Alert, Button, Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { ButtonAction } from '../utils'

export default function ServiceOrderPartsHeader({
  selectedRows,
  newItem,
  serviceOrder,
  userPermissions,
  statusSource,
  confirmAction,
  refreshGrid,
  data,
  software,
  handleDevolution,
  isNegativeStock,
}) {
  const editionValidator =
    serviceOrder?.inProgress || serviceOrder?.actStatusCode === 'AGLQ'

  return (
    <div className="sticky-header pb-2">
      {serviceOrder && !editionValidator && (
        <Alert
          className="mb-2"
          message={formatMessage({
            id: 'serviceOrder.serviceOrderParts.orderServiceNotInProgress',
          })}
          type="warning"
        />
      )}
      {statusSource.length > 0 && serviceOrder && serviceOrder.inProgress && (
        <Row type="flex" className="pt-2 pb-2">
          {selectedRows.length === 0 && (
            <Col>
              {hasPermission(userPermissions, 'Include') && (
                <Button type="primary" onClick={() => newItem(0)}>
                  <i className="fa fa-plus mr-2" aria-hidden="true" />
                  {formatMessage({
                    id: 'serviceOrder.serviceOrderParts.newItem',
                  })}
                </Button>
              )}
            </Col>
          )}
          {selectedRows.length > 0 && (
            <React.Fragment>
              {selectedRows.every(
                x => x.actStatusCode === 'SUGE' && x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Alter') && (
                  <React.Fragment>
                    {software?.sigla !== 'ESSF' && (
                      <ButtonAction
                        action="accept"
                        code="PDIA"
                        selectedRows={selectedRows}
                        confirmAction={confirmAction}
                      />
                    )}
                  </React.Fragment>
                )}
              {selectedRows.every(
                x => x.actStatusCode === 'RESE' && x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Alter') && (
                  <ButtonAction
                    action="cancelReserve"
                    code="CANCR"
                    selectedRows={selectedRows}
                    confirmAction={confirmAction}
                  />
                )}
              {selectedRows.every(
                x =>
                  (x.actStatusCode === 'FALT' ||
                    x.actStatusCode === 'AGUA' ||
                    x.actStatusCode === 'RESE' ||
                    x.actStatusCode === 'PDIA' ||
                    x.actStatusCode === 'REQU') &&
                  x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Alter') && (
                  <ButtonAction
                    action={
                      selectedRows.every(x => x.aactStatusCode === 'SUGE')
                        ? 'reject'
                        : 'cancel'
                    }
                    code="CANC"
                    selectedRows={selectedRows}
                    confirmAction={confirmAction}
                  />
                )}
              {selectedRows.every(
                x =>
                  (x.actStatusCode === 'PDIA' ||
                    x.actStatusCode === 'FALT' ||
                    x.actStatusCode === 'AGUA') &&
                  x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Alter') &&
                !isNegativeStock && (
                  <ButtonAction
                    action="reserve"
                    code="RESE"
                    selectedRows={selectedRows}
                    confirmAction={confirmAction}
                  />
                )}
              {selectedRows.every(
                x => x.actStatusCode === 'RESE' && x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Alter') &&
                !isNegativeStock && (
                  <ButtonAction
                    action="request"
                    code="REQU"
                    selectedRows={selectedRows}
                    confirmAction={confirmAction}
                  />
                )}
              {selectedRows.every(
                x =>
                  x.actStatusCode !== 'CANC' &&
                  !x.purchaseOrderItemId &&
                  x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Alter') && (
                  <ButtonAction
                    action="purchase"
                    code="PED"
                    selectedRows={selectedRows}
                    confirmAction={confirmAction}
                  />
                )}
              {selectedRows.every(
                x =>
                  (x.actStatusCode === 'SUGE' ||
                    x.actStatusCode === 'PDIA' ||
                    x.actStatusCode === 'RESE' ||
                    x.actStatusCode === 'REQU') &&
                  x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Alter') && (

                  <ButtonAction
                    action="use"
                    code="UTLZ"
                    selectedRows={selectedRows}
                    confirmAction={confirmAction}
                  />
                )}
              {selectedRows.every(
                x => x.actStatusCode === 'UTLZ' && x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Alter') && (
                  <ButtonAction
                    action="reverse"
                    code="EST"
                    selectedRows={selectedRows}
                    confirmAction={confirmAction}
                  />
                )}
              {selectedRows.every(
                x =>
                  (x.actStatusCode === 'PDIA' || x.actStatusCode === 'SUGE') &&
                  x.partId > 0,
              ) &&
                hasPermission(userPermissions, 'Exclude') && (
                  <ButtonAction
                    action="delete"
                    code="DEL"
                    selectedRows={selectedRows}
                    confirmAction={confirmAction}
                  />
                )}
            </React.Fragment>
          )}
          <Col style={{ marginLeft: 'auto' }}>
            <Button onClick={() => refreshGrid()} className="mr-2">
              <i className="fa fa-repeat mr-2" style={{ color: 'gray' }} />
              {formatMessage({
                id: 'serviceOrder.serviceOrderParts.refresh',
              })}
            </Button>
          </Col>
          {data.find(x => x.actStatusCode === 'UTLZ' && x.returnRequired) &&
            hasPermission(userPermissions, 'Alter') && (
              <Col>
                <Button onClick={() => handleDevolution(true)} className="mr-2">
                  <i className="fa fa-wrench mr-2" style={{ color: 'gray' }} />
                  Devolução
                </Button>
              </Col>
            )}
        </Row>
      )}
    </div>
  )
}

ServiceOrderPartsHeader.propTypes = {
  selectedRows: PropTypes.array,
  newItem: PropTypes.func,
  serviceOrder: PropTypes.any,
  userPermissions: PropTypes.array,
  statusSource: PropTypes.array,
  confirmAction: PropTypes.array,
  refreshGrid: PropTypes.func,
  data: PropTypes.array,
  software: PropTypes.string,
  handleDevolution: PropTypes.func,
}
