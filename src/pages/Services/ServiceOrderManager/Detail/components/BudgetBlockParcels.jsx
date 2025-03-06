import { getLocaleCurrency } from '@utils'
import {
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Select,
  Table,
} from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

const { Option } = Select

export default function BudgetBlockParcels({ total }) {
  const { budgetData, setBudgetData } = useNewServiceOrderContext()
  const [form] = Form.useForm()

  const [parcelsData, setParcelsData] = useState(budgetData?.parcels || [])

  function generateParcels() {
    form.validateFields().then(values => {
      const newParcels = []
      const { vencimento } = values
      for (let index = 1; index <= values.parcelas; index++) {
        newParcels.push({
          parcela: `${index}/${values.parcelas}`,
          vencimento,
          formaRecebimento: values.formaRecebimento.label,
          valor: total / values.parcelas,
        })
        moment(vencimento).add(1, 'month')
      }
      budgetData.parcels = newParcels
      setBudgetData(budgetData)
      setParcelsData(newParcels)
    })
  }

  const columns = [
    {
      title: 'Parcela',
      dataIndex: 'parcela',
      width: '25%',
    },
    {
      title: 'Vencimento',
      dataIndex: 'vencimento',
      width: '25%',
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Forma de recebimento',
      dataIndex: 'formaRecebimento',
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
  ]

  return (
    <React.Fragment>
      <Form layout="vertical" form={form}>
        <Row type="flex" gutter={16}>
          <Col span={6}>
            <Form.Item label="Forma de recebimento" name="formaRecebimento">
              <Select labelInValue>
                <Option value={1}>Cartão de crédito</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Número de parcelas" name="parcelas">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Dia do 1º vencimento" name="vencimento">
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button type="primary" className="mt-8" onClick={generateParcels}>
              Gerar parcelas
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={parcelsData}
        pagination={false}
        footer={() => (
          <Row className="w-full" type="flex">
            <Col style={{ width: '75%' }}>
              <b>Total</b>
            </Col>
            <Col style={{ width: '25%' }}>
              <b>
                {formatNumber(total, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
              </b>
            </Col>
          </Row>
        )}
      />
    </React.Fragment>
  )
}
