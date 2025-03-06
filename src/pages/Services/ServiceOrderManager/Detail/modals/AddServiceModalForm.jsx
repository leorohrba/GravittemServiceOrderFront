import { servicesStatus } from '@pages/Services/enums'
import { getLocaleCurrency } from '@utils'
import { Col, Form, Input, InputNumber, Row, Select } from 'antd'
import React, { useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

const { Option } = Select

export default function AddServiceModalForm({ form, selectedService }) {
  const { services } = useNewServiceOrderContext()

  const [totalPrevisto, setTotalPrevisto] = useState(0)
  const [totalAprovado, setTotalAprovado] = useState(0)
  const [totalDescontos, setTotalDescontos] = useState(0)
  const [total, setTotal] = useState(0)

  const selectAfter = (
    <Select defaultValue="unid">
      <Option value="unid">unid</Option>
    </Select>
  )

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={13}>
          <Form.Item
            label="Serviço"
            name="servico"
            initialValue={selectedService || ''}
          >
            <Select suffixIcon={<i className="fa fa-search" />} showSearch>
              {services.map(s => (
                <Option value={s.id}>{`${s.codigo} ${s.servico}`}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Quantidade" name="quantidade">
            <Input addonAfter={selectAfter} type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Lista de preço" name="listaPreco">
            <Select suffixIcon={<i className="fa fa-search" />} showSearch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Valor unitário" name="valorUnitario">
            <InputNumber
              style={{ width: '100%' }}
              decimalSeparator=","
              precision={2}
              formatter={value =>
                typeof value === typeof ''
                  ? !value?.includes('R$')
                    ? `R$ ${value}`
                    : ''
                  : ''
              }
              parser={value => value.replace('R$ ', '')}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Valor do desconto" name="desconto">
            <InputNumber
              style={{ width: '100%' }}
              decimalSeparator=","
              precision={2}
              formatter={value =>
                typeof value === typeof ''
                  ? !value?.includes('R$')
                    ? `R$ ${value}`
                    : ''
                  : ''
              }
              parser={value => value.replace('R$ ', '')}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Porcentagem do desconto" name="porcDesconto">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={100}
              decimalSeparator=","
              formatter={value => value && `${value}%`}
              parser={value => value.replace('%', '')}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Status" name="status">
            <Select>
              {servicesStatus.map(s => (
                <Option value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <div className="float-right my-4">
        <Row type="flex" gutter={32}>
          <Col>Total previsto</Col>
          <Col className="ml-auto">
            {formatNumber(totalPrevisto, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </Col>
        </Row>
        <Row type="flex" gutter={32}>
          <Col>Total aprovado</Col>
          <Col className="ml-auto">
            {formatNumber(totalAprovado, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </Col>
        </Row>
        <Row type="flex" gutter={32}>
          <Col>Total de descontos</Col>
          <Col className="ml-auto">
            -
            {formatNumber(totalDescontos, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
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
    </Form>
  )
}
