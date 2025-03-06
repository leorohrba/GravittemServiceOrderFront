import DefaultTable from '@components/DefaultTable'
import { apiMaterialRequest } from '@services/api'
import { customSort, handleAuthError } from '@utils'
import { Button, Col, message, Modal, Row, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import ItemAvailableDetail from './ItemAvailableDetail'

export default function ItemAvailable(props) {
  const { show, itemId, toogleModalVisible } = props
  const [itemDescription, setItemDescription] = useState(null)
  const [itemCode, setItemCode] = useState(null)
  const [measuringUnitCode, setMeasuringUnitCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingItem, setLoadingItem] = useState(false)
  const [data, setData] = useState([])
  const [quantityApplied, setQuantityApplied] = useState(null)
  const [quantityStock, setQuantityStock] = useState(null)
  const [quantityReserved, setQuantityReserved] = useState(null)
  const [quantityMissing, setQuantityMissing] = useState(null)
  const [quantityRequested, setQuantityRequested] = useState(null)
  const [quantityAvailable, setQuantityAvailable] = useState(null)
  const [showItemAvailableDetail, setShowItemAvailableDetail] = useState(false)
  const [stockLocationId, setStockLocationId] = useState(null)
  const [quantityType, setQuantityType] = useState(null)

  const columns = [
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.stockLocationDescription',
      }),
      dataIndex: 'stockLocationDescription',
      width: '200px',
      sorter: (a, b) =>
        customSort(a.stockLocationDescription, b.stockLocationDescription),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.stockAddress',
      }),
      width: '100px',
      dataIndex: 'stockAddress',
      sorter: (a, b) => customSort(a.stockAddress, b.stockAddress),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.stock',
      }),
      width: '100px',
      dataIndex: 'quantityStock',
      sorter: (a, b) => a.quantityStock - b.quantityStock,
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.requested',
      }),
      width: '100px',
      dataIndex: 'quantityRequested',
      sorter: (a, b) => a.quantityRequested - b.quantityRequested,
      render: (text, record) => (
        <span
          role="button"
          style={{ cursor: 'pointer' }}
          onClick={() => openDetail(record.stockLocationId, 'Requested')}
          className="primary-color"
        >
          {record.quantityRequested}
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.reserved',
      }),
      width: '100px',
      dataIndex: 'quantityReserved',
      sorter: (a, b) => a.quantityReserved - b.quantityReserved,
      render: (text, record) => (
        <span
          role="button"
          style={{ cursor: 'pointer' }}
          onClick={() => openDetail(record.stockLocationId, 'Reserved')}
          className="primary-color"
        >
          {record.quantityReserved}
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.missing',
      }),
      width: '100px',
      dataIndex: 'quantityMissing',
      sorter: (a, b) => a.quantityMissing - b.quantityMissing,
      render: (text, record) => (
        <span
          role="button"
          style={{ cursor: 'pointer' }}
          onClick={() => openDetail(record.stockLocationId, 'Missing')}
          className="primary-color"
        >
          {record.quantityMissing}
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.applied',
      }),
      width: '100px',
      dataIndex: 'quantityApplied',
      sorter: (a, b) => a.quantityApplied - b.quantityApplied,
      render: (text, record) => (
        <span
          role="button"
          style={{ cursor: 'pointer' }}
          onClick={() => openDetail(record.stockLocationId, 'Applied')}
          className="primary-color"
        >
          {record.quantityApplied}
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.available',
      }),
      width: '100px',
      dataIndex: 'quantityAvailable',
      sorter: (a, b) => a.quantityAvaialble - b.quantityAvailable,
    },
  ]

  const openDetail = (id, type) => {
    setStockLocationId(id)
    setQuantityType(type)
    setShowItemAvailableDetail(true)
  }

  useEffect(() => {
    if (show) {
      setData([])
      getItem()
      getItemAvailable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  async function getItem() {
    setLoadingItem(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/searchItem`,
        params: { itemId },
      })
      setLoadingItem(false)
      const { data } = response

      if (data.isOk && data.items.length > 0) {
        const record = data.items[0]
        setItemCode(record.code)
        setItemDescription(record.description)
        setMeasuringUnitCode(record.measuringUnitCode)
      } else if (data.isOk && data.items.length === 0) {
        message.error('Item não cadastrado!')
        toogleModalVisible()
      } else {
        setLoadingItem(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoadingItem(false)
      handleAuthError(error)
    }
  }

  useEffect(() => {
    setQuantityStock(
      data.reduce(
        (accumulator, currentValue) => accumulator + currentValue.quantityStock,
        0,
      ),
    )
    setQuantityReserved(
      data.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityReserved,
        0,
      ),
    )
    setQuantityApplied(
      data.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityApplied,
        0,
      ),
    )
    setQuantityRequested(
      data.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityRequested,
        0,
      ),
    )
    setQuantityMissing(
      data.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityMissing,
        0,
      ),
    )
    setQuantityAvailable(
      data.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityAvailable,
        0,
      ),
    )
  }, [data])

  async function getItemAvailable() {
    setLoading(true)
    try {
      const response = await apiMaterialRequest({
        method: 'POST',
        url: `/api/stock/searchItemAvailable`,
        data: { itemAvailableParameters: [{ itemId }] },
      })
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        setData(data.itemAvailable)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  return (
    <React.Fragment>
      <ItemAvailableDetail
        itemId={itemId}
        show={showItemAvailableDetail}
        stockLocationId={stockLocationId}
        quantityType={quantityType}
        toogleModalVisible={() => setShowItemAvailableDetail(false)}
      />
      <Modal
        title={formatMessage({
          id: 'serviceOrder.serviceOrderParts.stockDetail',
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
        <Skeleton
          loading={loading || loadingItem}
          paragraph={{ rows: 8 }}
          active
        >
          <Spin spinning={loading || loadingItem}>
            <Row className="mb-2">
              <h3>{`Item: ${itemCode} - ${itemDescription} (${measuringUnitCode})`}</h3>
            </Row>
            <Row style={{ width: '967px' }}>
              <DefaultTable
                size="small"
                rowKey={record => `${record.itemId}${record.stockLocationId}`}
                columns={columns}
                dataSource={data}
                pagination={false}
                footer={() => (
                  <Row className="w-full" type="flex">
                    <Col className="mr-0" style={{ width: '310px' }}>
                      <b>Total</b>
                    </Col>
                    <Col className="mr-0" style={{ width: '100px' }}>
                      <b>{quantityStock}</b>
                    </Col>
                    <Col className="mr-6" style={{ width: '100px' }}>
                      <b>{quantityRequested}</b>
                    </Col>
                    <Col className="mr-2" style={{ width: '100px' }}>
                      <b>{quantityReserved}</b>
                    </Col>
                    <Col className="mr-0" style={{ width: '100px' }}>
                      <b>{quantityMissing}</b>
                    </Col>
                    <Col className="mr-0" style={{ width: '100px' }}>
                      <b>{quantityApplied}</b>
                    </Col>
                    <Col className="mr-0" style={{ width: '100px' }}>
                      <b>{quantityAvailable}</b>
                    </Col>
                  </Row>
                )}
              />
            </Row>
          </Spin>
        </Skeleton>
      </Modal>
    </React.Fragment>
  )
}
ItemAvailable.propTypes = {
  show: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  itemId: PropTypes.number,
}
