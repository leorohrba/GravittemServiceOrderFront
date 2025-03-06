import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiMaterialRequest } from '@services/api'
import { handleAuthError } from '@utils'
import { Button, Col, message, Row, Select, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processSearchId = 0

const NewItemInputPurchaseOrder = props => {
  const {
    form,
    canBeUpdated,
    autoFocus,
    onChangePurchaseOrder,
    purchaseOrderSource,
    setPurchaseOrderSource,
    initialValue,
  } = props
  const { getFieldDecorator } = form

  const [documentDescription, setPurchaseOrderDescription] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const debouncedPurchaseOrderDescription = useDebounce(
    documentDescription,
    400,
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedPurchaseOrderDescription) {
      populatePurchaseOrderSearch(debouncedPurchaseOrderDescription)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPurchaseOrderDescription])

  const handleSearchPurchaseOrder = value => {
    setPurchaseOrderDescription(value)
  }

  const populatePurchaseOrderSearch = description => {
    setPurchaseOrderSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getPurchaseOrders(description)
      .then(records => {
        if (internalProcessSearchId === processSearchId) {
          const source = []
          setNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                purchaseOrderId: record.purchaseOrderId,
                sequenceNumber: record.sequenceNumber,
                supplierName: record.supplierName,
              }),
            )
          } else {
            setNoResultsMessage('Pedido de compra inválido')
          }
          setPurchaseOrderSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os pedidos')
        setLoading(false)
      })
  }

  const getPurchaseOrders = description => {
    if (!description) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      sequenceNumber: description,
    }

    return apiMaterialRequest
      .get(`/api/purchase/PurchaseOrder`, { params })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.purchaseOrder
        }

        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const clearPurchaseOrder = () => {
    setPurchaseOrderSource([])
    form.setFieldsValue({ purchaseOrderId: null })
    onChangePurchaseOrder(null)
  }

  return (
    <Row type="flex">
      <Col
        style={{
          width: form.getFieldValue('purchaseOrderId') ? '83%' : '100%',
        }}
      >
        <Form.Item label="Pedido de compra" className="mb-0">
          {getFieldDecorator('purchaseOrderId', {
            initialValue,
          })(
            <Select
              placeholder="Número do pedido"
              disabled={!canBeUpdated}
              filterOption={false}
              showSearch
              onChange={onChangePurchaseOrder}
              onSearch={handleSearchPurchaseOrder}
              showArrow={false}
              className="select-autocomplete"
              autoFocus={
                autoFocus === null || autoFocus === undefined
                  ? false
                  : autoFocus
              }
              notFoundContent={
                loading ? (
                  <Spin size="small" />
                ) : documentDescription ? (
                  noResultsMessage
                ) : null
              }
            >
              {purchaseOrderSource.map((record, index) => (
                <Option key={index} value={record.purchaseOrderId}>
                  {record.sequenceNumber}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
      {form.getFieldValue('purchaseOrderId') && (
        <Col className="ml-1" style={{ marginTop: '32px' }}>
          <Tooltip title="Limpar ordem de compra">
            <Button
              size="small"
              shape="circle"
              disabled={!canBeUpdated}
              onClick={() => clearPurchaseOrder()}
            >
              <i className="fa fa-eraser" style={{ color: 'gray' }} />
            </Button>
          </Tooltip>
        </Col>
      )}
    </Row>
  )
}

NewItemInputPurchaseOrder.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onChangePurchaseOrder: PropTypes.func,
  setPurchaseOrderSource: PropTypes.func,
  purchaseOrderSource: PropTypes.array,
  initialValue: PropTypes.number,
}

export default NewItemInputPurchaseOrder
