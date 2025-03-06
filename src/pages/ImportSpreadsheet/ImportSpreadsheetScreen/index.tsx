/**
 * breadcrumb: Importar planilha
 */

import React from 'react'
import { ServiceOrderProvider } from '@pages/ServiceOrder/ServiceOrderImport/context/ServiceOrderContext'
import Content from './content'

function ImportSpreadsheets() {
  return (
    <ServiceOrderProvider screenType={'GenericSpreadSheetProcessor'}>
      <Content />
    </ServiceOrderProvider>
  )
}

export default ImportSpreadsheets
