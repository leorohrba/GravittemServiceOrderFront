import { soStatus } from '@pages/Services/enums'
import { getLocaleDateFormat } from '@utils'
import { Col, DatePicker, Form, Input, Row, Select } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

const { Option } = Select

export default function ServiceOrderBlock() {
  const {
    form,
    classifications,
    priorities,
    soTypes,
  } = useNewServiceOrderContext()

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item
            label="Ordem de serviço"
            name="OS"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Classificação"
            name="classificacao"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Select>
              {classifications.map(c => (
                <Option value={c.id}>{c.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Prioridade"
            name="prioridade"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Select>
              {priorities.map(p => (
                <Option value={p.id}>{p.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Status"
            name="status"
            initialValue={1}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Select>
              {soStatus.map(s => (
                <Option value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item label="Abertura" name="abertura">
            <DatePicker
              format={getLocaleDateFormat()}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Idade" name="idade">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Canal de atendimento" name="canalAtendimento">
            <Select />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Tipo de serviço" name="tipoServico">
            <Select />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item label="Código externo" name="codigoExterno">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Tipo de ordem de serviço"
            name="tipoOS"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Select>
              {soTypes.map(s => (
                <Option value={s.id}>{s.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
