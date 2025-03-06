/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from '@ant-design/compatible'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { removeNumberFormatting } from '@utils'
import {
  Button,
  Col,
  Divider,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Spin,
  Tooltip,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import { formatMessage } from 'umi-plugin-react/locale'
import ItemAvailable from '../modals/ItemAvailable'
import { Status } from '../utils'
import NewItemInputItem from './NewItemInputItem'
import NewItemInputPurchaseOrder from './NewItemInputPurchaseOrder'

const { Option } = Select

export default function NewItemStage2(props) {
  const {
    form,
    loadingStockLocation,
    statusSource,
    productSource,
    serviceSource,
    pieceDefectSource,
    stockLocationSource,
    canBeUpdated,
    itemSource,
    setItemSource,
    onChangeItem,
    openSimilarItem,
    onChangeStockLocation,
    refreshStock,
    purchaseOrderSource,
    setPurchaseOrderSource,
    onChangePurchaseOrder,
    loadingItem,
    priceListSource,
    selectedOption,
    currentItem,
    kitQuantity,
    canUpdateItem,
    refreshPriceListItem,
    onChangePriceList,
    loadingPriceListItem,
    screen,
    actStatusId,
  } = props
  
  const { getFieldDecorator } = form

  const { canDecimal } = currentItem

  const [showItemAvailable, setShowItemAvailable] = useState(false)

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem])

  useEffect(() => {
    let totalValue =
      removeNumberFormatting(form.getFieldValue('unitValue')) *
        form.getFieldValue('quantity') -
      removeNumberFormatting(form.getFieldValue('discountValue'))

    totalValue = parseFloat(totalValue.toFixed(2))
    form.setFieldsValue({ totalValue })
    form.validateFields(['totalValue'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.getFieldValue('unitValue'),
    form.getFieldValue('discountValue'),
    form.getFieldValue('quantity'),
  ])

  const openItemAvailable = () => {
    if (!form.getFieldValue('itemId')) {
      message.info(
        message.info(
          formatMessage({
            id: 'serviceOrder.serviceOrderParts.itemRequiredToSearchStock',
          }),
        ),
      )
    } else {
      setShowItemAvailable(true)
    }
  }

  const stockValidate = (rule, value, callback) => {
    if (value === 0) {
      callback(
        formatMessage({
          id: 'serviceOrder.modals.newItem.invalidStockLocation',
        }),
      )
    } else {
      callback()
    }
  }

  const totalValidate = (rule, value, callback) => {
    if (value < 0) {
      callback('Desconto inválido')
    } else {
      callback()
    }
  }

  return (
    <React.Fragment>
      <ItemAvailable
        show={showItemAvailable}
        itemId={form.getFieldValue('itemId')}
        toogleModalVisible={() => setShowItemAvailable(false)}
      />
      <Form layout="vertical">
        <Row type="flex" gutter={16}>
          <Col>
            <Row type="flex">
              <Col style={{ width: '530px' }}>
                <NewItemInputItem
                  form={form}
                  initialValue={currentItem.partId}
                  canBeUpdated={canUpdateItem}
                  itemSource={itemSource}
                  setItemSource={setItemSource}
                  onChangeItem={onChangeItem}
                  loading={loadingItem}
                  autoFocus
                />
                {form.getFieldValue('returnRequired') && (
                  <div style={{ marginTop: '-20px' }}>
                    <SmallTableFieldDescription
                      label={formatMessage({
                        id: 'serviceOrder.modals.newItem.requiredDevolution',
                      })}
                      fontStyle="italic"
                    />
                  </div>
                )}
              </Col>
              {!!form.getFieldValue('materialLikeCount') && (
                <Col className="ml-1" style={{ marginTop: '32px' }}>
                  <Tooltip title="Consultar itens similares e substitutos">
                    <Button
                      size="small"
                      shape="circle"
                      disabled={!canUpdateItem}
                      onClick={() => openSimilarItem()}
                    >
                      <i className="fa fa-link" style={{ color: 'gray' }} />
                    </Button>
                  </Tooltip>
                </Col>
              )}
            </Row>
          </Col>

          <Col style={{ width: '150px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.code',
              })}
            >
              {getFieldDecorator('itemCode', {
                initialValue: currentItem.partCode,
              })(<Input readOnly disabled={!canUpdateItem} tabIndex={-1} />)}
            </Form.Item>
          </Col>

          <Col style={{ width: '100px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.unity',
              })}
            >
              {getFieldDecorator('measuringUnitCode', {
                initialValue: currentItem.usedMeasuringUnitCode
                  ? currentItem.usedMeasuringUnitCode
                  : currentItem.measuringUnitCode,
              })(<Input readOnly tabIndex={-1} disabled={!canUpdateItem} />)}
            </Form.Item>
          </Col>

          <Col style={{ width: '150px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.quantity',
              })}
            >
              {getFieldDecorator('quantity', {
                initialValue:
                  selectedOption === 1
                    ? currentItem.quantity
                    : selectedOption === 2
                    ? currentItem.quantity * kitQuantity
                    : 1,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ],
              })(
                <InputNumber
                  min={canDecimal ? 0 : 1}
                  decimalSeparator=","
                  disabled={!canUpdateItem}
                  style={{
                    inlineSize: 'fit-content',
                  }}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col style={{ width: '350px' }}>
            <Row type="flex">
              <Col style={{ width: '290px' }}>
                <Form.Item
                  label={formatMessage({
                    id: 'serviceOrder.modals.newItem.stock',
                  })}
                >
                  {getFieldDecorator('stockLocationId', {
                    initialValue: currentItem.stockLocationId,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'requiredFieldMessage',
                        }),
                      },
                      { validator: stockValidate },
                    ],
                  })(
                    <Select
                      id="select-item-stock"
                      showSearch
                      size="default"
                      loading={loadingStockLocation}
                      disabled={!canUpdateItem}
                      onChange={onChangeStockLocation}
                      optionLabelProp="label"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {stockLocationSource.map(record => (
                        <Option
                          value={record.stockLocationId}
                          label={record.stockLocationDescription}
                        >
                          <Row type="flex">
                            <Col
                              className="truncate"
                              style={{ width: '160px' }}
                            >
                              {record.stockLocationDescription}
                            </Col>
                            <Col
                              className="text-right truncate"
                              style={{ width: '60px' }}
                            >
                              {record.quantityAvailable}
                            </Col>
                            <Col className="ml-1" style={{ width: '10px' }}>
                              {record.measuringUnitCode}
                            </Col>
                          </Row>
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col className="ml-1" style={{ marginTop: '32px' }}>
                <Tooltip
                  title={formatMessage({
                    id: 'serviceOrder.modals.newItem.refreshStock',
                  })}
                >
                  <Button
                    size="small"
                    shape="circle"
                    disabled={!canUpdateItem}
                    onClick={() => refreshStock()}
                  >
                    <i className="fa fa-repeat" style={{ color: 'gray' }} />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Col>

          <Col style={{ width: '200px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.stockAddress',
              })}
            >
              {getFieldDecorator('stockAddress', {
                initialValue: currentItem.stockAddress,
              })(
                <Input
                  size="default"
                  id="input-item-stock-address"
                  tabIndex={-1}
                  disabled={!canUpdateItem}
                  readOnly
                />,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '180px' }}>
            <Form.Item
              label={
                <Tooltip
                  title={formatMessage({
                    id: 'serviceOrder.serviceOrderParts.stockDetail',
                  })}
                >
                  <span
                    role="button"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openItemAvailable()}
                    className="primary-color"
                  >
                    {formatMessage({
                      id: 'serviceOrder.modals.newItem.quantityAvailable',
                    })}
                  </span>
                </Tooltip>
              }
            >
              {getFieldDecorator('quantityAvailable', { initialValue: null })(
                <Input
                  size="default"
                  id="input-item-available"
                  tabIndex={-1}
                  disabled={!canUpdateItem}
                  readOnly
                />,
              )}
            </Form.Item>
          </Col>
          <div
            style={{
              display: form.getFieldValue('quantityMissing') ? 'block' : 'none',
            }}
          >
            <Col style={{ width: '180px' }}>
              <Form.Item
                label={formatMessage({
                  id: 'serviceOrder.modals.newItem.quantityMissing',
                })}
              >
                {getFieldDecorator('quantityMissing', {
                  initialValue: currentItem.quantityMissing || 0,
                })(
                  <Input
                    size="default"
                    id="input-item-available"
                    tabIndex={-1}
                    disabled={!canUpdateItem}
                    readOnly
                  />,
                )}
              </Form.Item>
            </Col>
          </div>
        </Row>
        <Row type="flex" gutter={16}>
          <Col style={{ width: '300px' }}>
            <Form.Item label="Status">
              {getFieldDecorator('actStatusId', {
                initialValue:
                     currentItem.actStatusId
                    ? currentItem.actStatusId
                    : statusSource.length > 0
                    ? statusSource[0].id
                    : null,
              })(
                <Select size="default" disabled={!canBeUpdated}>
                  {statusSource.map(record => (
                    <Option value={record.id}>
                      <Status
                        description={record.description}
                        code={record.code}
                      />
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '200px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.fctao',
              })}
            >
              {getFieldDecorator('fctao', { initialValue: currentItem.fctao })(
                <Select
                  showSearch
                  size="default"
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="Empty"> </Option>
                  <Option value="Lacking">Faltante</Option>
                  <Option value="Fixed">Consertado</Option>
                  <Option value="Replaced">Trocado</Option>
                  <Option value="Applied">Aplicado</Option>
                  <Option value="Oriented">Orientado</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '300px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.occurrence',
              })}
            >
              {getFieldDecorator('pieceDefectId', {
                initialValue: currentItem.pieceDefectId,
              })(
                <Select
                  showSearch
                  size="default"
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {pieceDefectSource.map(record => (
                    <Option value={record.pieceDefectId}>
                      {record.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={16}>
          <Col style={{ width: '300px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.service',
              })}
            >
              {getFieldDecorator('serviceId', {
                initialValue: currentItem.serviceId,
              })(
                <Select
                  showSearch
                  size="default"
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {serviceSource.map(record => (
                    <Option value={record.serviceId}>
                      {record.serviceName}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '300px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.product',
              })}
            >
              {getFieldDecorator('finalCustomerProductId', {
                initialValue: currentItem.finalCustomerProductId
                  ? currentItem.finalCustomerProductId
                  : productSource.length > 0
                  ? productSource[0].finalCustomerProductId
                  : null,
              })(
                <Select
                  showSearch
                  size="default"
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {productSource.map(record => (
                    <Option value={record.finalCustomerProductId}>
                      {record.productName}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={16}>
          <Col style={{ width: '300px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.receipt',
              })}
            >
              {getFieldDecorator('receiptBy', {
                initialValue: currentItem.receiptBy,
              })(
                <Select
                  showSearch
                  size="default"
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="Empty"> </Option>
                  <Option value="Consumer">Consumidor</Option>
                  <Option value="Manufacturer">Fabricante</Option>
                  <Option value="GuaranteeTechnicalAssistance">
                    Garantia de serviço
                  </Option>
                  <Option value="ComplementaryGuarantee">
                    Garantia complementar
                  </Option>
                  <Option value="MaintenanceContract">
                    Contrato de manutenção
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '300px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.property',
              })}
            >
              {getFieldDecorator('isFromOthers', {
                initialValue: currentItem.isFromOthers || false,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ],
              })(
                <Select
                  showSearch
                  size="default"
                  disabled={!canBeUpdated}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={false}>Própria</Option>
                  <Option value>Terceiros</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={16}>
          <Col style={{ width: '190px' }}>
            <NewItemInputPurchaseOrder
              form={form}
              initialValue={currentItem.purchaseOrderId}
              canBeUpdated={canBeUpdated}
              onChangePurchaseOrder={onChangePurchaseOrder}
              purchaseOrderSource={purchaseOrderSource}
              setPurchaseOrderSource={setPurchaseOrderSource}
            />
          </Col>
          <Col style={{ width: '220px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.supplier',
              })}
            >
              {getFieldDecorator('supplierName', {
                initialValue: currentItem.supplierName,
              })(
                <Input
                  size="default"
                  tabIndex={-1}
                  disabled={!canBeUpdated}
                  readOnly
                />,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '190px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.requisition',
              })}
            >
              {getFieldDecorator('requestNewSequenceNumber', {
                initialValue: currentItem.requestNewSequenceNumber,
              })(
                <Input
                  size="default"
                  tabIndex={-1}
                  disabled={!canBeUpdated}
                  readOnly
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row type="flex" gutter={8}>
          <Col style={{ width: '200px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.priceList',
              })}
            >
              {getFieldDecorator('priceListId', {
                initialValue: priceListSource.find(
                  x => x.priceListId === currentItem.priceListId,
                )
                  ? currentItem.priceListId
                  : priceListSource.length > 0
                  ? priceListSource[0].priceListId
                  : null,
              })(
                <Select disabled={!canBeUpdated} onChange={onChangePriceList}>
                  {priceListSource.map(record => (
                    <Option value={record.priceListId}>
                      {record.priceListDescription}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col className="ml-1" style={{ marginTop: '32px' }}>
            <Tooltip
              title={formatMessage({
                id: 'serviceOrder.modals.newItem.refreshPriceListItem',
              })}
            >
              <Button
                size="small"
                shape="circle"
                disabled={
                  !canBeUpdated ||
                  !form.getFieldValue('priceListId') ||
                  !form.getFieldValue('itemId')
                }
                onClick={() => refreshPriceListItem()}
              >
                <i className="fa fa-repeat" style={{ color: 'gray' }} />
              </Button>
            </Tooltip>
          </Col>
        </Row>
        <Row type="flex" gutter={16}>
          <Col style={{ width: '150px' }}>
            <Spin spinning={loadingPriceListItem}>
              <Form.Item
                label={formatMessage({
                  id: 'serviceOrder.modals.newItem.unitaryValue',
                })}
              >
                {getFieldDecorator('unitValue', {
                  initialValue: currentItem.unitValue || 0,
                })(
                  <NumberFormat
                    maxLength={15}
                    className="ant-input"
                    decimalScale={2}
                    allowNegative={false}
                    thousandSeparator="."
                    decimalSeparator=","
                    fixedDecimalScale
                    disabled={!canBeUpdated}
                  />,
                )}
              </Form.Item>
            </Spin>
          </Col>
          <Col style={{ width: '150px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.discountValue',
              })}
            >
              {getFieldDecorator('discountValue', {
                initialValue: currentItem.discountValue || 0,
              })(
                <NumberFormat
                  maxLength={15}
                  className="ant-input"
                  decimalScale={2}
                  allowNegative={false}
                  thousandSeparator="."
                  decimalSeparator=","
                  fixedDecimalScale
                  disabled={!canBeUpdated}
                />,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '150px' }}>
            <Form.Item
              label={formatMessage({
                id: 'serviceOrder.modals.newItem.total',
              })}
            >
              {getFieldDecorator('totalValue', {
                initialValue: null,
                rules: [{ validator: totalValidate }],
              })(
                <NumberFormat
                  maxLength={15}
                  className="ant-input"
                  readOnly
                  tabIndex={-1}
                  decimalScale={2}
                  allowNegative
                  thousandSeparator="."
                  decimalSeparator=","
                  fixedDecimalScale
                  disabled={!canBeUpdated}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: 'none' }}>
          <React.Fragment>
            {getFieldDecorator('materialLikeCount', {
              initialValue: currentItem.materialLikeCount,
            })(<Input />)}
          </React.Fragment>
          <React.Fragment>
            {getFieldDecorator('returnRequired', {
              initialValue: currentItem.returnRequired || false,
            })(<Input />)}
          </React.Fragment>
          <React.Fragment>
            {getFieldDecorator('itemDescription', {
              initialValue: currentItem.partDescription,
            })(<Input />)}
          </React.Fragment>
          <React.Fragment>
            {getFieldDecorator('requestNewItemId', {
              initialValue: currentItem.requestNewItemId,
            })(<Input />)}
          </React.Fragment>
          <React.Fragment>
            {getFieldDecorator('measuringUnitId', {
              initialValue: currentItem.usedMeasuringUnitId
                ? currentItem.usedMeasuringUnitId
                : currentItem.measuringUnitId,
            })(<Input />)}
          </React.Fragment>
        </div>
      </Form>
    </React.Fragment>
  )
}

NewItemStage2.propTypes = {
  form: PropTypes.any,
  loadingStockLocation: PropTypes.bool,
  statusSource: PropTypes.array,
  productSource: PropTypes.array,
  serviceSource: PropTypes.array,
  pieceDefectSource: PropTypes.array,
  stockLocationSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  onChangeItem: PropTypes.func,
  itemSource: PropTypes.array,
  setItemSource: PropTypes.func,
  openSimilarItem: PropTypes.func,
  refreshStock: PropTypes.func,
  onChangeStockLocation: PropTypes.func,
  loadingItem: PropTypes.bool,
  priceListSource: PropTypes.array,
  selectedOption: PropTypes.number,
  currentItem: PropTypes.any,
  kitQuantity: PropTypes.number,
  purchaseOrderSource: PropTypes.array,
  setPurchaseOrderSource: PropTypes.func,
  onChangePurchaseOrder: PropTypes.func,
  canUpdateItem: PropTypes.bool,
  refreshPriceListItem: PropTypes.func,
  onChangePriceList: PropTypes.func,
  loadingPriceListItem: PropTypes.bool,
}
