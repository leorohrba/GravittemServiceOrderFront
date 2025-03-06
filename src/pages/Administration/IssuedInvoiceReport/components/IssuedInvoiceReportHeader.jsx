import NewSimpleSearch from '@components/NewSimpleSearch'
import { PersonAutocomplete } from '@components/PersonAutocomplete'
import { dateType } from '@pages/InvoiceManagement/enums'
import { getLocaleCurrency, hasPermission } from '@utils'
import { formatDateInput } from '@utils/components'
import { usePermissionContext } from '@utils/context/Permission'
import { Button, Col, DatePicker, Form, Row, Select, Spin } from 'antd'
import React, { useRef } from 'react'
import { formatMessage } from 'umi-plugin-locale'
import { formatNumber } from 'umi-plugin-react/locale'
import { useIssuedInvoiceReportContext } from '../context/IssuedInvoiceReportContext'
import InvoiceReportExport from './InvoiceReportExport'

const { RangePicker } = DatePicker
const { Option } = Select

export default function IssuedInvoiceReportHeader() {
  const {
    form,
    getReport,
    otherFilterOptions,
    loadingFilterOptions,
    filterTags,
    setFilterTags,
    periodType,
    selectedPeriod,
    setPeriodType,
    setSelectedPeriod,
    personTags,
    setPersonTags,
    reportData,
  } = useIssuedInvoiceReportContext()
  const { permissions } = usePermissionContext()
  const hasExportPermission = hasPermission(permissions, 'ExportarParaExcel')
  const dateRef = useRef(null)

  const totalValue = () => {
    const totalValue = reportData.itens.reduce(
      (accumulator, { valor }) => accumulator + parseFloat(valor),
      0,
    )
    return totalValue.toFixed(2)
  }

  const totalPaidValue = () => {
    const totalPaidValue = reportData.itens.reduce(
      (accumulator, { valorPago }) => accumulator + parseFloat(valorPago),
      0,
    )
    return totalPaidValue.toFixed(2)
  }

  const totalDepositValue = () => {
    const totalDepositValue = reportData.itens.reduce(
      (accumulator, { valorDepositado }) =>
        accumulator + parseFloat(valorDepositado),
      0,
    )
    return totalDepositValue.toFixed(2)
  }

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={24}>
        <Col span={6}>
          <Form.Item label="Emitente">
            <PersonAutocomplete
              editData={{}}
              multiSelect
              {...{ setPersonTags, personTags }}
              hideLabel
              type="empresas"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Período"
            required
            onChange={e =>
              formatDateInput(e.target.value, form, 'periodo', dateRef, true)
            }
          >
            <div
              style={{
                display: 'flex',
                height: '33px',
              }}
            >
              <Form.Item
                noStyle
                name="periodoTipoData"
                initialValue={periodType}
              >
                <Select
                  style={{ width: '40%' }}
                  onChange={e => setPeriodType(e)}
                >
                  {dateType.map(p => (
                    <Option value={p.id} key={p.key}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                name="periodo"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ]}
                initialValue={selectedPeriod}
              >
                <RangePicker
                  format="DD/MM/YYYY"
                  style={{ width: '60%' }}
                  onChange={e => setSelectedPeriod(e)}
                  ref={dateRef}
                />
              </Form.Item>
            </div>
          </Form.Item>
        </Col>
        <Col span={10}>
          <Spin spinning={loadingFilterOptions}>
            <Form.Item label="Outros filtros">
              <Form.Item noStyle name="filtroOpcao">
                <NewSimpleSearch
                  searchOptions={otherFilterOptions.filter(
                    o => o.type !== 'rangeDate' && o.value !== 'ContaCorrente',
                  )}
                  setTags={setFilterTags}
                  tags={filterTags}
                  hideSaveSearch
                  getSelectLabel
                  selectOptionsWidth={240}
                  hideSearchButton
                />
              </Form.Item>
            </Form.Item>
          </Spin>
        </Col>
      </Row>
      <Row type="flex" className="mb-3">
        <Button type="primary" onClick={getReport}>
          Gerar relatório
        </Button>
        {reportData && (
          <div className="flex sm:ml-auto font-bold text-left">
            <div
              className="mr-3"
              style={{ position: 'relative', bottom: '5px' }}
            >
              <p className="mb-0">
                Total de registros: {reportData.itens.length}
              </p>
              <p className="mb-0">
                Valor total:{' '}
                {formatNumber(totalValue() || 0, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
              </p>
            </div>
            <div style={{ position: 'relative', bottom: '5px' }}>
              <p className="mb-0">
                Valor total pago:{' '}
                {formatNumber(totalPaidValue() || 0, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
              </p>
              <p className="mb-0">
                Valor total depositado:{' '}
                {formatNumber(totalDepositValue() || 0, {
                  style: 'currency',
                  currency: getLocaleCurrency(),
                })}
              </p>
            </div>
          </div>
        )}
        {hasExportPermission && <InvoiceReportExport />}
      </Row>
    </Form>
  )
}
