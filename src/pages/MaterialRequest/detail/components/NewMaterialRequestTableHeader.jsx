import Button from '@components/Button'
import { hasPermission } from '@utils'
import { PropTypes } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function NewMaterialRequestTableHeader({
  selectedRows,
  addRequisitionItem,
  userPermissions,
  applyItems,
  separateItems,
  confirmDeleteItems,
  canChangeItemStatus,
  canBeUpdated,
  period,
}) {
  const [enableSeparate, setEnableSeparate] = useState(false)
  const [enableApply, setEnableApply] = useState(false)
  const [enableDelete, setEnableDelete] = useState(false)

  useEffect(() => {
    const applyRows = selectedRows.every(
      x =>
        (x.actStatusCode === 'SEPA' || x.actStatusCode === 'PEND') &&
        x.actReasonCode !== 'ITES' &&
        x.documentInProgress &&
        x.documentOriginId,
    )
    setEnableApply(applyRows)

    const separateRows = selectedRows.every(
      x =>
        x.actStatusCode === 'PEND' &&
        (x.documentInProgress || !x.documentOriginId),
    )
    setEnableSeparate(separateRows)

    const deleteRows = selectedRows.every(
      x => x.actStatusCode === 'PEND' || x.actStatusCode === 'CANC',
    )
    setEnableDelete(deleteRows)

    /*
    setEnableSeparate(selectedRows.filter(x => x.actStatusCode !== 'SEPA' && (x.documentInProgress || !x.documentOriginId) ))
    setEnableApply(selectedRows.filter(x => x.serviceOrderPartActStatusCode !== 'APLI' && x.documentInProgress && x.documentOriginId))
    setEnableDelete(selectedRows.filter(x => !(x.actStatusCode === 'CONC' || x.actStatusCode === 'APLI' || x.actStatusCode === 'SEPA') && (x.documentInProgress || !x.documentOriginId)))
  */
  }, [selectedRows])

  return (
    <div>
      {selectedRows.length === 0 ? (
        <React.Fragment>
          {hasPermission(userPermissions, 'Include') && canBeUpdated && (
            <Button
              size="default"
              type="primary"
              disabled={!period}
              onClick={() => addRequisitionItem()}
              id="button-add-item-modal"
            >
              <i className="fa fa-plus fa-lg mr-3" />
              {formatMessage({
                id: 'materialRequest.NewMaterialRequisition.addItem',
              })}
            </Button>
          )}
        </React.Fragment>
      ) : (
        <div>
          {hasPermission(userPermissions, 'SepararItem') &&
            enableSeparate &&
            canBeUpdated && (
              <Button
                size="default"
                className="mr-4"
                onClick={() => separateItems()}
                quantity={selectedRows.length}
                id="button-separate-item"
                disabled={!canChangeItemStatus}
                style={{ color: 'blue', borderColor: 'blue' }}
              >
                {formatMessage({
                  id: 'materialRequest.NewMaterialRequisition.separate',
                })}
              </Button>
            )}
          {hasPermission(userPermissions, 'AplicarItem') &&
            enableApply &&
            canBeUpdated && (
              <Button
                size="default"
                className="mr-4"
                onClick={() => applyItems()}
                quantity={selectedRows.length}
                disabled={!canChangeItemStatus}
                id="button-apply-item"
                style={{ color: '#00CCEE', borderColor: '#00CCEE' }}
              >
                {formatMessage({
                  id: 'materialRequest.NewMaterialRequisition.apply',
                })}
              </Button>
            )}
          {hasPermission(userPermissions, 'ExcluirItem') &&
            canBeUpdated &&
            enableDelete && (
              <Button
                size="default"
                quantity={selectedRows.length}
                onClick={() => confirmDeleteItems()}
                id="button-delete-item"
              >
                <i className="fa fa-trash fa-lg mr-3" />
                {formatMessage({
                  id: 'materialRequest.NewMaterialRequisition.delete',
                })}
              </Button>
            )}
        </div>
      )}
    </div>
  )
}

NewMaterialRequestTableHeader.propTypes = {
  selectedRows: PropTypes.array,
  addRequisitionItem: PropTypes.func,
  userPermissions: PropTypes.array,
  applyItems: PropTypes.func,
  separateItems: PropTypes.func,
  confirmDeleteItems: PropTypes.func,
  canChangeItemStatus: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
  period: PropTypes.any,
}
