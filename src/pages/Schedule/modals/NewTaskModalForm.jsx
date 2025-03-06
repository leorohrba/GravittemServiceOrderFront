import { scheduleStatus } from '@pages/Schedule/enums'
import { Col, DatePicker, Form, Input, Row, Select, TimePicker } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-locale'

const { Option } = Select

export default function NewTaskModalForm({ form, taskType }) {
  const [selectedType, setSelectedType] = useState()
  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        {taskType === 'compromisso' && (
          <Col span={12}>
            <Form.Item
              label="Tipo"
              name="tipo"
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ]}
            >
              <Select onChange={e => setSelectedType(e)}>
                <Option value={1}>Hora marcada</Option>
                <Option value={2}>Período</Option>
              </Select>
            </Form.Item>
          </Col>
        )}
        <Col span={12}>
          <Form.Item
            label="Data"
            name="data"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      {selectedType && (
        <Row type="flex" gutter={16}>
          {selectedType === 1 ? (
            <Col span={12}>
              <Form.Item
                label="Horário"
                name="horario"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          ) : (
            <Col span={12}>
              <Form.Item
                label="Turno"
                name="turno"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ]}
              >
                <Select />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item
              label="Duração"
              name="duracao"
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item
        label="Assunto"
        name="assunto"
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
      <Form.Item label="Descrição" name="descricao">
        <Input />
      </Form.Item>
      <Row type="flex">
        <Col span={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
            initialValue={1}
          >
            <Select>
              {scheduleStatus.map(s => (
                <Option value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
