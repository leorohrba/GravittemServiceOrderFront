/**
 * breadcrumb: Relatório de boletos emitidos geral
 */
import {
  PermissionProvider,
  usePermissionContext,
} from '@utils/context/Permission'
import { ComponentWithPermission } from '@utils/HOF'
import { Spin } from 'antd'
import moment from 'moment'
import React, { useEffect } from 'react'
import { withWrapper } from 'with-wrapper'
import IssuedInvoiceReportHeader from './components/IssuedInvoiceReportHeader'
import IssuedInvoiceReportTable from './components/IssuedInvoiceReportTable'
import {
  IssuedInvoiceReportProvider,
  useIssuedInvoiceReportContext,
} from './context/IssuedInvoiceReportContext'

function IssuedInvoiceReport() {
  const {
    reportData,
    generateReport,
    tags,
    setTags,
    setFilterTags,
    loadingData,
    setPeriodType,
    setSelectedPeriod,
    setPersonTags,
    form,
  } = useIssuedInvoiceReportContext()

  const query = new URLSearchParams(window.location.search)
  const urlTags = query.get('tags')
  const periodType = query.get('tipoData')
  const selectedDate = query.get('periodo')
  const selectedPerson = query.get('cliente')

  useEffect(() => {
    setSelectedPeriod(
      selectedDate
        ? [
            moment(selectedDate.split(',')[0]),
            moment(selectedDate.split(',')[1]),
          ]
        : [],
    )
    setPeriodType(JSON.parse(periodType) || 2)
    const parsedTags = JSON.parse(urlTags)
    const parsedPersons = JSON.parse(selectedPerson)
    setTags(parsedTags)
    setPersonTags(parsedPersons ?? [])
    setFilterTags(parsedTags ?? [])
  }, [urlTags, selectedDate])

  useEffect(() => {
    if (selectedDate && tags) {
      form.resetFields()
      generateReport()
    }
  }, [tags])

  return (
    <Spin spinning={loadingData}>
      <IssuedInvoiceReportHeader />
      {reportData && <IssuedInvoiceReportTable />}
    </Spin>
  )
}
export const WrapperIssuedInvoiceReportConfigWithProvider = withWrapper(
  (element, props) => (
    <PermissionProvider processName="RelatorioBoletosEmitidosAdministracao">
      <IssuedInvoiceReportProvider>{element}</IssuedInvoiceReportProvider>
    </PermissionProvider>
  ),
)(props => {
  const { permissions, loadingPermissions } = usePermissionContext()

  return (
    <ComponentWithPermission {...{ loadingPermissions, permissions }}>
      <div className="container">
        <IssuedInvoiceReport {...props} />
      </div>
    </ComponentWithPermission>
  )
})

export default WrapperIssuedInvoiceReportConfigWithProvider
