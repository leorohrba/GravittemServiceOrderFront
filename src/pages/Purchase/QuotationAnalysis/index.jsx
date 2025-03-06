/**
 * breadcrumb: Análise de cotação
 */
import React from 'react'
import QuotationAnalysisHeader from './components/QuotationAnalysisHeader'
import QuotationAnalysisTable from './components/QuotationAnalysisTable'
import { QuotationAnalysisProvider } from './context/QuotationAnalysisContext'

export default function QuotationAnalysis() {
  return (
    <div className="container">
      <QuotationAnalysisProvider>
        <QuotationAnalysisHeader />
        <QuotationAnalysisTable />
      </QuotationAnalysisProvider>
    </div>
  )
}
