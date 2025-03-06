import PdfFooter from '@components/PdfConfig/PdfFooter'
import PdfHeader from '@components/PdfConfig/PdfHeader'
import { dateType, purchaseStatus } from '@pages/InvoiceManagement/enums'
import { exportExcelFormat } from '@utils'
import { getLoginData } from '@utils/customHooks'
import { exportExcel } from '@utils/export'
import { Button, Dropdown, Menu } from 'antd'
import moment from 'moment'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import React, { useEffect, useState } from 'react'
import { useIssuedInvoiceReportContext } from '../context/IssuedInvoiceReportContext'

pdfMake.vfs = pdfFonts.pdfMake?.vfs

const findStatus = idToFind => purchaseStatus.find(item => item.id === idToFind)

export default function InvoiceReportExport() {
  const {
    reportData,
    filterTags,
    personTags,
    reportPeriod,
    reportPeriodType,
  } = useIssuedInvoiceReportContext()
  const [loadingExportData, setLoadingExportData] = useState(false)

  const [loginData, setLoginData] = useState()
  useEffect(() => {
    getLoginData(setLoginData)
  }, [])

  const date = dateType.find(t => t.id === reportPeriodType)?.name || ''
  const filters =
    reportData &&
    `Emitente: ${personTags
      .map(p => p.label)
      .join(', ')}; ${date}: ${reportPeriod[0].format(
      'DD/MM/YYYY',
    )} ~ ${reportPeriod[1].format('DD/MM/YYYY')}; ${filterTags
      .map(tag => `${tag.fieldName}: ${tag.searchField}`)
      .join(', ')}`

  const exportMenu = () => (
    <Menu>
      <Menu.Item key={1} onClick={() => exportTableData(true)}>
        Excel
      </Menu.Item>
      {loginData && (
        <Menu.Item key={2}>
          {ExportPDF(exportTableData, loginData, filters, reportData)}
        </Menu.Item>
      )}
    </Menu>
  )

  const exportTableData = async (isExcel = false) => {
    setLoadingExportData(true)

    if (isExcel) {
      reportData.itens.forEach(
        d =>
          // eslint-disable-next-line no-param-reassign
          (d.statusDescricao = findStatus(d.status)?.name),
      )
      const totalRow = {
        emitente: 'Total',
        valor: reportData.total,
        valorPago: reportData.totalPago,
        valorTaxaOperador: reportData.totalOperador,
        taxaSoftin: reportData.totalSoftin,
        valorTaxa: reportData.totalCobranca,
        valorDepositado: reportData.totalDepositado,
      }
      const nome = 'relatório de boletos emitidos'
      const filtros = filters
      const colunas = [
        {
          label: 'Emitente',
          value: 'emitente',
        },
        {
          label: 'Pagador',
          value: 'pagador',
        },
        {
          label: 'Nº título',
          value: 'numerosTitulos',
        },
        {
          label: 'Data de emissão',
          value: 'emissao',
        },
        {
          label: 'Valor',
          value: 'valor',
        },
        {
          label: 'Data de pagamento',
          value: 'dataPagamento',
        },
        {
          label: 'Juros',
          value: 'valorJuros',
        },
        {
          label: 'Multa',
          value: 'valorMulta',
        },
        {
          label: 'Valor pago',
          value: 'valorPago',
        },
        {
          label: 'Data depósito',
          value: 'dataDeposito',
        },
        {
          label: 'Taxa operador',
          value: 'valorTaxaOperador',
        },
        {
          label: 'Taxa Softin',
          value: 'taxaSoftin',
        },
        {
          label: 'Taxa cobrança',
          value: 'valorTaxa',
        },
        {
          label: 'Valor depositado',
          value: 'valorDepositado',
        },
        {
          label: 'Status',
          value: 'statusDescricao',
        },
        {
          label: 'Agência',
          value: 'contaCorrenteAgencia',
        },
        {
          label: 'Conta corrente',
          value: 'contaCorrente',
        },
        {
          label: 'Nº documento',
          value: 'numeroDocumento',
        },
        {
          label: 'Nosso número',
          value: 'numeroRegistro',
        },
      ]
      const nomeArquivo = 'relatorio_boletos_emitidos'
      exportExcel(
        nome,
        filtros,
        colunas,
        [...reportData.itens, totalRow],
        nomeArquivo,
        setLoadingExportData,
      )
    }
    setLoadingExportData(false)
    return reportData.itens
  }

  return (
    <Dropdown
      overlay={exportMenu}
      className={reportData ? 'ml-3' : 'ml-auto'}
      disabled={!reportData || !loginData}
    >
      <Button className="iconButton" loading={loadingExportData}>
        <i className="fa fa-download fa-lg mr-3" />
        Exportar
      </Button>
    </Dropdown>
  )
}

