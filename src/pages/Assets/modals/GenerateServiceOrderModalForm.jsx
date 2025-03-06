import { Col, Form, Input, Row, Select } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function GenerateServiceOrderModalForm({ form }) {
  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Ofício" name="oficio">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Defeito reclamado"
            name="defeitoReclamado"
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
              <Option value={1}>Opção 1</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Observação da reclamação" name="observacaoReclamacao">
        <Input />
      </Form.Item>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Serviço"
            name="servico"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <Select
              suffixIcon={<i className="fa fa-search fa-lg" />}
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={1}>Opção 1</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Canal de atendimento"
            name="canalAtendimento"
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
              <Option value={1}>Opção 1</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
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
              <Option value={1}>Opção 1</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
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
              <Option value={1}>Opção 1</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
