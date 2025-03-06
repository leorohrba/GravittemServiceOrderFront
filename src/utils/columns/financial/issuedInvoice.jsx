import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import TooltipParagraph from '@components/TooltipParagraph'
import { getLocaleCurrency } from '@utils'
import { Badge } from 'antd'
import moment from 'moment'
import { formatNumber } from 'umi-plugin-react/locale'

export const issuedInvoiceColumns = findStatus =>
  Object.freeze([
    {
      title: 'Nosso número',
      nomeColuna: 'Nosso número',
      dataIndex: 'numeroRegistro',
      width: 200,
      obrigatorio: true,
      padrao: true,
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Pagador',
      nomeColuna: 'Pagador',
      obrigatorio: true,
      padrao: true,
      ellipsis: {
        showTitle: false,
      },
      render: d => <TooltipParagraph>{d.pagador}</TooltipParagraph>,
    },
    {
      title: 'Valor',
      nomeColuna: 'Valor',
      obrigatorio: true,
      padrao: true,
      render: d =>
        d && (
          <span>
            <p className="mb-0">
              {formatNumber(d.valor, {
                style: 'currency',
                currency: getLocaleCurrency(),
              })}
            </p>
            {moment(d.emissao).isValid() && (
              <SmallTableFieldDescription
                label={`Emitido em ${moment(d.emissao).format('DD/MM/YYYY')}`}
                fontStyle="italic"
              />
            )}
          </span>
        ),
    },
    {
      title: 'Vencimento',
      nomeColuna: 'Vencimento',
      dataIndex: 'vencimento',
      obrigatorio: true,
      padrao: true,
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Pago',
      nomeColuna: 'Pago',
      obrigatorio: true,
      padrao: true,
      render: d =>
        d.valorPago > 0 && (
          <span>
            <p className="mb-0">
              {formatNumber(d.valorPago, {
                style: 'currency',
                currency: getLocaleCurrency(),
              })}
            </p>
            <SmallTableFieldDescription
              label={`Pago em ${moment(d.dataPagamento).format('DD/MM/YYYY')}`}
              fontStyle="italic"
            />
          </span>
        ),
    },
    {
      title: 'Depositado',
      nomeColuna: 'Depositado',
      obrigatorio: true,
      padrao: true,
      render: d =>
        d.valorDepositado > 0 && (
          <span>
            <p className="mb-0">
              {formatNumber(d.valorDepositado, {
                style: 'currency',
                currency: getLocaleCurrency(),
              })}
            </p>
            <SmallTableFieldDescription
              label={`${
                moment(d.dataDeposito) > moment() || d.status !== 3
                  ? 'Previsão de depósito em'
                  : 'Depositado em'
              } ${moment(d.dataDeposito).format('DD/MM/YYYY')}`}
              fontStyle="italic"
            />
          </span>
        ),
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'status',
      obrigatorio: true,
      padrao: true,
      render: d => (
        <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
      ),
    },
    {
      title: 'Remessa',
      nomeColuna: 'Remessa',
      obrigatorio: true,
      padrao: true,
      render: d =>
        d?.ocorrenciaRemessaBancaria?.id !== null && (
          <>
            <SmallTableFieldDescription
              label={
                d?.ocorrenciaRemessaBancaria?.id !== null &&
                `${d?.ocorrenciaRemessaBancaria?.codigo} - ${d?.ocorrenciaRemessaBancaria.descricao}`
              }
              fontStyle="italic"
            />
            <SmallTableFieldDescription
              label={`${moment(d?.dataOcorrenciaRemessa).format('DD/MM/YYYY')}`}
              fontStyle="italic"
            />
          </>
        ),
    },
    {
      title: 'Retorno',
      nomeColuna: 'Retorno',
      obrigatorio: true,
      padrao: true,
      render: d =>
        d?.ocorrenciaRetornoRemessa?.id !== null && (
          <>
            <SmallTableFieldDescription
              label={
                d?.ocorrenciaRetornoRemessa?.id !== null &&
                `${d?.ocorrenciaRetornoRemessa?.codigo} - ${d?.ocorrenciaRetornoRemessa.descricao}`
              }
              fontStyle="italic"
            />
            <SmallTableFieldDescription
              label={`${moment(d?.dataOcorrenciaRetorno).format('DD/MM/YYYY')}`}
              fontStyle="italic"
            />
          </>
        ),
    },
  ])
