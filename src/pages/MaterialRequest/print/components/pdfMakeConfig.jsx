import moment from 'moment'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import PropTypes from 'prop-types'
import {
  contentAnnotationsTable,
  contentAnnotationsTitle,
  contentFirstRow,
  contentHeader,
  contentMaterialTable,
  contentSecondRow,
  requisitionRow,
} from './content'
import { footer } from './footer'

pdfMake.vfs = pdfFonts.pdfMake?.vfs

export default function PdfMakeConfig({
  companyLogoDataUri,
  gravittemFaviconImgDataUri,
  loginInformation,
  requests,
}) {
  const docDefinition = {
    pageMargins: [25, 90, 30, 45],
    info: {
      title: 'Detalhe da requisição',
    },
    header(currentPage, pageCount, pageSize) {
      return [
        {
          stack: [
            {
              fontSize: 8,
              lineHeight: 1,
              text: `Página ${currentPage} / ${pageCount}\n${
                loginInformation.userName
              } - ${moment().format('L')} ${moment().format('LTS')}`,
              alignment: 'right',
              margin: [0, 10, 30, 0],
            },
            contentHeader(companyLogoDataUri, loginInformation, false),
          ],
        },
      ]
    },

    footer() {
      return {
        ...footer(gravittemFaviconImgDataUri),
      }
    },
    content: [],
    styles: {
      tableHeader: {
        bold: true,
      },
    },
    defaultStyle: {
      fontSize: 9,
    },
  }

  requests.map((request, index) => {
    docDefinition.content.push(requisitionRow(request, index !== 0))
    docDefinition.content.push(contentFirstRow(request))
    docDefinition.content.push(contentSecondRow(request))
    docDefinition.content.push(contentMaterialTable(request))
    docDefinition.content.push(contentAnnotationsTitle())
    docDefinition.content.push(contentAnnotationsTable())
    return true
  })

  // download the PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition)
  pdfDocGenerator.getDataUrl(dataUrl => {
    const targetElement = document.querySelector('#requestReport')
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:absolute;width:95%;height:88%;'
    iframe.src = dataUrl
    targetElement.appendChild(iframe)
  })
  return <div />
}

PdfMakeConfig.propTypes = {
  companyLogoDataUri: PropTypes.any,
  gravittemFaviconImgDataUri: PropTypes.any,
  loginInformation: PropTypes.any,
  requests: PropTypes.array,
}
