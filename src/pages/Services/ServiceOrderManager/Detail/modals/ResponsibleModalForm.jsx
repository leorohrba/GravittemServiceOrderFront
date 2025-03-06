import { Col, Form, Row, Select } from 'antd'
import React, { useState } from 'react'

const { Option } = Select

export default function ResponsibleModalForm() {
  const [selectedMethod, setSelectedMethod] = useState(1)

  const selectOptions = [
    {
      id: 1,
      name: 'Região de atendimento',
    },
    {
      id: 2,
      name: 'Distância',
    },
    {
      id: 3,
      name: 'Manual',
    },
  ]
  const methodOptions = [
    {
      id: 1,
      name: 'Nome',
    },
    {
      id: 2,
      name: 'CEP',
    },
    {
      id: 3,
      name: 'Município',
    },
  ]
  return (
    <Form layout="vertical">
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Método">
            <Select
              onChange={e => setSelectedMethod(e)}
              defaultValue={selectedMethod}
            >
              {selectOptions.map(s => (
                <Option value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {selectedMethod === 3 && (
          <React.Fragment>
            <Col span={8}>
              <Form.Item label="Critério">
                <Select>
                  {methodOptions.map(m => (
                    <Option value={m.id}>{m.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Responsável">
                <Select showSearch suffixIcon={<i className="fa fa-search" />}>
                  <Option value={1}>Teste</Option>
                </Select>
              </Form.Item>
            </Col>
          </React.Fragment>
        )}
      </Row>
    </Form>
  )
}
