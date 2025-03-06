export const fourthChapter = {
  margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  text: [
    {
      text: '4. ADEQUAÇÃO',
      id: 'adequacao',
      style: 'header',
    },
    '\n\u200B\t\t\tPara o correto funcionamento e comunicação do condomínio com a central ATENDE PORTARIA, será necessária a instalação dos equipamentos descritos na planilha abaixo. A relação comercial para fornecimento e prestação de serviços relacionados a adequação de infraestrutura, ocorrerá única e exclusivamente entre FRANQUEADA CONTRATADA e CONTRATANTE, sendo de responsabilidade da FRANQUEADA CONTRATADA e CONTRATANTE os direitos e obrigações advindos desta relação comercial.',
  ],
}
export const fourthChapterFirstSectionTitle = {
  margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  text: [
    {
      text: '4.1 Equipamentos para Adequação',
      id: 'equipamento_adequacao',
      style: 'subheader',
    },
  ],
}
export const fourthChapterFirstSectionProductsTable = {
  margin: [0, 10, 0, 0],
  layout: {
    fillColor(rowIndex, node, columnIndex) {
      if (rowIndex === 0) {
        return '#be0c16'
      }

      return rowIndex % 2 !== 0 ? '#ededed' : null
    },

    hLineColor(i, node) {
      return '#ededed'
    },

    hLineWidth(i, node) {
      return 0.1
    },

    vLineColor(i, node) {
      return 'white'
    },
  },
  table: {
    headerRows: 1,
    widths: [80, 400],
    body: [
      [
        {
          text: 'PRODUTOS',
          color: 'white',
          bold: true,
          alignment: 'center',
          colSpan: 2,
        },
        {},
      ],
      [
        {
          text: 'Quantidade',
          alignment: 'center',
        },
        {
          text: 'Descrição',
          bold: true,
          alignment: 'center',
        },
      ],
      [
        {
          text: '1',
          alignment: 'center',
        },
        {
          text: 'Mini Rack 12 u',
          alignment: 'center',
        },
      ],
      [
        {
          text: '2',
          alignment: 'center',
        },
        {
          text: 'Bandeja para Mini Rack',
          alignment: 'center',
        },
      ],
      [
        {
          text: '3',
          alignment: 'center',
        },
        {
          text: 'Kit Porca Gaiola',
          alignment: 'center',
        },
      ],
    ],
  },
}
export const fourthChapterFirstSectionServicesTable = {
  margin: [0, 30, 0, 0],
  layout: {
    fillColor(rowIndex, node, columnIndex) {
      if (rowIndex === 0) {
        return '#be0c16'
      }

      return rowIndex % 2 !== 0 ? '#ededed' : null
    },

    hLineColor(i, node) {
      return '#ededed'
    },

    hLineWidth(i, node) {
      return 0.1
    },

    vLineColor(i, node) {
      return 'white'
    },
  },
  table: {
    headerRows: 1,
    widths: [80, 400],

    body: [
      [
        {
          text: 'SERVIÇOS',
          color: 'white',
          bold: true,
          alignment: 'center',
          colSpan: 2,
        },
        {},
      ],
      [
        {
          text: 'Quantidade',
          alignment: 'center',
        },
        {
          text: 'Descrição',
          bold: true,
          alignment: 'center',
        },
      ],
      [
        {
          text: '1',
          alignment: 'center',
        },
        {
          text: 'Mini Rack 12 u',
          alignment: 'center',
        },
      ],
      [
        {
          text: '2',
          alignment: 'center',
        },
        {
          text: 'Bandeja para Mini Rack',
          alignment: 'center',
        },
      ],
      [
        {
          text: '3',
          alignment: 'center',
        },
        {
          text: 'Kit Porca Gaiola',
          alignment: 'center',
        },
      ],
    ],
  },
}
export const fourthChapterFirstSectionObservation = {
  // margin: [0, 20, 0, 0],
  lineHeight: 1.5,
  text: [
    {
      text:
        '\nObs.: Todos os itens desta ADEQUAÇÃO supra discriminados, serão oferecidos ao Condomínio, já instalados podendo ser na forma de locação ou venda de equipamentos.\n',
    },
  ],
}
