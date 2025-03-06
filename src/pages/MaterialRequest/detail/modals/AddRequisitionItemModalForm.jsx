import { Form } from '@ant-design/compatible'
import { InfoCircleFilled } from '@ant-design/icons'
import { hasPermission } from '@utils'
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Input,
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
import ItemAvailable from '../../../ServiceOrder/ServiceOrderParts/modals/ItemAvailable'
import AddRequisitionItemInputDocument from './AddRequisitionItemInputDocument'
import AddRequisitionItemInputItem from './AddRequisitionItemInputItem'

const { Option } = Select

const AddRequisitionItemModalForm = React.forwardRef((props, ref) => {
  const {
    form,
    onChangeItem,
    itemSource,
    setItemSource,
    canBeUpdated,
    stockLocationSource,
    loadingStockLocation,
    onChangeStockLocation,
    onChangeDocumentOrigin,
    documentOriginSource,
    setDocumentOriginSource,
    statusSource,
    reasonSource,
    onChangeStatus,
    visible,
    refreshForm,
    refreshReason,
    loadingReason,
    refreshStock,
    openSimilarItem,
    materialLikeCount,
    loadingItem,
    canUpdateStatus,
    warningMessage,
    requestNewItem,
    requesterId,
    userPermissions,
    getPriceListItem,
    priceLists,
    loadingPriceListItem,
    period,
    isRequisicaoOficina,
    requestItem,
  } = props

  const { getFieldDecorator } = form
  const [showItemAvailable, setShowItemAvailable] = useState(false)

  const appliedTooltip = formatMessage({
    id: 'materialRequest.AddRequisitionItemModalForm.appliedTooltip',
  })
  const separateTooltip = formatMessage({
    id: 'materialRequest.AddRequisitionItemModalForm.separateTooltip',
  })
  const calculateDescriptionTooltip = formatMessage({
    id: 'materialRequest.AddRequisitionItemModalForm.calculateDescription',
  })
  const reserveDescriptionTooltip = formatMessage({
    id: 'materialRequest.AddRequisitionItemModalForm.reserveDescription',
  })
  const reserveUsedDescriptionTooltip = formatMessage({
    id: 'materialRequest.AddRequisitionItemModalForm.reserveUsedDescription',
  })

  useEffect(() => {
    if (visible) {
      refreshForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const quantityRequestedValidate = (rule, value, callback) => {
    const quantity = parseFloat(value)
    if (quantity === 0) {
      callback('Quantidade não pode ser zero!')
    } else if (value && form.getFieldValue('itemId')) {
      const item = itemSource.find(x => x.id === form.getFieldValue('itemId'))

      if (item && !item.canDecimal && quantity - Math.floor(quantity) > 0) {
        callback('Quantidade deve ser inteira!')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  const statusValidate = (rule, value, callback) => {
    const status = statusSource.find(x => x.id === value)
    if (
      status &&
      status?.code === 'APLI' &&
      requestNewItem?.serviceOrderPartActStatusCode === 'CANC' &&
      requestNewItem?.documentOriginId ===
        form.getFieldValue('documentOriginId')
    ) {
      callback('Item cancelado na OS!')
    } else {
      callback()
    }
  }

  const quantityAppliedValidate = async (rule, value, callback) => {
    const quantity = parseFloat(value)
    let statusCode = 'PEND'
    const status = statusSource.find(
      x => x.id === form.getFieldValue('actStatusId'),
    )
    if (status) {
      statusCode = status.code
    }

    if (statusCode !== 'APLI' && value) {
      // throw new Error('Quantidade deve ficar em branco!')
      callback('Quantidade deve ficar em branco!')
    } else if (statusCode === 'APLI' && !quantity) {
      // throw new Error('Campo obrigatório!')
      callback('Campo obrigatório!')
    } else if (
      statusCode === 'APLI' &&
      quantity > parseFloat(form.getFieldValue('quantityRequested'))
    ) {
      // throw new Error('Quantidade superior a requisitada!')
      callback('Quantidade superior a requisitada!')
    } else if (value) {
      const item = itemSource.find(x => x.id === form.getFieldValue('itemId'))

      if (item && !item.canDecimal && quantity - Math.floor(quantity) > 0) {
        // throw new Error('Quantidade deve ser inteira!')
        callback('Quantidade deve ser inteira!')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  const stockValidate = (rule, value, callback) => {
    if (value === 0) {
      callback('É necessário informar local de estoque válido!')
    } else {
      callback()
    }
  }

  const quantityAvailableCalculateValidate = (rule, value, callback) => {
    if (value < 0) {
      callback('Quantidade indisponível!')
    } else {
      callback()
    }
  }

  const onChangeSeparate = e => {
    const isSeparate = e.target.checked
    const status = isSeparate
      ? statusSource.find(x => x.code === 'SEPA')
      : statusSource.find(x => x.code === 'PEND')
    const currentActStatusId = form.getFieldValue('actStatusId')
    const actStatusId = status ? status.id : currentActStatusId
    form.setFieldsValue({
      applied: status.code !== 'SEPA' ? false : form.getFieldValue('applied'),
      quantityApplied:
        status.code !== 'SEPA' ? null : form.getFieldValue('quantityApplied'),
      actStatusId,
    })
    refreshReason(actStatusId)
  }

  const onChangeApplied = e => {
    const isApplied = e.target.checked
    const status = isApplied
      ? statusSource.find(x => x.code === 'APLI')
      : statusSource.find(x => x.code === 'SEPA')
    const currentActStatusId = form.getFieldValue('actStatusId')
    const actStatusId = status ? status.id : currentActStatusId
    form.setFieldsValue({
      separate: status.code === 'APLI' ? true : form.getFieldValue('separate'),
      actStatusId,
    })
    refreshReason(actStatusId)
  }

  const openItemAvailable = () => {
    if (!form.getFieldValue('itemId')) {
      message.info(
        formatMessage({
          id: 'serviceOrder.serviceOrderParts.itemRequiredToSearchStock',
        }),
      )
    } else {
      setShowItemAvailable(true)
    }
  }

  const handleChangePriceList = id => {
    getPriceListItem(form.getFieldValue('itemId'), id)
  }

  const refreshPrice = () => {
    getPriceListItem(
      form.getFieldValue('itemId'),
      form.getFieldValue('priceListId'),
    )
  }

  const handleStatusChange = newStatusId => {
    if (
      requestItem &&
      requestItem.actStatusCode === 'APLI' &&
      requestItem.actStatusId !== newStatusId
    ) {
      form.setFieldsValue({ quantityApplied: null })
    }
  }

  return (
    <React.Fragment>
      <ItemAvailable
        show={showItemAvailable}
        itemId={form.getFieldValue('itemId')}
        toogleModalVisible={() => setShowItemAvailable(false)}
      />

      <Form layout="vertical" id="form-add-item">
        {warningMessage && (
          <Alert message={warningMessage} type="warning" className="mb-2" />
        )}
        <Row
          type="flex"
          gutter={24}
          style={{ marginTop: warningMessage ? '0' : '-10px' }}
        >
          <Col>
            <Row type="flex">
              <Col style={{ width: '530px' }}>
                <AddRequisitionItemInputItem
                  form={form}
                  canBeUpdated={canBeUpdated}
                  itemSource={itemSource}
                  setItemSource={setItemSource}
                  onChangeItem={onChangeItem}
                  loading={loadingItem}
                  ref={ref}
                  autoFocus
                />
              </Col>
              {!!materialLikeCount && (
                <Col className="ml-1" style={{ marginTop: '32px' }}>
                  <Tooltip title="Consultar itens similares e substitutos">
                    <Button
                      size="small"
                      shape="circle"
                      disabled={!canBeUpdated}
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
                id: 'materialRequest.AddRequisitionItemModalForm.code',
              })}
            >
              {getFieldDecorator('itemCode', {
                initialValue: null,
              })(<Input readOnly tabIndex={-1} disabled />)}
            </Form.Item>
          </Col>
          <Col style={{ width: '100px' }}>
            <Form.Item
              label={formatMessage({
                id: 'materialRequest.AddRequisitionItemModalForm.unity',
              })}
            >
              {getFieldDecorator('measuringUnitCode', {
                initialValue: null,
              })(<Input readOnly tabIndex={-1} disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col style={{ width: '350px' }}>
            <Row type="flex">
              <Col style={{ width: '290px' }}>
                <Form.Item
                  label={formatMessage({
                    id: 'materialRequest.AddRequisitionItemModalForm.stock',
                  })}
                >
                  {getFieldDecorator('stockLocationId', {
                    initialValue: null,
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
                      placeholder={formatMessage({
                        id:
                          'materialRequest.AddRequisitionItemModalForm.select',
                      })}
                      size="default"
                      loading={loadingStockLocation}
                      disabled={!canBeUpdated}
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
                <Tooltip title="Atualiza dados de estoque">
                  <Button
                    size="small"
                    shape="circle"
                    disabled={!canBeUpdated}
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
                id: 'materialRequest.AddRequisitionItemModalForm.stockAddress',
              })}
            >
              {getFieldDecorator('stockAddress', { initialValue: null })(
                <Input
                  size="default"
                  id="input-item-stock-address"
                  tabIndex={-1}
                  disabled
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
                      id:
                        'materialRequest.AddRequisitionItemModalForm.quantityAvailable',
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
                  disabled
                  readOnly
                />,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '210px' }}>
            <Form.Item
              label={
                <div>
                  <span>
                    {formatMessage({
                      id:
                        'materialRequest.AddRequisitionItemModalForm.quantityAvailableCalculate',
                    })}
                  </span>
                  <Tooltip
                    placement="right"
                    title={calculateDescriptionTooltip}
                  >
                    <InfoCircleFilled className="ml-2" />
                  </Tooltip>
                </div>
              }
            >
              {getFieldDecorator('quantityAvailableCalculate', {
                initialValue: null,
                rules: [{ validator: quantityAvailableCalculateValidate }],
              })(
                <Input
                  size="default"
                  id="input-item-available-calculate"
                  tabIndex={-1}
                  disabled
                  readOnly
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col style={{ width: '200px' }}>
            <Form.Item
              label={formatMessage({
                id:
                  'materialRequest.AddRequisitionItemModalForm.requestedQuantity',
              })}
            >
              {getFieldDecorator('quantityRequested', {
                initialValue: null,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                  { validator: quantityRequestedValidate },
                ],
              })(
                <Input
                  type="number"
                  disabled={!canBeUpdated}
                  min={0}
                  size="default"
                  id="input-item-required-quantity"
                />,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '200px' }}>
            <Form.Item
              label={formatMessage({
                id:
                  'materialRequest.AddRequisitionItemModalForm.appliedQuantity',
              })}
            >
              {getFieldDecorator('quantityApplied', {
                initialValue: null,
                rules: [{ validator: quantityAppliedValidate }],
              })(
                <Input
                  type="number"
                  disabled={!canBeUpdated}
                  min={0}
                  size="default"
                  id="input-item-applied-quantity"
                />,
              )}
            </Form.Item>
          </Col>

          <Col className="ml-4 mt-8" style={{ width: '150px' }}>
            {getFieldDecorator('separate', {
              valuePropName: 'checked',
              initialValue: false,
            })(
              <Checkbox
                onChange={onChangeSeparate}
                disabled={
                  form.getFieldValue('separate')
                    ? !canBeUpdated ||
                      statusSource.findIndex(x => x.code !== 'SEPA') === -1 ||
                      form.getFieldValue('applied') ||
                      !hasPermission(userPermissions, 'SepararItem')
                    : !canBeUpdated ||
                      statusSource.findIndex(x => x.code === 'SEPA') === -1 ||
                      !hasPermission(userPermissions, 'SepararItem')
                }
                id="checkbox-separate-item"
              >
                {formatMessage({
                  id: 'materialRequest.AddRequisitionItemModalForm.separated',
                })}
              </Checkbox>,
            )}
            <Tooltip placement="right" title={separateTooltip}>
              <InfoCircleFilled />
            </Tooltip>
          </Col>
          <Col className="mt-8" style={{ width: '150px' }}>
            {getFieldDecorator('applied', {
              valuePropName: 'checked',
              initialValue: false,
            })(
              <Checkbox
                id="checkbox-applied-item"
                onChange={onChangeApplied}
                disabled={
                  form.getFieldValue('applied')
                    ? !canBeUpdated ||
                      statusSource.findIndex(x => x.code !== 'APLI') === -1 ||
                      !hasPermission(userPermissions, 'AplicarItem')
                    : !canBeUpdated ||
                      statusSource.findIndex(x => x.code === 'APLI') === -1 ||
                      !hasPermission(userPermissions, 'AplicarItem')
                }
              >
                {formatMessage({
                  id: 'materialRequest.AddRequisitionItemModalForm.applied',
                })}
              </Checkbox>,
            )}
            <Tooltip placement="right" title={appliedTooltip}>
              <InfoCircleFilled />
            </Tooltip>
          </Col>
        </Row>
        <Row type="flex" gutter={24}>
          <Col style={{ width: '300px' }}>
            <Form.Item
              label={formatMessage({
                id: 'materialRequest.AddRequisitionItemModalForm.status',
              })}
            >
              {getFieldDecorator('actStatusId', {
                initialValue: null,
                getValueFromEvent: onChangeStatus,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                  { validator: statusValidate },
                ],
              })(
                <Select
                  id="select-item-status"
                  showSearch
                  placeholder={formatMessage({
                    id: 'materialRequest.AddRequisitionItemModalForm.select',
                  })}
                  size="default"
                  disabled={!canUpdateStatus}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={e => handleStatusChange(e)}
                >
                  {statusSource.map(record => (
                    <Option value={record.id}>{record.description}</Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col style={{ width: '300px' }}>
            <Form.Item
              label={formatMessage({
                id: 'materialRequest.AddRequisitionItemModalForm.statusReason',
              })}
            >
              {getFieldDecorator('actReasonId', {
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
                  id="select-item-reason"
                  showSearch
                  placeholder={formatMessage({
                    id: 'materialRequest.AddRequisitionItemModalForm.select',
                  })}
                  size="default"
                  loading={loadingReason}
                  disabled={!canUpdateStatus}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {reasonSource.map(record => (
                    <Option value={record.id}>{record.description}</Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={24} style={{ marginTop: '-5px' }}>
          <Col style={{ width: '230px' }}>
            <AddRequisitionItemInputDocument
              form={form}
              canBeUpdated={canBeUpdated}
              onChangeDocumentOrigin={onChangeDocumentOrigin}
              documentOriginSource={documentOriginSource}
              setDocumentOriginSource={setDocumentOriginSource}
              statusSource={statusSource}
              requesterId={requesterId}
              period={period}
              isRequisicaoOficina={isRequisicaoOficina}
            />
          </Col>
          <Col style={{ width: '400px' }}>
            <Form.Item
              label={formatMessage({
                id: 'materialRequest.AddRequisitionItemModalForm.titularName',
              })}
            >
              {getFieldDecorator('titularName', { initialValue: null })(
                <Input
                  size="default"
                  tabIndex={-1}
                  disabled={!canBeUpdated}
                  readOnly
                  id="input-titular-name"
                />,
              )}
            </Form.Item>
          </Col>
          <div
            style={{
              display: form.getFieldValue('quantityReserved')
                ? 'block'
                : 'none',
            }}
          >
            <Col style={{ width: '150px' }}>
              <Form.Item
                label={
                  <div>
                    <span>
                      {formatMessage({
                        id:
                          'materialRequest.AddRequisitionItemModalForm.quantityReserved',
                      })}
                    </span>
                    <Tooltip
                      placement="right"
                      title={reserveDescriptionTooltip}
                    >
                      <InfoCircleFilled className="ml-2" />
                    </Tooltip>
                  </div>
                }
              >
                {getFieldDecorator('quantityReserved', { initialValue: 0 })(
                  <Input
                    size="default"
                    id="input-item-quantity-reserved"
                    tabIndex={-1}
                    disabled={!canBeUpdated}
                    readOnly
                  />,
                )}
              </Form.Item>
            </Col>
          </div>
          <div
            style={{
              display:
                form.getFieldValue('quantityReserved') &&
                form.getFieldValue('quantityReservedUsedTotal')
                  ? 'block'
                  : 'none',
            }}
          >
            <Col style={{ width: '160px' }}>
              <Form.Item
                label={
                  <div>
                    <span>
                      {formatMessage({
                        id:
                          'materialRequest.AddRequisitionItemModalForm.quantityReservedUsed',
                      })}
                    </span>
                    <Tooltip
                      placement="right"
                      title={reserveUsedDescriptionTooltip}
                    >
                      <InfoCircleFilled className="ml-2" />
                    </Tooltip>
                  </div>
                }
              >
                {getFieldDecorator('quantityReservedUsedTotal', {
                  initialValue: 0,
                })(
                  <Input
                    size="default"
                    id="input-item-quantity-reserved"
                    tabIndex={-1}
                    disabled={!canBeUpdated}
                    readOnly
                  />,
                )}
              </Form.Item>
            </Col>
          </div>
          <div style={{ display: 'none' }}>
            {getFieldDecorator('quantityReservedUsed', { initialValue: 0 })(
              <Input
                size="default"
                id="input-item-quantity-reserved"
                tabIndex={-1}
                disabled={!canBeUpdated}
                readOnly
              />,
            )}
          </div>
        </Row>
        <Row type="flex">
          <Col style={{ width: '300px' }}>
            <Form.Item label="Lista de preços">
              {getFieldDecorator('priceListId', {
                initialValue: null,
              })(
                <Select
                  id="select-item-status"
                  showSearch
                  placeholder={formatMessage({
                    id: 'materialRequest.AddRequisitionItemModalForm.select',
                  })}
                  size="default"
                  disabled={!canBeUpdated}
                  onChange={handleChangePriceList}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {priceLists.map(record => (
                    <Option value={record.priceListId}>
                      {record.priceListDescription}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col className="ml-1" style={{ marginTop: '32px' }}>
            <Tooltip title="Atualizar preço">
              <Button
                size="small"
                shape="circle"
                disabled={!canBeUpdated}
                onClick={() => refreshPrice()}
              >
                <i className="fa fa-repeat" style={{ color: 'gray' }} />
              </Button>
            </Tooltip>
          </Col>
          <Col className="ml-8" style={{ width: '200px' }}>
            <Spin spinning={loadingPriceListItem}>
              <Form.Item
                label={formatMessage({
                  id: 'serviceOrder.modals.newItem.unitaryValue',
                })}
              >
                {getFieldDecorator('unitValue', {
                  initialValue: null,
                })(
                  <NumberFormat
                    maxLength={15}
                    className="ant-input"
                    decimalScale={2}
                    allowNegative={false}
                    thousandSeparator="."
                    decimalSeparator=","
                    fixedDecimalScale
                    disabled
                  />,
                )}
              </Form.Item>
            </Spin>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  )
})

AddRequisitionItemModalForm.propTypes = {
  form: PropTypes.object,
  onChangeItem: PropTypes.func,
  itemSource: PropTypes.array,
  setItemSource: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  stockLocationSource: PropTypes.array,
  loadingStockLocation: PropTypes.bool,
  onChangeStockLocation: PropTypes.func,
  onChangeDocumentOrigin: PropTypes.func,
  documentOriginSource: PropTypes.array,
  setDocumentOriginSource: PropTypes.func,
  statusSource: PropTypes.array,
  reasonSource: PropTypes.array,
  onChangeStatus: PropTypes.func,
  visible: PropTypes.bool,
  refreshForm: PropTypes.func,
  refreshReason: PropTypes.func,
  loadingReason: PropTypes.bool,
  refreshStock: PropTypes.func,
  openSimilarItem: PropTypes.func,
  materialLikeCount: PropTypes.number,
  loadingItem: PropTypes.bool,
  canUpdateStatus: PropTypes.bool,
  warningMessage: PropTypes.string,
  requestNewItem: PropTypes.any,
  requesterId: PropTypes.int,
  userPermissions: PropTypes.array,
  getPriceListItem: PropTypes.func,
  priceLists: PropTypes.array,
  loadingPriceListItem: PropTypes.bool,
  period: PropTypes.any,
  isRequisicaoOficina: PropTypes.any,
}

export default AddRequisitionItemModalForm
