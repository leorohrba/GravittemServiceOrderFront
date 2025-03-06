import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import { apiMaterialRequest } from '@services/api'
import { customSort, getLocaleCurrency, handleAuthError } from '@utils'
import { Col, Input, InputNumber, message, Row, Select, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage, formatNumber } from 'umi-plugin-react/locale'
import { SimilarItems } from '../../../MaterialRequest/detail/modals/SimilarItems'
import ItemAvailable from '../modals/ItemAvailable'

const { Option } = Select

export default function NewItemStage1({
  form,
  onChangeOption,
  selectedOption,
  search,
  data,
  setSelectedRows,
  selectedRows,
  kit,
  catalog,
  onChangeCatalog,
  onChangeKit,
  keyTable,
  kitQuantity,
  setKitQuantity,
  nextStage,
  setLoading,
}) {
  const { getFieldDecorator } = form

  const [showItemAvailable, setShowItemAvailable] = useState(false)
  const [itemId, setItemId] = useState(null)
  const [showSimilarItem, setShowSimilarItem] = useState(false)

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  async function getItem(itemId, stockLocationId) {
    const index = selectedRows.findIndex(x => x.partId === itemId)
    if (index >= 0) {
      // eslint-disable-next-line no-param-reassign
      selectedRows[index].stockLocationId = stockLocationId
      setSelectedRows([...selectedRows])
      nextStage(1, selectedRows)
      return
    }
    setLoading(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/searchItem`,
        params: { itemId },
      })
      const { data } = response

      if (data.isOk) {
        const source = selectedRows
        if (data.items.length === 0) {
          message.error(
            formatMessage({
              id: 'serviceOrder.serviceOrderParts.itemNotFound',
            }),
          )
        }
        data.items.map(d =>
          source.push({
            partId: d.itemId,
            partCode: d.code,
            partDescription: d.description,
            measuringUnitId: d.measuringUnitId,
            measuringUnitCode: d.measuringUnitCode,
            returnRequired: d.returnRequired,
            canDecimal: d.canDecimal,
            priceListId: d.priceListId,
            priceListDescription: d.priceListDescription,
            priceListItemId: d.priceListItemId,
            unitValue: d.unitValue,
            materialLikeCount: d.materialLikeCount,
            quantityAvailable: d.quantityAvailable,
            quantity: 1,
            stockLocationId,
          }),
        )
        setLoading(false)
        setSelectedRows(source)
        nextStage(1, source)
      } else {
        setLoading(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const searchOptions = [
    { key: 1, name: 'Lista de itens' },
    { key: 2, name: 'Kit de peças' },
    { key: 3, name: 'Catálogo de produtos' },
  ]

  const columns = [
    {
      title: formatMessage({ id: 'serviceOrder.serviceOrderParts.code' }),
      dataIndex: 'partCode',
      sorter: (a, b) => customSort(a.partCode, b.partCode),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.description',
      }),
      dataIndex: 'partDescription',
      sorter: (a, b) => customSort(a.partDescription, b.partDescription),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.measuringUnit',
      }),
      dataIndex: 'measuringUnitCode',
      sorter: (a, b) => customSort(a.measuringUnitCode, b.measuringUnitCode),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.unitaryValue',
      }),
      width: 140,
      dataIndex: 'unitValue',
      sorter: (a, b) => (a.unitValue || 0) - (b.unitValue || 0),
      render: d =>
        formatNumber(d || 0, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: formatMessage({
        id: 'serviceOrder.serviceOrderParts.available',
      }),
      dataIndex: 'quantityAvailable',
      sorter: (a, b) => (a.quantityAvailable || 0) - (b.quantityAvailable || 0),
    },
    {
      title: '',
      key: 'operation',
      width: 90,
      render: (text, record) => (
        <div>
          {!!record.quantityAvailable && (
            <Tooltip title="Ver detalhes do estoque">
              <Button
                shape="circle"
                size="default"
                type="primary"
                ghost
                className="iconButton"
                onClick={() => openItemAvailable(record.partId)}
              >
                <i className="fa fa-ellipsis-h" style={{ color: 'gray' }} />
              </Button>
            </Tooltip>
          )}
          {!!record.materialLikeCount && (
            <Tooltip title="Ver itens similares">
              <Button
                shape="circle"
                size="default"
                type="primary"
                ghost
                className="iconButton ml-2"
                onClick={() => openSimilarItem(record.partId)}
              >
                <i className="fa fa-link" style={{ color: 'gray' }} />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ]

  const kitColumns = columns.map(a => {
    const newObject = {}
    Object.keys(a).forEach(propertyKey => {
      newObject[propertyKey] = a[propertyKey]
    })
    return newObject
  })

  kitColumns.splice(3, 0, {
    title: formatMessage({
      id: 'serviceOrder.serviceOrderParts.quantity',
    }),
    dataIndex: 'quantity',
    sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
  })

  const openItemAvailable = id => {
    setItemId(id)
    setShowItemAvailable(true)
  }

  const openSimilarItem = id => {
    setItemId(id)
    setShowSimilarItem(true)
  }

  const onSelectMaterialLike = (itemId, stockLocationId) => {
    getItem(itemId, stockLocationId)
  }

  return (
    <Form layout="vertical" className="mb-3">
      <SimilarItems
        itemId={itemId}
        onSelectMaterialLike={onSelectMaterialLike}
        modalVisible={showSimilarItem}
        toogleModalVisible={() => setShowSimilarItem(false)}
      />

      <ItemAvailable
        show={showItemAvailable}
        itemId={itemId}
        toogleModalVisible={() => setShowItemAvailable(false)}
      />

      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item
            label={formatMessage({
              id: 'serviceOrder.modals.newItem.searchItem',
            })}
          >
            <Select
              defaultValue={1}
              value={selectedOption}
              onChange={e => onChangeOption(e)}
            >
              {searchOptions.map(s => (
                <Option value={s.key}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {selectedOption === 1 ? (
          <Col span={10}>
            <Form.Item label="Item">
              {getFieldDecorator('searchItemsField', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ],
              })(
                <Input
                  onPressEnter={search}
                  autoFocus
                  placeholder={formatMessage({
                    id: 'serviceOrder.modals.newItem.enterCodeOrDescription',
                  })}
                />,
              )}
            </Form.Item>
          </Col>
        ) : selectedOption === 2 ? (
          <React.Fragment>
            <Col span={8}>
              <Form.Item label="Kit">
                {getFieldDecorator('searchKitField', {
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
                    autoFocus
                    onChange={onChangeKit}
                    placeholder={formatMessage({
                      id: 'serviceOrder.modals.newItem.selectKit',
                    })}
                    optionFilterProp='label'
                    showSearch
                  >
                    {kit.map(d => (
                      <Option key={d.partKitId} value={d.partKitId} label={d.description}>
                        {d.description}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Quantidade">
                <InputNumber
                  value={kitQuantity}
                  onChange={value => setKitQuantity(value)}
                  min={1}
                  style={{
                    inlineSize: 'fit-content',
                  }}
                />
                ,
              </Form.Item>
            </Col>
          </React.Fragment>
        ) : (
          <Col span={10}>
            <Form.Item label="Catálogo">
              {getFieldDecorator('searchCatalogField', {
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
                  autoFocus
                  onChange={onChangeCatalog}
                  placeholder={formatMessage({
                    id: 'serviceOrder.modals.newItem.selectCatalog',
                  })}
                  optionFilterProp='label'
                  showSearch
                >
                  {catalog.map(d => (
                    <Option key={d.productCatalogId} value={d.productCatalogId} label={d.productCatalogDescription}>
                      {d.productCatalogDescription}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        )}
        <Col>
          <Button
            type="primary"
            style={{
              top: '28px',
            }}
            onClick={search}
          >
            <i className="fa fa-search fa-lg mr-3" aria-hidden="true" />
            {formatMessage({ id: 'serviceOrder.modals.newItem.search' })}
          </Button>
        </Col>
      </Row>
      {data.length > 0 && (
        <DefaultTable
          rowKey={record => record.partId}
          columns={selectedOption === 2 ? kitColumns : columns}
          dataSource={data}
          rowSelection={rowSelection}
          key={keyTable}
        />
      )}
    </Form>
  )
}

NewItemStage1.propTypes = {
  data: PropTypes.any,
  form: PropTypes.any,
  setSelectedRows: PropTypes.func,
  selectedRows: PropTypes.array,
  search: PropTypes.any,
  selectedOption: PropTypes.any,
  onChangeOption: PropTypes.func,
  kit: PropTypes.array,
  catalog: PropTypes.array,
  onChangeKit: PropTypes.func,
  onChangeCatalog: PropTypes.func,
  keyTable: PropTypes.number,
  kitQuantity: PropTypes.number,
  setKitQuantity: PropTypes.number,
  nextStage: PropTypes.func,
  setLoading: PropTypes.func,
}
