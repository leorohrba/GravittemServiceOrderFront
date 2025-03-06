/**
 * breadcrumb: Cotação fornecedor
 */
import React from 'react'
import QuotationDataFooter from './components/QuotationDataFooter'
import QuotationDataForm from './components/QuotationDataForm'
import QuotationDataTable from './components/QuotationDataTable'
import { QuotationDataProvider } from './context/QuotationDataContext'

export default function QuotationData() {
  return (
    <div className="container">
      <QuotationDataProvider>
        <QuotationDataTable />
        <QuotationDataForm />
        <QuotationDataFooter />
      </QuotationDataProvider>
    </div>
  )
}
