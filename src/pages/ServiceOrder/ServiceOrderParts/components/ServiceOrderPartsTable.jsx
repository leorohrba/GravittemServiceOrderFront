import React, { useState } from 'react'
import DefaultTable from '@components/DefaultTable'
import { customSort, getLocaleCurrency } from '@utils'
import { Button, message, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { formatMessage, formatNumber } from 'umi-plugin-react/locale'
import ItemAvailable from '../modals/ItemAvailable'
import { Status } from '../utils'

export default function ServiceOrderPartsTable({
  data,
  rowSelection,
  keyTable,
  newItem,
  serviceOrder,
}) {
  const [showItemAvailable, setShowItemAvailable] = useState(false)
  const [itemId, setItemId] = useState(null)

  const columns = [
    {
      title: '',
      dataIndex: 'partId',
      render: text => (
        <div className="flex justify-center">
          {!text && (
            <Tooltip title="Peça não cadastrada">
              <span className="fa fa-exclamation-circle fa-lg" />
            </Tooltip>
          )}
        </div>
      ),
      width: 50,
    },
    {
      title: formatMessage({ id: 'serviceOrder.serviceOrderParts.code' }),
      dataIndex: 'partCode',
      sorter: (a, b) => customSort(a.partCode, b.partCode),
      // render: (text, record) => ( <Tooltip title={record.serviceOrderPartId}>{record.partCode}</Tooltip> ),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.description',
      }),
      dataIndex: 'partDescription',
      sorter: (a, b) => customSort(a.partDescription, b.partDescription),
    },
    {
      title: formatMessage({ id: 'serviceOrder.serviceOrderParts.quantity' }),
      dataIndex: 'quantity',
      width: 120,
      render: (text, record) => (
        <div>
          {record.partId ? (
            <span
              role="button"
              style={{ cursor: 'pointer' }}
              onClick={() => openItemAvailable(record.partId)}
              className="primary-color"
            >
              {record.quantity.toString().replace('.', ',')}
            </span>
          ) : (
            <span>{record.quantity.toString().replace('.', ',')}</span>
          )}
          {record.actStatusCode === 'FALT' &&
            !!record.quantityAvailable &&
            !!record.quantityMissing &&
            record.quantityMissing <= record.quantityAvailable && (
              <Tooltip
                title={formatMessage({
                  id: 'serviceOrder.serviceOrderParts.itemAlreadyAvailable',
                })}
              >
                <i
                  className="fa fa-exclamation-triangle ml-2"
                  style={{ color: '#4CAF50' }}
                />
              </Tooltip>
            )}
        </div>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.unitaryValue',
      }),
      dataIndex: 'unitValue',
      width: 140,
      sorter: (a, b) => a.unitValue - b.unitValue,
      render: d =>
        formatNumber(d || 0, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: formatMessage({ id: 'serviceOrder.serviceOrderParts.discount' }),
      dataIndex: 'discountValue',
      width: 120,
      sorter: (a, b) => a.discountValue - b.discountValue,
      render: d =>
        formatNumber(d || 0, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: formatMessage({ id: 'serviceOrder.serviceOrderParts.total' }),
      dataIndex: 'totalValue',
      width: 140,
      sorter: (a, b) => a.totalValue - b.totalValue,
      render: d =>
        formatNumber(d || 0, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: formatMessage({ id: 'serviceOrder.serviceOrderParts.status' }),
      width: 150,
      dataIndex: 'actStatusDescription',
      sorter: (a, b) =>
        customSort(a.actStatusDescription, b.actStatusDescription),
      render: (text, record) => (
        <div>
          <Status
            code={record.actStatusCode}
            description={record.actStatusDescription}
          />
          {(record.actStatusCode === 'FALT' ||
            record.actStatusCode === 'AGUA') &&
            record.quantityMissing && (
              <Tooltip
                title={formatMessage({
                  id: 'serviceOrder.serviceOrderParts.quantityMissing',
                })}
              >
                <span className="ml-2" style={{ color: 'gray' }}>
                  <small>
                    <i>{`(${record.quantityMissing})`}</i>
                  </small>
                </span>
              </Tooltip>
            )}
          {!!record.purchaseOrderSequenceNumber && (
            <React.Fragment>
              <br />
              <small>{`Pedido de compra ${record.purchaseOrderSequenceNumber}`}</small>
            </React.Fragment>
          )}
        </div>
      ),
    },
    {
      title: '',
      key: 'operation',
      align: 'right',
      render: (text, record) => (
        <React.Fragment>
          {serviceOrder && serviceOrder.inProgress && (
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              iconButton
              onClick={() => newItem(record.serviceOrderPartId)}
              className="iconButton"
            >
              <i className="fa fa-pencil fa-lg" />
            </Button>
          )}
        </React.Fragment>
      ),
    },
  ]

  const openItemAvailable = id => {
    if (id === 0) {
      message.info('Este item não possui informações de estoque!')
      return
    }
    setItemId(id)
    setShowItemAvailable(true)
  }

  return (
    <React.Fragment>
      <ItemAvailable
        show={showItemAvailable}
        itemId={itemId}
        toogleModalVisible={() => setShowItemAvailable(false)}
      />
      <DefaultTable
        rowKey={record => record.serviceOrderPartId}
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        key={keyTable}
        size="small"
        pagination={false}
        sticky={{ offsetHeader: 50 }}
      />
    </React.Fragment>
  )
}

ServiceOrderPartsTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.array,
  newItem: PropTypes.func,
  serviceOrder: PropTypes.any,
  keyTable: PropTypes.number,
}
