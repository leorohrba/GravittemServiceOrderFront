import React from 'react'
import TooltipParagraph from '@components/TooltipParagraph'
import { getLocaleCurrency } from '@utils'
import { tableCellRender, tableTitleRender } from '@utils/components'
import { Badge } from 'antd'
import moment from 'moment'
import { formatNumber } from 'umi-plugin-react/locale'

export const titleColumns = (isReceive, findFinancialStatusTitle) =>
  Object.freeze([
    {
      title: 'Título',
      nomeColuna: 'Título',
      dataIndex: 'numero',
      key: 'numero',
      sorter: true,
      fixed: 'left',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Emissão',
      nomeColuna: 'Emissão',
      key: 'dataEmissao',
      dataIndex: 'dataEmissao',
      sorter: true,
      width: 140,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: true,
      padrao: true,
      render: record => (
        <TooltipParagraph>
          {moment(record).format('DD/MM/YYYY')}
        </TooltipParagraph>
      ),
    },
    {
      title: 'Pessoa',
      nomeColuna: 'Pessoa',
      dataIndex: 'nomePessoa',
      key: 'nomePessoa',
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      width: 250,
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Descrição',
      nomeColuna: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      width: 230,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      key: 'statusDescricao',
      width: 150,
      obrigatorio: true,
      padrao: true,
      render: d => (
        <Badge
          color={findFinancialStatusTitle(d.status)?.color}
          text={tableCellRender(
            findFinancialStatusTitle(d.status)?.name,
            'status',
          )}
        />
      ),
    },
    {
      title: 'Valor',
      nomeColuna: 'Valor',
      key: 'valor',
      dataIndex: 'valor',
      sorter: true,
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: true,
      padrao: true,
      render: val => (
        <TooltipParagraph>
          {formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: isReceive ? 'Recebido' : 'Pago',
      nomeColuna: isReceive ? 'Recebido' : 'Pago',
      dataIndex: 'valorBaixado',
      key: 'valorBaixado',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: true,
      padrao: true,
      render: val => (
        <TooltipParagraph>
          {formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: isReceive ? 'A receber' : 'A pagar',
      nomeColuna: isReceive ? 'A receber' : 'A pagar',
      dataIndex: 'valorFaltante',
      key: 'valorFaltante',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: true,
      padrao: true,
      render: val => (
        <TooltipParagraph>
          {formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
  ])

export const parcelColumns = (isReceive, findFinancialParcelStatus) =>
  Object.freeze([
    {
      title: 'Título',
      nomeColuna: 'Título',
      dataIndex: 'tituloNumero',
      key: 'tituloNumero',
      sorter: true,
      showSorterTooltip: false,
      width: 80,
      ellipsis: {
        showTitle: false,
      },
      fixed: 'left',
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Pessoa',
      nomeColuna: 'Pessoa',
      dataIndex: 'pessoaNome',
      key: 'pessoaNome',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: {
        showTitle: false,
      },
      width: 270,
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Descrição',
      nomeColuna: 'Descrição',
      dataIndex: 'tituloDescricao',
      key: 'tituloDescricao',
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Parcela',
      nomeColuna: 'Parcela',
      dataIndex: 'numero',
      key: 'numero',
      sorter: true,
      showSorterTooltip: false,
      width: 80,
      obrigatorio: true,
      padrao: true,
    },
    {
      title: 'Vencimento',
      nomeColuna: 'Vencimento',
      dataIndex: 'dataVencimento',
      sorter: true,
      showSorterTooltip: false,
      width: 110,
      obrigatorio: true,
      ellipsis: {
        showTitle: false,
      },
      padrao: true,
      type: 'date',
      render: (text, val) => (
        <TooltipParagraph>
          {moment(
            val.dataRenegociacao ? val.dataRenegociacao : val.dataVencimento,
          ).format('DD/MM/YYYY')}
        </TooltipParagraph>
      ),
    },
    {
      title: 'Renegociação',
      nomeColuna: 'Renegociação',
      key: 'dataRenegociacao',
      width: 120,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      type: 'date',
      render: val =>
        val.dataRenegociacao && (
          <TooltipParagraph>
            {moment(val.dataVencimento).format('DD/MM/YYYY')}
          </TooltipParagraph>
        ),
    },
    {
      title: 'Valor',
      nomeColuna: 'Valor',
      key: 'valor',
      dataIndex: 'valor',
      sorter: true,
      showSorterTooltip: false,
      width: 130,
      obrigatorio: true,
      ellipsis: {
        showTitle: false,
      },
      padrao: true,
      type: 'value',
      render: valor => (
        <TooltipParagraph>
          {formatNumber(valor, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: 'Outros',
      nomeColuna: 'Outros',
      key: 'valorOutros',
      dataIndex: 'valorOutros',
      sorter: true,
      showSorterTooltip: false,
      width: 130,
      obrigatorio: false,
      ellipsis: {
        showTitle: false,
      },
      padrao: false,
      type: 'value',
      render: valorOutros => (
        <TooltipParagraph>
          {`${valorOutros > 0 ? '+ ' : ''}${formatNumber(valorOutros, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}`}
        </TooltipParagraph>
      ),
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      key: 'statusDescricao',
      width: 150,
      obrigatorio: true,
      padrao: true,
      type: 'status',
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
      nomeColuna: 'Retenções',
      dataIndex: 'valorTotalRetencoes',
      width: 120,
      obrigatorio: false,
      ellipsis: {
        showTitle: false,
      },
      padrao: true,
      type: 'value',
      render: val => (
        <TooltipParagraph>
          {formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: 'Liberado',
      nomeColuna: 'Liberado',
      dataIndex: 'valorLiberacao',
      width: 120,
      obrigatorio: false,
      ellipsis: {
        showTitle: false,
      },
      padrao: false,
      type: 'value',
      render: val => (
        <TooltipParagraph>
          {formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: tableTitleRender('Data de liberação'),
      nomeColuna: 'Data de liberação',
      dataIndex: 'dataLiberacao',
      width: 120,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      type: 'date',
      render: val =>
        val && (
          <TooltipParagraph>
            {moment(val).format('DD/MM/YYYY')}
          </TooltipParagraph>
        ),
    },
    {
      title: tableTitleRender(
        `Programação de ${isReceive ? 'recebimento' : 'pagamento'}`,
      ),
      nomeColuna: `Programação de ${isReceive ? 'recebimento' : 'pagamento'}`,
      dataIndex: 'dataProgramacaoBaixa',
      width: 130,
      obrigatorio: false,
      padrao: false,
      ellipsis: {
        showTitle: false,
      },
      type: 'date',
      render: val =>
        val && (
          <TooltipParagraph>
            {moment(val).format('DD/MM/YYYY')}
          </TooltipParagraph>
        ),
    },
    {
      title: tableTitleRender(
        `Data de ${isReceive ? 'recebimento' : 'pagamento'}`,
      ),
      nomeColuna: `Data de ${isReceive ? 'recebimento' : 'pagamento'}`,
      key: 'dataBaixa',
      width: 120,
      obrigatorio: true,
      ellipsis: {
        showTitle: false,
      },
      padrao: true,
      type: 'date',
      render: item => (
        <TooltipParagraph>
          {item.dataBaixa &&
            item.status === 2 &&
            moment(item.dataBaixa).format('DD/MM/YYYY')}
        </TooltipParagraph>
      ),
    },
    {
      title: isReceive ? 'Recebido' : 'Pago',
      nomeColuna: isReceive ? 'Recebido' : 'Pago',
      dataIndex: 'valorBaixa',
      width: 130,
      obrigatorio: true,
      ellipsis: {
        showTitle: false,
      },
      padrao: true,
      type: 'value',
      render: val => (
        <TooltipParagraph>
          {formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: isReceive ? 'A receber' : 'A pagar',
      nomeColuna: isReceive ? 'A receber' : 'A pagar',
      dataIndex: 'valorFaltante',
      width: 130,
      obrigatorio: true,
      ellipsis: {
        showTitle: false,
      },
      padrao: true,
      type: 'value',
      render: val => (
        <TooltipParagraph>
          {formatNumber(val || 0, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: isReceive
        ? tableTitleRender('Forma de recebimento')
        : tableTitleRender('Forma de pagamento'),
      nomeColuna: isReceive ? 'Forma de recebimento' : 'Forma de pagamento',
      dataIndex: 'formaBaixaDescricao',
      key: 'formaBaixaDescricao',
      ellipsis: {
        showTitle: false,
      },
      width: 180,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'C/C',
      nomeColuna: 'C/C',
      dataIndex: 'banco',
      ellipsis: {
        showTitle: false,
      },
      width: 180,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Agência',
      ellipsis: {
        showTitle: false,
      },
      nomeColuna: 'Agência',
      dataIndex: 'agenciaConta',
      width: 120,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Nº Conta',
      nomeColuna: 'Nº Conta',
      dataIndex: 'numeroConta',
      ellipsis: {
        showTitle: false,
      },
      width: 120,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Centro de custos',
      nomeColuna: 'Centro de custos',
      dataIndex: 'centrosCusto',
      width: 220,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: false,
      padrao: false,
      render: val =>
        val && <TooltipParagraph>{val.split(';').join(', ')}</TooltipParagraph>,
    },
    {
      title: 'Plano de conta',
      nomeColuna: 'Plano de conta',
      dataIndex: 'planosConta',
      ellipsis: {
        showTitle: false,
      },
      width: 220,
      obrigatorio: false,
      padrao: false,
      render: val => (
        <TooltipParagraph>{val.split(';').join(', ')}</TooltipParagraph>
      ),
    },
    {
      title: tableTitleRender('Data de emissão'),
      nomeColuna: 'Data de emissão',
      dataIndex: 'dataEmissao',
      width: 120,
      obrigatorio: true,
      padrao: true,
      ellipsis: {
        showTitle: false,
      },
      type: 'date',
      render: val =>
        val && (
          <TooltipParagraph>
            {moment(val).format('DD/MM/YYYY')}
          </TooltipParagraph>
        ),
    },
    {
      title: 'Documentos',
      nomeColuna: 'Documentos',
      dataIndex: 'documentos',
      width: 220,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: false,
      padrao: true,
      render: val =>
        val && <TooltipParagraph>{val.split(';').join(', ')}</TooltipParagraph>,
    },
  ])
