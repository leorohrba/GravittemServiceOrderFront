import { getLocaleCurrency } from '@utils'
import { Col, InputNumber, Row } from 'antd'
import React, { useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

export default function ItemsBlockTableFooter() {
  const { itemsResume, setItemsResume } = useNewServiceOrderContext()

  const [discountValue, setDiscountValue] = useState(0)
  const [discountPercentage, setDiscountPercentage] = useState(0)

  return (
    <div className="md:w-1/2 ml-auto my-4">
      <Row type="flex" gutter={32}>
        <Col>Total previsto</Col>
        <Col className="ml-auto">
          {formatNumber(itemsResume.totalPrevisto, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </Col>
      </Row>
      <Row type="flex" gutter={32}>
        <Col>Total de descontos unitários</Col>
        <Col className="ml-auto">
          -
          {formatNumber(itemsResume.totalDescUnitario, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </Col>
      </Row>
      <Row type="flex" gutter={32}>
        <Col>Total parcial</Col>
        <Col className="font-bold ml-auto">
          {formatNumber(itemsResume.totalParcial, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </Col>
      </Row>
      <Row type="flex" gutter={32} className="my-2">
        <Col>Novos descontos</Col>
        <Col className="flex ml-auto">
          <InputNumber
            className="mr-4"
            defaultValue={discountValue}
            style={{ width: '70%' }}
            decimalSeparator=","
            formatter={value =>
              typeof value === typeof ''
                ? !value?.includes('R$')
                  ? `R$ ${value}`
                  : ''
                : ''
            }
            parser={value => value.replace('R$ ', '')}
          />
          <InputNumber
            style={{ width: '70%' }}
            defaultValue={discountPercentage}
            min={0}
            max={100}
            decimalSeparator=","
            formatter={value => value && `${value}%`}
            parser={value => value.replace('%', '')}
          />
        </Col>
      </Row>
      <Row type="flex" gutter={32}>
        <Col className="font-bold">
          <h2>Total</h2>
        </Col>
        <Col className="font-bold ml-auto">
          <h2>
            {formatNumber(itemsResume.total, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </h2>
        </Col>
      </Row>
    </div>
  )
}
