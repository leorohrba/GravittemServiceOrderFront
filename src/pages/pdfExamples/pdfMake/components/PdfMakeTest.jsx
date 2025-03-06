import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import PropTypes from 'prop-types'
import {
  fifthChapterFirstSection,
  fifthChapterFourthSectionList,
  fifthChapterFourthSectionTitle,
  fifthChapterSecondSection,
  fifthChapterSecondSectionFirstSub,
  fifthChapterSecondSectionSecondSub,
  fifthChapterThirdSectionList,
  fifthChapterThirdSectionTitle,
} from './fifthChapter'
import {
  firstChapterFirstSectionList,
  firstChapterFirstSectionTitle,
  firstChapterImage,
  firstChapterText,
} from './firstChapter'
import firstPageLayout from './firstPageLayout'
import footer from './footer'
import {
  fourthChapter,
  fourthChapterFirstSectionObservation,
  fourthChapterFirstSectionProductsTable,
  fourthChapterFirstSectionServicesTable,
  fourthChapterFirstSectionTitle,
} from './fourthChapter'
import {
  secondChapterEighthSection,
  secondChapterEighthSectionTable,
  secondChapterFifthSection,
  secondChapterFistSection,
  secondChapterFourthSection,
  secondChapterSecondSection,
  secondChapterSecondSectionImg,
  secondChapterSeventhSectionFirstSection,
  secondChapterSeventhSectionFirstSectionImg,
  secondChapterSeventhSectionHeader,
  secondChapterSeventhSectionList,
  secondChapterSixthSection,
  secondChapterThirdSection,
  secondChapterThirdSectionFirstImg,
  secondChapterThirdSectionSecondImg,
} from './secondChapter'
import {
  secondPageLayoutContent,
  secondPageLayoutTitle,
} from './secondPageLayout'
import { signatureSection } from './signatureSection'
import { sixthChapter } from './sisxthChapter'
import {
  thirdChapterFirstSectionList,
  thirdChapterFirstSectionTitle,
  thirdChapterList,
  thirdChapterText,
} from './thirdChapter'

pdfMake.vfs = pdfFonts.pdfMake?.vfs

export default function PdfMakeTest({
  companyBackgroundImgDataUri,
  headerFooterImgBackgroundDataUri,
  firstChapterImgDataUri,
  secondChapterSecondSectionImgDataUri,
  secondChapterThirdSectionFirstImgDataUri,
  secondChapterThirdSectionSecondImgDataUri,
  secondChapterSeventhSectionFirstSectionImgDataUri,
}) {
  const docDefinition = {
    info: {
      title: 'Detalhe do negócio',
    },
    footer(page) {
      if (page !== 1) {
        return {
          ...footer,
        }
      }
      return false
    },
    background(currentPage) {
      if (currentPage === 1) {
        return [
          {
            image: companyBackgroundImgDataUri,
            width: 600,
          },
        ]
      }
      return [
        {
          image: headerFooterImgBackgroundDataUri,
          width: 594,
        },
      ]
    },
    pageMargins: [40, 40, 40, 80],
    content: [
      firstPageLayout,
      secondPageLayoutTitle,
      secondPageLayoutContent,
      firstChapterText,
      firstChapterImage(firstChapterImgDataUri),
      firstChapterFirstSectionTitle,
      firstChapterFirstSectionList,
      secondChapterFistSection,
      secondChapterSecondSection,
      secondChapterSecondSectionImg(secondChapterSecondSectionImgDataUri),
      secondChapterThirdSection,
      secondChapterThirdSectionFirstImg(
        secondChapterThirdSectionFirstImgDataUri,
      ),
      secondChapterThirdSectionSecondImg(
        secondChapterThirdSectionSecondImgDataUri,
      ),
      secondChapterFourthSection,
      secondChapterFifthSection,
      secondChapterSixthSection,
      secondChapterSeventhSectionHeader,
      secondChapterSeventhSectionList,
      secondChapterSeventhSectionFirstSection,
      secondChapterSeventhSectionFirstSectionImg(
        secondChapterSeventhSectionFirstSectionImgDataUri,
      ),
      secondChapterEighthSection,
      secondChapterEighthSectionTable,
      thirdChapterText,
      thirdChapterList,
      thirdChapterFirstSectionTitle,
      thirdChapterFirstSectionList,
      fourthChapter,
      fourthChapterFirstSectionTitle,
      fourthChapterFirstSectionProductsTable,
      fourthChapterFirstSectionServicesTable,
      fourthChapterFirstSectionObservation,
      fifthChapterFirstSection,
      fifthChapterSecondSection,
      fifthChapterSecondSectionFirstSub,
      fifthChapterSecondSectionSecondSub,
      fifthChapterThirdSectionTitle,
      fifthChapterThirdSectionList,
      fifthChapterFourthSectionTitle,
      fifthChapterFourthSectionList,
      sixthChapter,
      signatureSection,
    ],
    styles: {
      header: {
        fontSize: 15,
        bold: true,
      },
      subheader: {
        fontSize: 14,
        bold: true,
      },
      subsubheader: {
        fontSize: 11,
        bold: true,
      },
    },

    // content: [productsAndServicesTable, signatureSection],
  }
  // download the PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition)
  pdfDocGenerator.getDataUrl(dataUrl => {
    const targetElement = document.querySelector('#proposalReport')
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:absolute;width:100%;height:100%;'
    iframe.src = dataUrl
    targetElement.appendChild(iframe)
  })
  return <div />
}

PdfMakeTest.propTypes = {
  companyBackgroundImgDataUri: PropTypes.any,
  firstChapterImgDataUri: PropTypes.any,
  headerFooterImgBackgroundDataUri: PropTypes.any,
  secondChapterSecondSectionImgDataUri: PropTypes.any,
  secondChapterSeventhSectionFirstSectionImgDataUri: PropTypes.any,
  secondChapterThirdSectionFirstImgDataUri: PropTypes.any,
  secondChapterThirdSectionSecondImgDataUri: PropTypes.any,
}
