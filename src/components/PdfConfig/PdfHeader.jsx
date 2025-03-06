import moment from 'moment'

const PdfHeader = (
  currentPage,
  pageCount,
  pageSize,
  userInfo,
  title,
  companyLogo,
) => {
  return [
    {
      stack: [
        {
          pageBreak: undefined,
          alignment: 'justify',
          margin: [25, 20, 0, 0],
          columns: [
            {
              width: 150,
              stack: [
                {
                  image: companyLogo,
                  alignment: 'left',
                  fit: [150, 40],
                },
              ],
            },
            {
              margin: [20, 0, 0, 0],
              text: [
                {
                  text: `${userInfo.ownerName}\n`,
                  fontSize: 15,
                  bold: true,
                },
                {
                  text: title,
                },
              ],
            },
            {
              fontSize: 10,
              lineHeight: 1,
              text: `Página ${currentPage} / ${pageCount}\n${
                userInfo.userName
              } - ${moment().format('L')} ${moment().format('LTS')}`,
              alignment: 'right',
              margin: [0, 10, 30, 0],
            },
          ],
        },
      ],
    },
  ]
}

export default PdfHeader
