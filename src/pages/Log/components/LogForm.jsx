import { Tooltip, Col, DatePicker, Form, Row, Select, Button } from 'antd'
import React from 'react'
import { useLogContext } from '../context/LogContext'

const { Option } = Select 

export default function LogForm() {

  const { getOwners, startSearch, statuses, statusRender, owners, transactions, period, setPeriod, statusId, setStatusId, ownerId, setOwnerId, transactionId, setTransactionId } = useLogContext()
  
  const getLabel = () => {
    return (
      <span>
        Empresa 
        <Tooltip title="Atualizar empresas">
          <i onClick={() => getOwners} className="ml-2 cursor-pointer fa fa-repeat" style={{ color: 'gray' }} />
        </Tooltip>
      </span>
    )
  }
  return (
    <Form layout="vertical">
      <Row type="flex" gutter={12} className="mt-2 mb-4">
        <Col span={6}>
          <Form.Item label={getLabel()} className="mb-0">
            <Select
              showSearch
              className="w-full"
              size="default"
              allowClear
              value={ownerId}
              onChange={(value) => setOwnerId(value)}
              optionLabelProp="label"
              optionFilterProp="children"
              filterOption={(input, option) => {
                let checkFilter = -1
                try {
                  checkFilter = option.props.label
                    .toLowerCase()
                    .indexOf(input.toLowerCase())
                } catch {
                  checkFilter = -1
                }
                return checkFilter >= 0
              }}
            >
              {owners.map((d) => (
                <Option 
                  label={d.nome} 
                  value={d.empresaId}
                >
                  {d.nome}
                </Option>
              ))}
            </Select>              
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Transação" className="mb-0">
            <Select
              showSearch
              className="w-full"
              size="default"
              allowClear
              value={transactionId}
              onChange={(value) => setTransactionId(value)}
              optionLabelProp="label"
              optionFilterProp="children"
              filterOption={(input, option) => {
                let checkFilter = -1
                try {
                  checkFilter = option.props.label
                    .toLowerCase()
                    .indexOf(input.toLowerCase())
                } catch {
                  checkFilter = -1
                }
                return checkFilter >= 0
              }}
            >
              {transactions.map((d) => (
                <Option 
                  label={d.descricao} 
                  value={d.id}
                >
                  {d.descricao}
                </Option>
              ))}
            </Select>              
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label="Status" className="mb-0">
            <Select
              showSearch
              className="w-full"
              size="default"
              allowClear
              value={statusId}
              onChange={(value) => setStatusId(value)}
              optionFilterProp="children"
              filterOption={(input, option) => {
                let checkFilter = -1
                try {
                  checkFilter = option.props.label
                    .toLowerCase()
                    .indexOf(input.toLowerCase())
                } catch {
                  checkFilter = -1
                }
                return checkFilter >= 0
              }}
            >
              {statuses.map((d) => (
                <Option 
                  label={d.description} 
                  value={d.id}
                >
                  {statusRender(d.id)}
                </Option>
              ))}
            </Select>              
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label="Período" name="periodo" className="mb-0">
            <DatePicker.RangePicker
              format="DD/MM/YYYY"
              value={period}
              onChange={(value) => setPeriod(value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={2} className="ml-auto">
          <Button style={{ marginTop: '29px' }} type="primary" onClick={() => startSearch()}>
            Processar
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
