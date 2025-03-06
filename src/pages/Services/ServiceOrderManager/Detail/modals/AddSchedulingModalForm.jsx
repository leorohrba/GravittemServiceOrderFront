import { schedulingStatus } from '@pages/Services/enums'
import { getLocaleDateFormat } from '@utils'
import { Col, DatePicker, Form, Input, Row, Select } from 'antd'
import React, { useState } from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import AddSchedulingModalTable from './AddSchedulingModalTable'

const { Option } = Select

export default function AddShedulingModalForm({ form }) {
  const {
    services,
    reasons,
    factory,
    technical,
    cancelReason,
  } = useNewServiceOrderContext()
  const [selectedStatus, setSelectedStatus] = useState()

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Serviço" name="servico">
            <Select>
              {services.map(s => (
                <Option value={s.id}>{s.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Status" name="status">
            <Select onChange={e => setSelectedStatus(e)}>
              {schedulingStatus.map(s => (
                <Option value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Motivo" name="motivo">
            <Select>
              {reasons.map(s => (
                <Option value={s.id}>{s.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {selectedStatus && selectedStatus !== 1 && (
        <Form.Item label="Observação" name="observacao">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} />
        </Form.Item>
      )}
      {selectedStatus === 3 && (
        <React.Fragment>
          <Row type="flex" gutter={16}>
            <Col span={8}>
              <Form.Item label="Oficina" name="oficina">
                <Select>
                  {factory.map(s => (
                    <Option value={s.id}>{s.descricao}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Técnico" name="tecnico">
                <Select>
                  {technical.map(s => (
                    <Option value={s.id}>{s.descricao}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Recebimento em oficina"
                name="recebimentoOficina"
              >
                <DatePicker
                  format={getLocaleDateFormat()}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" gutter={16}>
            <Col span={8}>
              <Form.Item label="Previsão de entrega" name="previsaoEntrega">
                <DatePicker
                  format={getLocaleDateFormat()}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Condições de produto">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} />
          </Form.Item>
        </React.Fragment>
      )}
      {selectedStatus === 6 && (
        <Row type="flex" gutter={16}>
          <Col span={8}>
            <Form.Item label="Motivo do cancelamento" name="motivoCancelamento">
              <Select>
                {cancelReason.map(s => (
                  <Option value={s.id}>{s.descricao}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}
      {selectedStatus === 2 && <AddSchedulingModalTable />}
    </Form>
  )
}
