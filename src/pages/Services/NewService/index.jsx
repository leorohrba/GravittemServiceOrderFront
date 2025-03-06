/**
 * breadcrumb: Novo serviço
 */
import React from 'react'
import { NewServiceProvider } from './context/newServiceContext'
import NewService from './components/NewService'

export default function ServiceOrder() {
  return (
    <NewServiceProvider>
      <div className="container">
        <NewService />
      </div>
    </NewServiceProvider>
  )
}
