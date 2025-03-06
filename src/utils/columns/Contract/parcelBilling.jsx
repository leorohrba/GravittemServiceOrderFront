import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { addBrlCurrencyToNumber, customSort } from '@utils'
import {
  getAddress,
  getAddressComplement,
  getStatusFaturamentoItemRender,
  getStatusFaturamentoRejected,
} from '@pages/Contract/utils'

export const parcelBillingColumns = () =>
  Object.freeze([
    {
      title: 'Contrato',
      nomeColuna: 'Contrato',
      obrigatorio: true,
      width: '100px',
      padrao: true,
      fixed: 'left',
      sorter: (a, b) => customSort(a.contratoNumero, b.contratoNumero),
      render: d => d.contratoNumero,
    },
    {
      title: 'Local de atendimento',
      nomeColuna: 'Local de atendimento',
      obrigatorio: false,
      width: '250px',
      padrao: true,
      sorter: (a, b) => customSort(a.pessoaLocal?.nome, b.pessoaLocal?.nome),
      render: d => (
        <span>
          <p className="mb-0">{d.pessoaLocal?.nome}</p>
          <SmallTableFieldDescription
            label={
              <div>
                {getAddress(d.enderecoLocal)}
                <br />
                {getAddressComplement(d.enderecoLocal)}
              </div>
            }
            fontStyle="italic"
          />
        </span>
      ),
    },
    {
      title: 'Contratante',
      nomeColuna: 'Contratante',
      obrigatorio: true,
      width: '250px',
      padrao: true,
      sorter: (a, b) => customSort(a.contratanteNome, b.contratanteNome),
      render: d => d.contratanteNome,
    },
    {
      title: 'Data de vencimento',
      nomeColuna: 'Data de vencimento',
      width: '100px',
      obrigatorio: true,
      padrao: true,
      sorter: (a, b) => customSort(a.dataVencimento, b.dataVencimento),
      render: d => d.dataVencimentoFormatada,
    },
    {
      title: 'Tipo de financeiro',
      nomeColuna: 'Tipo de financeiro',
      padrao: true,
      width: '150px',
      obrigatorio: false,
      sorter: (a, b) =>
        customSort(a.tipoFinanceiroDescricao, b.tipoFinanceiroDescricao),
      render: d => d.tipoFinanceiroDescricao,
    },
    {
      title: 'Valor a faturar',
      nomeColuna: 'Valor faturar',
      padrao: true,
      width: '150px',
      obrigatorio: true,
      sorter: (a, b) => a?.faturamento?.valor - b?.faturamento?.valor,
      render: d =>
        d.faturamento !== null
          ? addBrlCurrencyToNumber(d.faturamento.valor)
          : '',
    },
    {
      title: 'Status faturamento',
      nomeColuna: 'Status faturamento',
      padrao: true,
      width: '120px',
      obrigatorio: true,
      sorter: (a, b) =>
        customSort(
          a.faturamento?.statusFaturamentoDescricao,
          b.faturamento?.statusFaturamentoDescricao,
        ),
      render: d => getStatusFaturamentoItemRender(d),
    },
    {
      title: 'Valor Cobrança',
      nomeColuna: 'Valor Cobrança',
      padrao: true,
      obrigatorio: false,
      width: '150px',
      sorter: (a, b) => a.cobranca?.valorCobranca - b.cobranca?.valorCobranca,
      render: d =>
        d.cobranca !== null
          ? addBrlCurrencyToNumber(d.cobranca?.valorCobranca)
          : '',
    },
    {
      title: 'Valor Nota Fiscal',
      nomeColuna: 'Valor Nota Fiscal',
      padrao: true,
      width: '150px',
      obrigatorio: false,
      sorter: (a, b) =>
        a.faturamento?.valorFaturado - b.faturamento?.valorFaturado,
      render: d =>
        d.faturamento !== null
          ? addBrlCurrencyToNumber(d.faturamento?.valorFaturado)
          : '',
    },
    {
      title: 'Status Cobrança',
      nomeColuna: 'Status Cobrança',
      padrao: true,
      width: '120px',
      obrigatorio: false,
      sorter: (a, b) =>
        customSort(
          a.cobranca?.statusTransacaoBancaria,
          b.cobranca?.statusTransacaoBancaria,
        ),
      render: d => d.cobranca?.statusTransacaoBancariaDescricao,
    },
    {
      title: 'Status Nota Fiscal',
      nomeColuna: 'Status Nota Fiscal',
      padrao: true,
      width: '120px',
      obrigatorio: false,
      sorter: (a, b) =>
        customSort(
          a.faturamento?.statusNotaFiscalDescricao,
          b.faturamento?.statusNotaFiscalDescricao,
        ),
      render: d =>
        d?.faturamento?.statusNotaFiscal === 'Rejected'
          ? getStatusFaturamentoRejected(d)
          : d?.faturamento?.statusNotaFiscalDescricao,
    },
    {
      title: 'Valor Retenções',
      nomeColuna: 'Valor Retenções',
      padrao: true,
      width: '150px',
      obrigatorio: false,
      sorter: (a, b) =>
        a.notaFiscal?.valorRetencao - b.notaFiscal?.valorRetencao,
      render: d =>
        d.notaFiscal !== null
          ? addBrlCurrencyToNumber(d?.notaFiscal?.valorRetencao)
          : '',
    },
    {
      title: 'Conta Corrente',
      nomeColuna: 'Conta Corrente',
      padrao: true,
      width: '200px',
      obrigatorio: false,
      sorter: true,
      render: d => d?.cobranca?.contaCorrente,
    },
    {
      title: 'Número da Nota Fiscal',
      nomeColuna: 'Numero Nota Fiscal',
      obrigatorio: true,
      width: '200px',
      sorter: (a, b) => customSort(a.notaFiscalNumero, b.notaFiscalNumero),
      render: d =>
        d?.faturamento === null ||
        d?.faturamento?.numeroNotaFiscal === 0 ||
        d?.faturamento?.numeroNotaFiscal === null
          ? ''
          : `${d?.faturamento?.numeroNotaFiscal}`,
      padrao: true,
    },
    {
      title: 'Número do Boleto',
      nomeColuna: 'Numero Boleto',
      obrigatorio: false,
      width: '200px',
      sorter: (a, b) =>
        customSort(a.cobranca?.numeroBoleto, b.cobranca?.numeroBoleto),
      render: d =>
        d?.cobranca?.numeroBoleto === 0 || d?.cobranca?.numeroBoleto === null
          ? ''
          : `${d?.cobranca?.numeroBoleto}`,
      padrao: true,
    },
    {
      title: 'Status Contrato',
      nomeColuna: 'Status Contrato',
      padrao: true,
      width: '120px',
      obrigatorio: false,
      sorter: (a, b) =>
        customSort(a.statusContratoDescricao, b.statusContratoDescricao),
      render: d => d.statusContratoDescricao,
    },
    {
      title: 'Tipo de Contrato',
      nomeColuna: 'Tipo de Contrato',
      padrao: true,
      width: '150px',
      obrigatorio: false,
      sorter: (a, b) =>
        customSort(a.tipoContratoDescricao, b.tipoContratoDescricao),
      render: d => d.tipoContratoDescricao,
    },
    {
      title: 'Número do Título',
      nomeColuna: 'Numero Titulo',
      padrao: true,
      width: '100px',
      obrigatorio: false,
      sorter: (a, b) =>
        customSort(
          a?.cobranca?.tituloFinanceiroNumero,
          b?.cobranca?.tituloFinanceiroNumero,
        ),
      render: d => d?.cobranca?.tituloFinanceiroNumero,
    },
  ])
