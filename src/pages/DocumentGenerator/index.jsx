/**
 * breadcrumb: Gerador de documento
 */
import React from 'react'
import DocumentGeneratorHeader from './components/DocumentGeneratorHeader'
import DocumentGeneratorTable from './components/DocumentGeneratorTable'
import { DocumentGeneratorProvider } from './context/DocumentGeneratorContext'

export default function DocumentGenerator() {
  const documentTypeId =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('documentTypeId')
      : ''
  return (
    <div className="container">
      <DocumentGeneratorProvider documentTypeId={documentTypeId}>
        <DocumentGeneratorHeader />
        <DocumentGeneratorTable />
      </DocumentGeneratorProvider>
    </div>
  )
}