function ExportPDF(exportTableData, loginData, filters, reportData) {
  const columns = [
    {
      text: 'Emitente',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Pagador',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Nº título',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Data de emissão',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Valor',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Data de pagamento',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Juros/Multa',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Valor pago',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Data depósito',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Taxa operador',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Taxa Softin',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Taxa cobrança',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Valor depositado',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Status',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Conta corrente',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Nº documento',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
    {
      text: 'Nosso número',
      fontSize: 9,
      bold: true,
      fillColor: '#dddddd',
    },
  ]

  const docDefinition = exportData => {
    function buildTableBody() {
      const body = []

      body.push(columns)

      exportData.forEach(row => {
        const dataRow = [
          { text: row.emitente || '', fontSize: 9 },
          { text: row.pagador || '', fontSize: 9 },
          {
            text: row.numerosTitulos || '',
            fontSize: 9,
          },
          {
            text: row.emissao ? moment(row.emissao).format('DD/MM/YYYY') : '',
            fontSize: 9,
          },
          {
            text: row.valor || '',
            fontSize: 9,
          },
          {
            text: row.dataPagamento
              ? moment(row.dataPagamento).format('DD/MM/YYYY')
              : '',
            fontSize: 9,
          },
          {
            text: row.valorJuros + row.valorMulta || '',
            fontSize: 9,
          },
          {
            text: row.valorPago || '',
            fontSize: 9,
          },
          {
            text: row.dataDeposito
              ? moment(row.dataDeposito).format('DD/MM/YYYY')
              : '',
            fontSize: 9,
          },
          {
            text: row.valorTaxaOperador || '',
            fontSize: 9,
          },
          {
            text: row.taxaSoftin || '',
            fontSize: 9,
          },
          {
            text: row.valorTaxa || '',
            fontSize: 9,
          },
          {
            text: row.valorDepositado || '',
            fontSize: 9,
          },
          {
            text: findStatus(row.status)?.name || '',
            fontSize: 9,
          },
          {
            text:
              `Agência: ${row.contaCorrenteAgencia}\nConta: ${row.contaCorrente}` ||
              '',
            fontSize: 9,
          },
          {
            text: row.numeroDocumento || '',
            fontSize: 9,
          },
          {
            text: row.numeroRegistro || '',
            fontSize: 9,
          },
        ]

        body.push(dataRow)
      })

      body.push([
        { text: 'Total', fontSize: 9, bold: true, fillColor: '#dddddd' },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        {
          text: reportData?.total,
          fontSize: 9,
          bold: true,
          fillColor: '#dddddd',
        },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        {
          text: reportData?.totalPago,
          fontSize: 9,
          bold: true,
          fillColor: '#dddddd',
        },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        {
          text: reportData?.totalOperador,
          fontSize: 9,
          bold: true,
          fillColor: '#dddddd',
        },
        {
          text: reportData?.totalSoftin,
          fontSize: 9,
          bold: true,
          fillColor: '#dddddd',
        },
        {
          text: reportData?.totalCobranca,
          fontSize: 9,
          bold: true,
          fillColor: '#dddddd',
        },
        {
          text: reportData?.totalDepositado,
          bold: true,
          fontSize: 9,
          fillColor: '#dddddd',
        },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
        { text: '', fontSize: 9, bold: true, fillColor: '#dddddd' },
      ])

      return body
    }

    const doc = {
      pageMargins: [5, 80, 10, 30],
      info: {
        title: 'Relatório de boletos emitidos',
      },
      header(currentPage, pageCount, pageSize) {
        return PdfHeader(
          currentPage,
          pageCount,
          pageSize,
          { ownerName: loginData.empresa, userName: loginData.usuario },
          'Relatório de boletos emitidos',
          loginData.logo,
        )
      },
      footer(page) {
        return {
          ...PdfFooter(),
        }
      },
      content: [
        {
          margin: [10, 0, 0, 10],
          fontSize: 9,
          text: filters,
          color: 'grey',
        },
        {
          margin: [0, 0, 0, 0],
          table: {
            headerRows: 1,
            widths: columns.map(() => 'auto'),
            body: buildTableBody(),
          },
          layout: {
            hLineWidth() {
              return 0.3
            },
            vLineWidth() {
              return 0.3
            },
            hLineColor() {
              return 'darkgray'
            },
            vLineColor() {
              return 'darkgray'
            },
          },
        },
      ],
      pageSize: 'A4',
      pageOrientation: 'landscape',
    }

    pdfMake
      .createPdf(doc)
      .download(`${exportExcelFormat('relatorio_boletos_emitidos')}`)
  }

  return (
    <div
      role="button"
      onClick={async () => {
        const props = await exportTableData()
        props.length > 0 && docDefinition(props)
      }}
    >
      PDF
    </div>
  )
}
