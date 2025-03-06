import { itemBudgetStatus } from '@pages/Services/enums'
import { getLocaleCurrency } from '@utils'
import { Col, Form, InputNumber, Row, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

const { Option } = Select

export default function BudgetBlockValues({ total, setTotal }) {
  const { budgetData } = useNewServiceOrderContext()

  const [discountValue, setDiscountValue] = useState(0)
  const [discountPercentage, setDiscountPercentage] = useState(0)

  useEffect(() => {
    if (budgetData.values) {
      const sumValues = budgetData.values.reduce(
        (accumulator, { total }) => accumulator + total,
        0,
      )
      setTotal(sumValues)
    }
  }, [])

  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      width: '25%',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      width: '25%',
      render: value =>
        formatNumber(value, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Desconto',
      dataIndex: 'desconto',
      width: '25%',
      render: value =>
        formatNumber(value, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      width: '25%',
      render: value =>
        formatNumber(value, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
  ]

  return (
    <div className="mb-40">
      <Form layout="vertical">
        <Col span={6}>
          <Form.Item label="Status">
            <Select defaultValue={budgetData?.status} disabled>
              {itemBudgetStatus.map(s => (
                <Option value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Form>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={budgetData.values || []}
        pagination={false}
        footer={() => (
          <Row className="w-full" type="flex">
            <Col style={{ width: '25%' }}>
              <b>Total</b>
            </Col>
            <Col style={{ width: '25%' }}>
              <b>
                {formatNumber(budgetData?.totalValue || 0, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
              </b>
            </Col>
            <Col style={{ width: '25%' }}>
              <b>
                {formatNumber(budgetData?.totalDiscount || 0, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
              </b>
            </Col>
            <Col style={{ width: '25%' }}>
              <b>
                {formatNumber(budgetData?.total || 0, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
              </b>
            </Col>
          </Row>
        )}
      />

      <div className="float-right my-4">
        <Row type="flex" gutter={32} className="my-2">
          <Col>Descontos</Col>
          <Col className="flex ml-24">
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
              {formatNumber(total, {
                style: 'currency',
                currency: getLocaleCurrency(),
              })}
            </h2>
          </Col>
        </Row>
      </div>
    </div>
  )
}
