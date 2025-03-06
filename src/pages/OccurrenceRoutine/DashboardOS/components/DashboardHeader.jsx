import React, { useEffect } from 'react'
import { DatePicker, Input, Select, Card, Row, Col, AutoComplete } from 'antd'

const { Option } = Select
const { RangePicker } = DatePicker

export default function DashboardHeader(props) {
  const {
    filterClients,
    filterTypes,
    filterServices,
    filterClassOS,
    rangeDate,
    setRangeDate,
    setFilterParams,
    filterParams,
    selectedPeriod,
    setSelectedPeriod,
    fetchData
  } = props

  useEffect(() => {
    fetchData()
  }, [rangeDate, selectedPeriod, filterParams])

  const handleSetFilterTypes = (value) => {
    setFilterParams(prev => ({
      ...prev,
      tipoOSId: value
    }))
  }

  const handleSetFilterClients = (value) => {
    setFilterParams(prev => ({
      ...prev,
      pessoaId: value
    }))
  }

  const handleSetFilterServices = (value) => {
    setFilterParams(prev => ({
      ...prev,
      servicoId: value
    }))
  }

  const handleSetFilterClassOS = (value) => {
    setFilterParams(prev => ({
      ...prev,
      classificacaoOsId: value
    }))
  }

  const handleServiceOrderIdChange = (e) => {
    setFilterParams(prev => ({
      ...prev,
      serviceOrderId: e.target.value
    }))
  }

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value)
    setFilterParams(prev => ({
      ...prev,
      selectedPeriod: value
    }))
  }

  const handleRangeDateChange = (dates) => {
    setRangeDate(dates)
    setFilterParams(prev => ({
      ...prev,
      rangeDate: dates
    }))
  }

  return (
    <div className="mb-2">
      <Card bodyStyle={{ paddingLeft: '20px' }} size="small">
        <Row type="flex" gutter={24} align="middle">
          <Col>
            <h4>Tipo de ordem de serviço</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '30vh' }}
              onChange={handleSetFilterTypes}
              value={filterParams?.tipoOSId || []}
              maxTagCount="responsive"
              onSelect={(value, option) => {
                if (value === 'all') {
                  const allValues = filterTypes.map(type => type.value);
                  handleSetFilterTypes(allValues);
                }
              }}
              onDeselect={(value) => {
                if (value === 'all') {
                  handleSetFilterTypes([]);
                }
              }}
            >
              <Option key="all" value="all">
                Selecionar todos
              </Option>
              {filterTypes?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Row>
              <Col>
                <h4>Período</h4>
              </Col>
            </Row>
            <Row type="flex" gutter={12}>
              <Col>
                <Select
                  style={{ width: '100%' }}
                  defaultValue="PeriodoCriacaoOs"
                  onChange={handlePeriodChange}
                >
                  <Option key="1" value="PeriodoCriacaoOs">
                    Data de criação
                  </Option>
                  <Option key="2" value="periodoApontamento">
                    Data de apontamento
                  </Option>
                  <Option key="3" value="PeriodoLiquidaOs">
                    Data de liquidação
                  </Option>
                  <Option key="4" value="PeriodoCancelaOs">
                    Data de cancelamento
                  </Option>
                </Select>
              </Col>
              <Col>
                <RangePicker
                  allowClear={false}
                  format="DD/MM/YYYY"
                  onChange={value => handleRangeDateChange(value)}
                  value={rangeDate}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <h4>Cliente</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '30vh' }}
              onChange={handleSetFilterClients}
            >
              {filterClients?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <h4>Serviço</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '30vh' }}
              onChange={handleSetFilterServices}
            >
              {filterServices?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <h4>Classificação OS</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '30vh' }}
              onChange={handleSetFilterClassOS}
            >
              {filterClassOS?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <h4>Ordem de serviço</h4>
            <AutoComplete
              onChange={handleServiceOrderIdChange}
              style={{ width: '30vh' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}
