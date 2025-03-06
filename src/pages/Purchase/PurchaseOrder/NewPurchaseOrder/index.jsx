/**
 * breadcrumb: Novo pedido de compra
 */
import React from 'react'
import router from 'umi/router'
import NewPurchaseOrderFooter from './components/NewPurchaseOrderFooter'
import NewPurchaseOrderForm from './components/NewPurchaseOrderForm'
import NewPurchaseOrderHeader from './components/NewPurchaseOrderHeader'
import NewPurchaseOrderTable from './components/NewPurchaseOrderTable'
import { NewPurchaseOrderProvider } from './context/NewPurchaseOrderContext'

export default function NewPurchaseOrder() {
  return (
    <div className="container">
      <NewPurchaseOrderProvider>
        <div className="mb-4">
          <a onClick={() => router.goBack()}>Pedido de compra</a>
          <span>{' > Novo pedido de compra'}</span>
        </div>
        <NewPurchaseOrderHeader />
        <NewPurchaseOrderForm />
        <NewPurchaseOrderTable />
        <NewPurchaseOrderFooter />
      </NewPurchaseOrderProvider>
    </div>
  )
}
