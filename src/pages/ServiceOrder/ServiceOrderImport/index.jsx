/**
 * breadcrumb: Importação ordem de serviço
 */

import React from 'react'
import { ServiceOrderProvider } from './context/ServiceOrderContext'
import Content from './content'

function ServiceOrders() {
  return (
    <ServiceOrderProvider>
      <Content />
    </ServiceOrderProvider>
  )
}

export default ServiceOrders
