import React from 'react'
import router from 'umi/router'
import QuotationAnalysisDetailFooter from './components/QuotationAnalysisDetailFooter'
import QuotationAnalysisDetailHeader from './components/QuotationAnalysisDetailHeader'
import QuotationAnalysisDetailTable from './components/QuotationAnalysisDetailTable'
import { QuotationAnalysisDetailProvider } from './context/QuotationAnalysisDetailContext'

export default function QuotationAnalysisDetail() {
  return (
    <div className="container">
      <QuotationAnalysisDetailProvider>
        <div className="mb-4">
          <a onClick={() => router.goBack()}>Análise de cotação</a>
          <span>{' > Detalhe'}</span>
        </div>
        <QuotationAnalysisDetailHeader />
        <QuotationAnalysisDetailTable />
        <QuotationAnalysisDetailFooter />
      </QuotationAnalysisDetailProvider>
    </div>
  )
}
