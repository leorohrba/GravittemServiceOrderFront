import { addBrlCurrencyToNumber, customSort } from '@utils'
import moment from 'moment'

export const contentHeader = (
  companyLogoDataUri,
  loginInformation,
  pageBreak,
) => {
  return [
    {
      pageBreak: pageBreak ? 'before' : undefined,
      alignment: 'justify',
      margin: [25, 2, 10, 5],
      columns: [
        {
          width: 150,
          stack: [
            {
              image: companyLogoDataUri,
              alignment: 'left',
              fit: [150, 40],
            },
          ],
        },
        {
          margin: [20, 0, 0, 0],
          text: [
            {
              text: `${loginInformation.ownerFullName}\n`,
              fontSize: 12,
              bold: true,
            },
            {
              text: 'Relatório de requisição de itens',
              fontSize: 12,
            },
          ],
        },
      ],
    },
  ]
}
export const requisitionRow = (request, pageBreak) => {
  return {
    pageBreak: pageBreak ? 'before' : undefined,
    margin: [360, -42, 0, 20],
    columns: [
      {
        text: 'Nº',
        width: 15,
        bold: true,
        alignment: 'right',
      },
      {
        width: 'auto',
        text: request.sequenceNumber,
        bold: true,
        alignment: 'right',
      },
    ],
    columnGap: 10,
  }
}
export const contentFirstRow = request => {
  return {
    margin: [0, 5, 0, 0],
    columns: [
      {
        text: 'Solicitante',
        width: 60,
        bold: true,
      },
      {
        width: 190,
        text: `${request.requesterCode ? `${request.requesterCode} - `: ''}${request.requesterName}`,
      },
      {
        text: 'Período',
        width: 60,
        bold: true,
      },
      {
        width: 'auto',
        text: `${moment(request.initialDate).format('DD/MM/YYYY')} ~ ${moment(
          request.finalDate,
        ).format('DD/MM/YYYY')}`,
      },
    ],
    columnGap: 10,
  }
}

export const contentSecondRow = request => {
  return {
    margin: [0, 5, 0, 20],
    columns: [
      {
        text: 'Observação',
        width: 60,
        bold: true,
      },
      {
        width: '*',
        text: request.observation,
      },
    ],
    columnGap: 10,
  }
}

export const contentGroupedByStockLocation = request => {
  const source = []
  request.requestItems.map(d => {
    if (!source.find(x => x.stockLocationId === d.stockLocationId)) {
      source.push({
        stockLocationId: d.stockLocationId,
        stockLocationDescription: d.stockLocationDescription,
      })
    }
    return true
  })
  source.sort((a, b) =>
    customSort(a.stockLocationDescription, b.stockLocationDescription),
  )
  const result = {
    stack: [],
  }
  source.map(d => {
    result.stack.push({
      margin: [0, 10, 0, 0],
      text: [
        { text: 'Local de estoque: ', bold: true },
        d.stockLocationDescription,
      ],
    })
    result.stack.push(contentMaterialTable2(request, d.stockLocationId))
    return true
  })
  return result
}

export const contentMaterialTable = request => {
  const content = {
    margin: [0, 10, 0, 0],
    table: {
      widths: [
        'auto',
        '*',
        'auto',
        '*',
        '*',
        'auto',
        'auto',
        'auto',
        45,
        55,
        35,
      ],
      body: [
        [
          { text: 'Código', style: 'tableHeader' },
          { text: 'Item', style: 'tableHeader' },
          { text: 'Un', style: 'tableHeader' },
          { text: 'Estoque', style: 'tableHeader' },
          { text: 'Endereço', style: 'tableHeader' },
          { text: 'Req.', style: 'tableHeader' },
          { text: 'Aplic.', style: 'tableHeader' },
          { text: 'Dev.', style: 'tableHeader' },
          { text: 'Valor unit.', style: 'tableHeader' },
          { text: 'Status', style: 'tableHeader' },
          { text: 'Doc.', style: 'tableHeader' },
        ],
      ],
    },
    layout: {
      hLineWidth() {
        return 0.3
      },
      vLineWidth() {
        return 0.3
      },
    },
  }

  request.requestItems.map(record =>
    content.table.body.push([
      record.itemCode,
      record.itemDescription,
      record.measuringUnitCode,
      record.stockLocationDescription,
      record.stockAddress,
      record.quantityRequested,
      record.quantityApplied || '',
      record.quantityRequested - (record.quantityApplied || 0),
      record.unitValue ? addBrlCurrencyToNumber(record.unitValue) : '',
      record.actStatusDescription || '',
      record.sequenceNumber || '',
    ]),
  )

  return content
}

export const contentMaterialTable2 = (request, stockLocationId) => {
  const content = {
    margin: [0, 5, 0, 0],
    table: {
      widths: [
        'auto',
        '*',
        'auto',
        '*',
        '*',
        'auto',
        'auto',
        'auto',
        45,
        55,
        35,
      ],
      body: [
        [
          { text: 'Código', style: 'tableHeader' },
          { text: 'Item', style: 'tableHeader' },
          { text: 'Un', style: 'tableHeader' },
          { text: 'Estoque', style: 'tableHeader' },
          { text: 'Endereço', style: 'tableHeader' },
          { text: 'Req.', style: 'tableHeader' },
          { text: 'Aplic.', style: 'tableHeader' },
          { text: 'Dev.', style: 'tableHeader' },
          { text: 'Valor unit.', style: 'tableHeader' },
          { text: 'Status', style: 'tableHeader' },
          { text: 'Doc.', style: 'tableHeader' },
        ],
      ],
    },
    layout: {
      hLineWidth() {
        return 0.3
      },
      vLineWidth() {
        return 0.3
      },
    },
  }

  request.requestItems
    .filter(x => x.stockLocationId === stockLocationId)
    .map(record =>
      content.table.body.push([
        record.itemCode,
        record.itemDescription,
        record.measuringUnitCode,
        record.stockAddress,
        record.quantityRequested,
        record.quantityApplied || '',
        record.quantityRequested - (record.quantityApplied || 0),
        record.unitValue ? addBrlCurrencyToNumber(record.unitValue) : '',
        record.actStatusDescription || '',
        record.sequenceNumber || '',
      ]),
    )

  return content
}

export function contentAnnotationsTitle() {
  return [
    {
      margin: [0, 15, 0, 0],
      text: 'Anotações',
      bold: true,
    },
  ]
}
export function contentAnnotationsTable() {
  return [
    {
      margin: [0, 5, 0, 0],
      table: {
        widths: [50, '*', 60, 70, '*'],
        body: [
          [
            { text: 'Código', style: 'tableHeader' },
            { text: 'Item', style: 'tableHeader' },
            { text: 'Aplicado', style: 'tableHeader' },
            { text: 'Documento', style: 'tableHeader' },
            { text: 'Observação', style: 'tableHeader' },
          ],
          [' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' '],
          [' ', ' ', ' ', ' ', ' '],
        ],
      },
      layout: {
        hLineWidth() {
          return 0.3
        },
        vLineWidth() {
          return 0.3
        },
      },
    },
  ]
}
