/**
 * breadcrumb: Novo campo
 */
import React from 'react'
import NewFieldHeader from './components/NewFieldHeader'
import NewFieldTable from './components/NewFieldTable'
import { NewFieldProvider } from './context/DocumentGeneratorContext'
import NewFieldModal from './modals/NewFieldModal'

export default function NewField() {
  return (
    <NewFieldProvider>
      <NewFieldModal />
      <div className="container space-y-5">
        <NewFieldHeader />
        <NewFieldTable />
      </div>
    </NewFieldProvider>
  )
}
