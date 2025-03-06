import { Document, Page, PDFViewer } from '@react-pdf/renderer'
import PropTypes from 'prop-types'
import React from 'react'

const PdfContainer = ({ children }) => (
  <PDFViewer
    style={{
      width: '100%',
      height: '99vh',
    }}
  >
    <Document>
      <Page
        size="A4"
        style={{
          margin: 20,
          paddingRight: 40,
        }}
      >
        {children}
      </Page>
    </Document>
  </PDFViewer>
)

PdfContainer.propTypes = {
  children: PropTypes.node,
}

export default PdfContainer
