/**
 * breadcrumb: Solicitação de compra
 */
import React from 'react'
import PurchaseRequestHeader from './components/PurchaseRequestHeader'
import PurchaseRequestTable from './components/PurchaseRequestTable'
import { PurchaseRequestProvider } from './context/PurchaseRequestContext'
import JustifyModal from './modals/JustifyModal'
import QuotationRequestModal from './modals/QuotationRequestModal'

export default function PurchaseRequest() {
  return (
    <div className="container">
      <PurchaseRequestProvider>
        <JustifyModal />
        <QuotationRequestModal />
        <PurchaseRequestHeader />
        <PurchaseRequestTable />
      </PurchaseRequestProvider>
    </div>
  )
}
