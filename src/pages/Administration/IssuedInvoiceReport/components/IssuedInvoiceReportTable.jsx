import DefaultTable from '@components/DefaultTable'
import TooltipParagraph from '@components/TooltipParagraph'
import { purchaseStatus } from '@pages/InvoiceManagement/enums'
import { getLocaleCurrency } from '@utils'
import { tableCellRender, tableTitleRender } from '@utils/components'
import { Badge } from 'antd'
import moment from 'moment'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
// import router from 'umi/router'
import { useIssuedInvoiceReportContext } from '../context/IssuedInvoiceReportContext'

export default function IssuedInvoiceReportTable() {
  const findIssuedInvoiceStatus = idToFind =>
    purchaseStatus.find(item => item.id === idToFind)

  const {
    reportData,
    loadingData,
    // filterTags,
    // personTags,
    // selectedPeriod,
    // periodType,
  } = useIssuedInvoiceReportContext()
  const columns = [
    {
      title: 'Emitente',
      dataIndex: 'emitente',
      width: 180,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Pagador',
      dataIndex: 'pagador',
      width: 180,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Nº título',
      dataIndex: 'numerosTitulos',
      width: 80,
    },
    {
      title: 'Data de emissão',
      dataIndex: 'emissao',
      width: 150,
      render: val => val && moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      width: 130,
      key: 1,
      render: val => (
        <span style={{ color: '#4CAF50' }}>
          <TooltipParagraph>
            {formatNumber(val || 0, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </TooltipParagraph>
        </span>
      ),
    },
    {
      title: tableTitleRender('Data de pagamento'),
      dataIndex: 'dataPagamento',
      width: 130,
      render: val => val && moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Juros/Multa',
      width: 130,
      key: 1,
      render: (index, val) => (
        <span style={{ color: '#4CAF50' }}>
          <TooltipParagraph>
            {formatNumber(val.valorJuros + val.valorMulta || 0, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </TooltipParagraph>
        </span>
      ),
    },
    {
      title: 'Valor pago',
      dataIndex: 'valorPago',
      width: 130,
      key: 1,
      render: val => (
        <span style={{ color: '#4CAF50' }}>
          <TooltipParagraph>
            {formatNumber(val || 0, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </TooltipParagraph>
        </span>
      ),
    },
    {
      title: tableTitleRender('Data depósito'),
      dataIndex: 'dataDeposito',
      width: 130,
      render: val => val && moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Taxa operador',
      dataIndex: 'valorTaxaOperador',
      width: 130,
      render: val => (
        <span style={{ color: '#4CAF50' }}>
          <TooltipParagraph>
            {formatNumber(val || 0, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </TooltipParagraph>
        </span>
      ),
    },
    {
      title: 'Taxa Softin',
      dataIndex: 'taxaSoftin',
      width: 130,
      render: val => (
        <span style={{ color: '#4CAF50' }}>
          <TooltipParagraph>
            {formatNumber(val || 0, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </TooltipParagraph>
        </span>
      ),
    },
    {
      title: 'Taxa cobrança',
      dataIndex: 'valorTaxa',
      width: 130,
      key: 1,
      render: val => (
        <span style={{ color: '#4CAF50' }}>
          <TooltipParagraph>
            {formatNumber(val || 0, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </TooltipParagraph>
        </span>
      ),
    },
    {
      title: tableTitleRender('Valor depositado'),
      dataIndex: 'valorDepositado',
      width: 130,
      key: 1,
      render: val => (
        <span style={{ color: '#4CAF50' }}>
          <TooltipParagraph>
            {formatNumber(val || 0, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </TooltipParagraph>
        </span>
      ),
    },
    {
      title: 'Status',
      width: 150,
      render: d => (
        <Badge
          color={findIssuedInvoiceStatus(d.status)?.color}
          text={tableCellRender(
            findIssuedInvoiceStatus(d.status)?.name,
            'status',
          )}
        />
      ),
    },
    {
      title: 'Conta corrente',
      width: 200,
      render: (index, d) => (
        <React.Fragment>
          <TooltipParagraph>{`Agência: ${d.contaCorrenteAgencia}`}</TooltipParagraph>
          <TooltipParagraph>{`Conta: ${d.contaCorrente}`}</TooltipParagraph>
        </React.Fragment>
      ),
    },
    {
      title: 'Nº documento',
      dataIndex: 'faturas',
      width: 200,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Nosso número',
      dataIndex: 'numeroRegistro',
      width: 200,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    // {
    //   align: 'right',
    //   title: '',
    //   fixed: 'right',
    //   width: 45,
    //   render: record => (
    //     <React.Fragment>
    //       <Tooltip placement="top" title="Detalhe do boleto">
    //         <Button
    //           type="secondary"
    //           className="mr-2 px-1"
    //           onClick={() =>
    //             router.push(
    //               `/InvoiceManagement/IssuedInvoice/IssuedInvoiceDetail?id=${
    //                 record.transacaoBancariaId
    //               }&tags=${JSON.stringify(
    //                 filterTags,
    //               )}&tipoData=${periodType}&periodo=${selectedPeriod}&cliente=${JSON.stringify(
    //                 personTags,
    //               )}isReport=true`,
    //             )
    //           }
    //         >
    //           <i className="fa fa-eye" />
    //         </Button>
    //       </Tooltip>
    //     </React.Fragment>
    //   ),
    // },
  ]
  return (
    <DefaultTable
      dataSource={reportData?.itens ?? []}
      columns={columns}
      rowKey={(row, index) => index}
      loading={loadingData}
      sticky
    />
  )
}
