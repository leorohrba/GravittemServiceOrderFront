import { getLocaleCurrency } from '@utils'
import { Col, Form, Input, InputNumber, Row, Select } from 'antd'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

const { Option } = Select

export default function NewItemModalForm({ form }) {
  const { itemsResume, setItemsResume } = useNewServiceOrderContext()

  const selectAfter = (
    <Select defaultValue="unid">
      <Option value="unid">unid</Option>
    </Select>
  )

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={16}>
          <Form.Item label="Descrição" name="descricao">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Estoque" name="estoque">
            <Select />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Status" name="status">
            <Select />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="FCTAO" name="fctao">
            <Select>
              <Option value="F">Faltante</Option>
              <Option value="C">Consertado</Option>
              <Option value="T">Trocado</Option>
              <Option value="A">Aplicado</Option>
              <Option value="O">Orientado</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Ocorrência" name="ocorrencia">
            <Select />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Serviço" name="servico">
            <Select />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Produto" name="produto">
            <Select />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Recebimento" name="recebimento">
            <Select />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Propriedade" name="propriedade">
            <Select />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Pedido" name="pedido">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Nota fiscal" name="notaFiscal">
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Requisição" name="requisicao">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Tempo de garantia" name="tempoGarantia">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Classificação" name="classificacao">
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Lista de preço" name="listaPreço">
            <Select />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Valor unitário" name="valorUnitario">
            <InputNumber
              defaultValue={0}
              style={{ width: '100%' }}
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
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Quantidade" name="quantidade">
            <Input addonAfter={selectAfter} />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Valor do desconto no item" name="valorDesconto">
            <InputNumber
              defaultValue={0}
              style={{ width: '100%' }}
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
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Porcentagem do desconto no item"
            name="porcentagemDesconto"
          >
            <InputNumber
              style={{ width: '100%' }}
              defaultValue={0}
              min={0}
              max={100}
              decimalSeparator=","
              formatter={value => value && `${value}%`}
              parser={value => value.replace('%', '')}
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="float-right my-4 w-3/6">
        <Row type="flex">
          <Col>Total previsto</Col>
          <Col className="ml-auto">
            {formatNumber(itemsResume.totalPrevisto, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </Col>
        </Row>
        <Row type="flex">
          <Col>Total de descontos</Col>
          <Col className="ml-auto">
            -
            {formatNumber(itemsResume.totalDescUnitario, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </Col>
        </Row>
        <Row type="flex">
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
    </Form>
  )
}
