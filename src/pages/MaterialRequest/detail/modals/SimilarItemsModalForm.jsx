import { Form } from '@ant-design/compatible'
import { getLocaleCurrency } from '@utils'
import { Col, Input, Checkbox, Row, Select } from 'antd'
import { PropTypes } from 'prop-types'
import React from 'react'
import { formatMessage, formatNumber } from 'umi-plugin-react/locale'

const { Option } = Select

export const SimilarItemsModalForm = ({
  materialLike,
  priceList,
  priceListId,
  onChangePriceList,
  onChangeMaterialStock,
  materialStock,
  showItem,
  item,
}) => {

  const radioStyle = {
    marginLeft: '0.5rem',
    fontWeight: 'normal',
  }

  return (
    <Form layout="vertical">
      {showItem && item && (
        <Row gutter={12} type="flex" style={{ marginTop: '-20px' }}>
          <Col style={{ width: '300px' }}>
            <Form.Item label="Item">
              <Input value={item.description} tabIndex={-1} readOnly />
            </Form.Item>
          </Col>

          <Col style={{ width: '150px' }}>
            <Form.Item label="Código">
              <Input value={item.code} tabIndex={-1} readOnly />
            </Form.Item>
          </Col>

          <Col style={{ width: '120px' }}>
            <Form.Item label="Preço">
              <Input
                value={formatNumber(item.unitValue, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
                tabIndex={-1}
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item
        label={formatMessage({
          id: 'materialRequest.SimilarItems.priceList',
        })}
        className="mb-3"
      >
        <Select
          optionFilterProp="children"
          id="select-price-list"
          value={priceListId}
          onChange={value => onChangePriceList(value)}
        >
          {priceList.map(s => (
            <Option value={s.priceListId} key={s.priceListId}>
              {s.priceListDescription}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {materialLike.map(d => (
        <div
          className="mt-4 pt-2 pb-2"
          style={{
            border: '1px solid #E0E0E0',
          }}
        >
          {!d.isParent && (
            <React.Fragment>
              <i
                className={`fa fa-${
                  d.isReplacement ? 'exchange' : 'link'
                } mr-3 ml-2`}
                style={{
                  color: d.isReplacement ? '#F57C00' : '#1976D2',
                }}
              />
              <small
                style={{
                  color: d.isReplacement ? '#F57C00' : '#1976D2',
                }}
              >
                {formatMessage({
                  id: d.isReplacement
                    ? 'materialRequest.SimilarItems.substituteItem'
                    : 'materialRequest.SimilarItems.similarItem',
                })}
              </small>
            </React.Fragment>
          )}
          <div className="ml-8 mt-2">
            <Row>
              <Col span={12}>
                <h4>{d.itemLikeName}</h4>
              </Col>
              <Col span={12}>
                <h4>
                  {formatMessage({
                    id: 'materialRequest.SimilarItems.manufacturer',
                  })}
                  :{' '}
                  <span
                    style={{
                      fontWeight: 'normal',
                    }}
                  >
                    {d.manufacturerName}
                  </span>
                </h4>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <span>{d.itemLikeCode}</span>
              </Col>
              <Col span={12}>
                <h4>
                  {formatMessage({
                    id: 'materialRequest.SimilarItems.value',
                  })}
                  :{' '}
                  <span
                    style={{
                      fontWeight: 'normal',
                    }}
                  >
                    {formatNumber(d.unitValue, {
                      style: 'currency',
                      currency: getLocaleCurrency(),
                    })}
                  </span>
                </h4>
              </Col>
            </Row>
          </div>
          {d.materialLikeAvailable.map(p => (
            <div>
              <hr />
              <Row>
                <Col span={13}>
                  <Checkbox
                    style={radioStyle}
                    onChange={(e) => onChangeMaterialStock(e.target.checked ? `${d.likeId}#${p.stockLocationId}` : null)}
                    checked={materialStock === `${d.likeId}#${p.stockLocationId}`}
                  >
                    {p.stockLocationDescription}
                  </Checkbox>
                </Col>
                <Col span={11}>
                  <span>{`${p.quantityAvailable} ${d.measuringUnitCode}`}</span>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      ))}
    </Form>
  )
}

SimilarItemsModalForm.propTypes = {
  materialLike: PropTypes.array,
  priceList: PropTypes.array,
  priceListId: PropTypes.number,
  onChangePriceList: PropTypes.func,
  onChangeMaterialStock: PropTypes.func,
  materialStock: PropTypes.string,
  item: PropTypes.object,
  showItem: PropTypes.bool,
}
