import { CheckCircleFilled } from '@ant-design/icons'
import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import { customSort } from '@utils'
import { Badge, Tooltip } from 'antd'
import { PropTypes } from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import ItemAvailable from '../../../ServiceOrder/ServiceOrderParts/modals/ItemAvailable'
import { getColorStatusItem } from '../../utils'

export default function NewMaterialRequestTable({
  data,
  setSelectedRows,
  addRequisitionItem,
  keyTable,
  canBeUpdated,
}) {
  const [itemId, setItemId] = useState(null)
  const [showItemAvailable, setShowItemAvailable] = useState(false)

  const openItemAvailable = id => {
    setItemId(id)
    setShowItemAvailable(true)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRowsArray) => {
      setSelectedRows(selectedRowsArray)
    },
  }
  const columns = [
    {
      title: formatMessage({
        id: 'materialRequest.NewMaterialRequisition.code',
      }),
      dataIndex: 'itemCode',
      width: 150,
      sorter: (a, b) => customSort(a.itemCode, b.itemCode),
      // render: (text, record) => ( <Tooltip title={record.requestNewItemId}>{record.itemCode}</Tooltip> ),
    },
    {
      title: formatMessage({
        id: 'materialRequest.NewMaterialRequisition.description',
      }),
      dataIndex: 'itemDescription',
      // width: 250,
      sorter: (a, b) => customSort(a.itemDescription, b.itemDescription),
    },
    {
      title: formatMessage({
        id: 'materialRequest.NewMaterialRequisition.quantity',
      }),
      dataIndex: 'quantityRequested',
      width: 130,
      sorter: (a, b) => a.quantityRequested - b.quantityRequested,
      render: (text, record) => (
        <span>
          <p className="m-0 flex">
            <Tooltip title="Quantidade requisitada">
              <span
                role="button"
                style={{ cursor: 'pointer' }}
                onClick={() => openItemAvailable(record.itemId)}
                className="primary-color"
              >
                {record.quantityRequested}
              </span>
            </Tooltip>
            {record.actStatusCode.includes('APL') && (
              <div className="flex">
                <span className="ml-1 mr-1">/</span>
                <Tooltip title="Quantidade aplicada">
                  {record.quantityApplied}
                </Tooltip>
              </div>
            )}
          </p>
          <Tooltip
            placement="bottom"
            title={
              record.actStatusCode === 'SEPA' || record.actStatusCode.includes('APL')
                ? formatMessage({
                    id: 'materialRequest.NewMaterialRequisition.separatedItem',
                  })
                : formatMessage({
                    id:
                      'materialRequest.NewMaterialRequisition.notSeparatedItem',
                  })
            }
          >
            <CheckCircleFilled
              style={
                record.actStatusCode === 'SEPA' ||
                record.actStatusCode.includes('APL')
                  ? {
                      color: '#1E88E5',
                    }
                  : {
                      color: 'gray',
                    }
              }
            />
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={
              record.actStatusCode.includes('APL')
                ? formatMessage({
                    id: 'materialRequest.NewMaterialRequisition.appliedItem',
                  })
                : formatMessage({
                    id: 'materialRequest.NewMaterialRequisition.notAppliedItem',
                  })
            }
          >
            <CheckCircleFilled
              style={
                record.actStatusCode.includes('APL')
                  ? {
                      color: '#1E88E5',
                    }
                  : {
                      color: 'gray',
                    }
              }
              className="ml-1"
            />
          </Tooltip>
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'materialRequest.NewMaterialRequisition.stock',
      }),
      dataIndex: 'stockLocationDescription',
      width: 200,
      sorter: (a, b) =>
        customSort(a.stockLocationDescription, b.stockLocationDescription),
      render: (text, record) => (
        <span
          style={{
            alignContent: 'center',
          }}
        >
          <p className="m-0">{text}</p>
          <p
            className="m-0"
            style={{
              fontSize: 'small',
              color: 'gray',
              fontStyle: 'italic',
            }}
          >
            {record.stockAddress}
          </p>
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'materialRequest.NewMaterialRequisition.status',
      }),
      dataIndex: 'actStatusDescription',
      width: 200,
      sorter: (a, b) =>
        customSort(a.actStatusDescription, b.actStatusDescription),
      render: (actStatusDescription, record) => (
        <span>
          <Badge
            status={record.actStatusCode === 'PEND' ? 'warning' : 'success'}
            color={getColorStatusItem(record.actStatusCode)}
            text={actStatusDescription}
          />
          <p
            className="m-0"
            style={{
              fontSize: 'small',
              color: 'gray',
              fontStyle: 'italic',
            }}
          >
            {record.actReasonDescription}
          </p>
          {record.actStatusCode !== 'CANC' &&
            record.serviceOrderPartActStatusCode === 'CANC' && (
              <small style={{ color: 'red' }}>
                <i>Item cancelado na OS</i>
              </small>
            )}
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'materialRequest.NewMaterialRequisition.originDocument',
      }),
      dataIndex: 'sequenceNumber',
      width: 200,
      sorter: (a, b) => a.sequenceNumber - b.sequenceNumber,
      render: (text, record) => (
        <span>
          <p className="m-0">
            {text}
            {record.documentOriginId && !record.documentInProgress && (
              <Tooltip
                title={formatMessage({
                  id:
                    'materialRequest.NewMaterialRequisition.documentNotInProgress',
                })}
              >
                <i
                  className="ml-2 fa fa-exclamation-triangle"
                  style={{ color: 'red' }}
                />
              </Tooltip>
            )}
          </p>
          <p
            className="m-0"
            style={{
              fontSize: 'small',
              color: 'gray',
              fontStyle: 'italic',
            }}
          >
            {record.customerName}
          </p>
        </span>
      ),
    },
    {
      title: '',
      key: 'operation',
      align: 'right',
      render: (text, record) => (
        <Tooltip placement="top" title={canBeUpdated && !record.actStatusCode.includes('APL') ? 'Editar' : 'Consultar'}>
          <Button
            shape="circle"
            size="default"
            type="primary"
            ghost
            iconButton
            onClick={() => addRequisitionItem(record)}
            className="iconButton"
            id="button-edit-item"
          >
            <i
              className={`fa fa-${canBeUpdated && !record.actStatusCode.includes('APL') ? 'pencil' : 'search'} fa-lg`}
            />
          </Button>
        </Tooltip>
      ),
    },
  ]
  return (
    <div className="mt-2">
      <ItemAvailable
        show={showItemAvailable}
        itemId={itemId}
        toogleModalVisible={() => setShowItemAvailable(false)}
      />

      <DefaultTable
        id="table-requisition-items"
        columns={columns}
        dataSource={data}
        rowSelection={canBeUpdated ? rowSelection : undefined}
        key={keyTable}
      />
    </div>
  )
}

NewMaterialRequestTable.propTypes = {
  data: PropTypes.array,
  setSelectedRows: PropTypes.func,
  addRequisitionItem: PropTypes.func,
  keyTable: PropTypes.number,
  canBeUpdated: PropTypes.bool,
}
