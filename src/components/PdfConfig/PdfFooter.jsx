import gravittemFaviconImg from '@assets/images/favicon/gravittem.png'

const PdfFooter = () => {
  return {
    margin: [30, 5, 0, 0],
    columns: [
      {
        image: gravittemFaviconImg,
        width: 10,
        absolutePosition: {
          x: 30,
          y: 5,
        },
      },
      {
        text: 'A mais ampla solução colaborativa de serviços',
        color: 'grey',
        fontSize: 10,
      },
      {
        text: 'www.gravittem.com | (47) 3437-3312',
        color: 'grey',
        fontSize: 10,
      },
    ],
    columnGap: 10,
  }
}

export default PdfFooter
