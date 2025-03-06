import DefaultTable from '@components/DefaultTable'
import { apiMaterialRequest } from '@services/api'
import { customSort, handleAuthError } from '@utils'
import { Button, message, Modal, Row, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function ItemAvailableDetail(props) {
  const {
    show,
    itemId,
    stockLocationId,
    toogleModalVisible,
    quantityType,
  } = props
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const columns = [
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.serviceOrderAbbreviation',
      }),
      dataIndex: 'serviceOrderSequenceNumber',
      width: '50px',
      sorter: (a, b) =>
        (a.serviceOrderSequenceNumber || 0) -
        (b.serviceOrderSequenceNumber || 0),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.openingDate',
      }),
      width: '100px',
      dataIndex: 'serviceOrderOpeningDate',
      sorter: (a, b) =>
        customSort(a.serviceOrderOpeningDate, b.serviceOrderOpeningDate),
      render: (text, record) =>
        record.serviceOrderOpeningDate
          ? moment(record.serviceOrderOpeningDate).format('DD/MM/YYYY')
          : '',
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.titularName',
      }),
      width: '100px',
      dataIndex: 'titularName',
      sorter: (a, b) => customSort(a.titularName, b.titularName),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.product',
      }),
      width: '100px',
      dataIndex: 'productDescription',
      sorter: (a, b) => customSort(a.productDescription, b.productDescription),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.requestNumber',
      }),
      width: '60px',
      dataIndex: 'requestNewSequenceNumber',
      sorter: (a, b) =>
        (a.requestNewSequenceNumber || 0) - (b.requestNewSequenceNumber || 0),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.requesterName',
      }),
      width: '100px',
      dataIndex: 'requesterName',
      sorter: (a, b) => customSort(a.requesterName, b.requesterName),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.quantity',
      }),
      width: '80px',
      sorter: (a, b) => getQuantity(a) - getQuantity(b),
      render: (text, record) => getQuantity(record),
    },
  ]

  const getQuantity = record => {
    return quantityType === 'Reserved'
      ? record.quantityReserved || 0
      : quantityType === 'Requested'
      ? record.quantityRequested || 0
      : quantityType === 'Missing'
      ? record.quantityMissing || 0
      : quantityType === 'Applied'
      ? record.quantityApplied || 0
      : 0
  }

  useEffect(() => {
    if (show) {
      setData([])
      getItemAvailableDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  async function getItemAvailableDetail() {
    setLoading(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/itemAvailableDetail`,
        params: { itemId, stockLocationId, quantityType },
      })
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        setData(data.itemAvailableDetail)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  return (
    <Modal
      title={formatMessage({
        id:
          quantityType === 'Reserved'
            ? 'serviceOrder.serviceOrderParts.reservedDetail'
            : quantityType === 'Requested'
            ? 'serviceOrder.serviceOrderParts.requestedDetail'
            : quantityType === 'Applied'
            ? 'serviceOrder.serviceOrderParts.appliedDetail'
            : quantityType === 'Missing'
            ? 'serviceOrder.serviceOrderParts.missingDetail'
            : 'serviceOrder.serviceOrderParts.invalidQuantityType',
      })}
      visible={show}
      width={1000}
      centered
      destroyOnClose
      onCancel={() => toogleModalVisible()}
      footer={
        <Row type="flex">
          <Button
            type="secondary"
            className="ml-3"
            style={{
              marginLeft: 'auto',
            }}
            onClick={() => toogleModalVisible()}
          >
            {formatMessage({ id: 'serviceOrder.serviceOrderParts.close' })}
          </Button>
        </Row>
      }
    >
      <Spin spinning={loading}>
        <div className="w-full">
          <DefaultTable
            size="small"
            rowKey={record => record.materialAvailableId}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
        <Row className="w-full mt-2 text-right" justify="end">
          <h3>
            <span className="mr-2">Total:</span>
            <span>
              {data.reduce(
                (accumulator, currentValue) =>
                  accumulator + getQuantity(currentValue),
                0,
              )}
            </span>
          </h3>
        </Row>
      </Spin>
    </Modal>
  )
}
ItemAvailableDetail.propTypes = {
  show: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  itemId: PropTypes.number,
  stockLocationId: PropTypes.number,
  quantityType: PropTypes.string,
}
