/**
 * breadcrumb: Novo tipo de campo
 */

import React from 'react'
import NewFieldTypeHeader from './components/NewFieldTypeHeader'
import NewFieldTypeTable from './components/NewFieldTypeTable'
import { NewFieldTypeProvider } from './context/DocumentGeneratorContext'
import NewFieldTypeModal from './modals/NewFieldTypeModal'

export default function NewFieldType() {
  const documentTypeId =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('documentTypeId')
      : ''
  return (
    <NewFieldTypeProvider documentTypeId={documentTypeId}>
      <NewFieldTypeModal />
      <div className="container space-y-5">
        <NewFieldTypeHeader />
        <NewFieldTypeTable />
      </div>
    </NewFieldTypeProvider>
  )
}
