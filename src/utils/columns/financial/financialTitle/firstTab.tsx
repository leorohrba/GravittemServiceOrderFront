import React from 'react'
import { Badge, Button, Tooltip } from 'antd'
import moment from 'moment'
import AttachmentsModal from '@components/modals/AttachmentsModal'
import { getLocaleCurrency } from '@utils'
import { tableCellRender, tableTitleRender } from '@utils/components'
import { formatMessage, formatNumber } from 'umi-plugin-react/locale'
import router from 'umi/router'
import { useFinancialTitleConfigContext } from '@pages/financial/FinancialTitle/context/FinancialTitleConfig'

const query = new URLSearchParams(window?.location?.search)
const tags = query.get('tags')
export const firstTabColumns = (
  isReceive,
  findStatus,
  findFinancialParcelStatus,
  showEditParcelModal,
  editId,
  hasVisualizeInvoicePermission,
  financialTitleType,
) =>
  Object.freeze([
    {
      title: 'Parcela',
      dataIndex: 'numero',
      key: 'numero',
      width: 70,
      fixed: 'left',
    },

    // {
    //   title: formatMessage({
    //     id: 'accountPay.index.person',
    //   }),
    //   dataIndex: 'person',
    //   key: 'person',
    // },
    // {
    //   title: formatMessage({
    //     id: 'accountPay.index.parcel',
    //   }),
    //   dataIndex: 'parcel',
    //   key: 'parcel',
    // },
    {
      title: 'Vencimento',
      key: 'dataVencimento',
      width: 120,
      render: val =>
        tableCellRender(
          moment(
            val.dataRenegociacao ? val.dataRenegociacao : val.dataVencimento,
          ).format('DD/MM/YYYY'),
          'date',
        ),
    },
    {
      title: 'Renegociação',
      key: 'dataRenegociacao',
      width: 120,
      render: val =>
        val.dataRenegociacao &&
        tableCellRender(
          moment(val.dataVencimento).format('DD/MM/YYYY'),
          'date',
        ),
    },
    {
      title: 'Valor',
      key: 'valor',
      width: 130,
      render: record =>
        tableCellRender(
          formatNumber(record.valor || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          }),
          'cash',
        ),
    },
    {
      title: 'Outros',
      key: 'valor',
      width: 130,
      render: record => (
        <span>
          {`${record.valorOutros > 0 ? '+ ' : ''}${formatNumber(
            record.valorOutros || 0,
            {
              style: 'currency',
              currency: getLocaleCurrency(),
            },
          )}`}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: d => (
        <Badge
          color={findFinancialParcelStatus(d.status)?.color}
          text={tableCellRender(
            findFinancialParcelStatus(d.status)?.name,
            'status',
          )}
        />
      ),
    },
    {
      title: 'Retenções',
      dataIndex: 'valorTotalRetencoes',
      width: 120,
      render: val =>
        tableCellRender(
          formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          }),
          'cash',
        ),
    },
    {
      title: 'Liberado',
      dataIndex: 'valorLiberacao',
      width: 130,
      render: val =>
        tableCellRender(
          formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          }),
          'cash',
        ),
    },
    {
      title: tableTitleRender('Data de liberação'),
      dataIndex: 'dataLiberacao',
      width: 110,
      render: val =>
        val && tableCellRender(moment(val).format('DD/MM/YYYY'), 'date'),
    },
    {
      title: tableTitleRender(
        `Programação de ${isReceive ? 'recebimento' : 'pagamento'}`,
      ),
      dataIndex: 'dataProgramacaoBaixa',
      width: 130,
      render: val =>
        val && tableCellRender(moment(val).format('DD/MM/YYYY'), 'date'),
    },
    {
      title: tableTitleRender(
        `Data de ${isReceive ? 'recebimento' : 'pagamento'}`,
      ),
      key: 'dataBaixa',
      width: 120,
      render: item => (
        <div>
          {item.dataBaixa &&
            item.status === 2 &&
            moment(item.dataBaixa).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      title: isReceive ? 'Recebido' : 'Pago',
      key: 'paid',
      width: 130,
      render: item => (
        <div>
          {formatNumber((editId && item.valorBaixa) || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </div>
      ),
    },

    {
      title: isReceive ? 'A receber' : 'A pagar',
      dataIndex: 'valorFaltante',
      width: 130,
      render: val =>
        tableCellRender(
          formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          }),
          'cash',
        ),
    },
    {
      title: isReceive
        ? tableTitleRender('Forma de recebimento')
        : tableTitleRender('Forma de pagamento'),
      dataIndex: 'formaBaixaDescricao',
      key: 'formaBaixaDescricao',
      width: 180,
      render: d => <div>{tableCellRender(d)}</div>,
    },
    {
      title: 'C/C',
      dataIndex: 'banco',
      width: 160,
      render: val => tableCellRender(val),
    },
    {
      title: 'Agência',
      dataIndex: 'agenciaConta',
      width: 110,
      render: val => tableCellRender(val, 'number'),
    },
    {
      title: 'Nº Conta',
      dataIndex: 'numeroConta',
      width: 110,
      render: val => tableCellRender(val, 'number'),
    },
    {
      title: tableTitleRender('Data de emissão'),
      dataIndex: 'dataEmissao',
      width: 120,
      render: val =>
        val && tableCellRender(moment(val).format('DD/MM/YYYY'), 'date'),
    },
    {
      align: 'right',
      title: '',
      fixed: 'right',
      render: record => (
        <React.Fragment>
          {record.transacaoBancariaId && hasVisualizeInvoicePermission && (
            <Tooltip placement="top" title="Detalhe do boleto">
              <Button
                shape="circle"
                type="secondary"
                style={{
                  borderColor: findStatus(record.statusTransacaoBancaria)
                    ?.color,
                  borderRadius: 5,
                }}
                className="mr-2 px-1"
                onClick={() =>
                  router.push(
                    `/InvoiceManagement/IssuedInvoice/IssuedInvoiceDetail?id=${record.transacaoBancariaId}&isParcel=true&tags=${tags}&financialTitleType=${financialTitleType}&isNewTitle=true&titleId=${editId}`,
                  )
                }
              >
                <i
                  style={{
                    color: findStatus(record.statusTransacaoBancaria)?.color,
                  }}
                  className="fa fa-barcode fa-lg"
                />
              </Button>
            </Tooltip>
          )}
          <Tooltip
            placement="top"
            title={formatMessage({
              id: 'attachments',
            })}
          >
            <AttachmentsModal
              isTable
              buttonClassName="mr-2 px-1 iconButton"
              entityId={record.id}
              disabled
            />
          </Tooltip>
          <Tooltip
            placement="top"
            title={formatMessage({
              id: 'edit',
            })}
          >
            <Button
              shape="circle"
              className="iconButton"
              onClick={() => showEditParcelModal(record)}
            >
              <i className="fa fa-pencil fa-lg" />
            </Button>
          </Tooltip>
        </React.Fragment>
      ),
    },
  ])
