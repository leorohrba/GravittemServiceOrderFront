/**
 * breadcrumb: Pedido de compra
 */
import React from 'react'
import PurchaseOrderHeader from './components/PurchaseOrderHeader'
import PurchaseOrderTable from './components/PurchaseOrderTable'
import { PurchaseOrderProvider } from './context/PurchaseOrderContext'

export default function PurchaseOrder() {
  return (
    <div className="container">
      <PurchaseOrderProvider>
        <PurchaseOrderHeader />
        <PurchaseOrderTable />
      </PurchaseOrderProvider>
    </div>
  )
}
