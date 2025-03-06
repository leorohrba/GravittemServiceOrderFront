/**
 * breadcrumb: Ordem de serviço
 */
import React from 'react'
import NewServiceModal from '../NewService'
import ServiceOrderHeader from './components/ServiceOrderHeader'
import ServiceOrderTable from './components/ServiceOrderTable'
import { ServiceOrderProvider } from './context/ServiceOrderContext'

export default function ServiceOrder() {
  return (
    <div className="container">
      <ServiceOrderProvider>
        <NewServiceModal />
        <ServiceOrderHeader />
        <ServiceOrderTable />
      </ServiceOrderProvider>
    </div>
  )
}
