export const costCenterEnum = Object.freeze([
    { color: 'green', id: 1, name: 'Ativo' },
    { color: 'red', id: 2, name: 'Inativo' },
  ])
  
  export const AccountPlanEnum = Object.freeze([
    { color: 'green', id: 1, name: 'Ativo' },
    { color: 'red', id: 2, name: 'Inativo' },
  ])
  export const AccountPlanCategoryEnum = Object.freeze([
    { name: 'Gerencial', value: 1, key: 'Gerencial' },
    { name: 'Categoria', value: 2, key: 'Categoria' },
    { name: 'Contábil', value: 3, key: 'Contabil' },
  ])
  
  export const defaultStatus = Object.freeze([
    { id: 1, name: 'Ativo', color: 'green' },
    { id: 2, name: 'Inativo', color: 'red' },
  ])
  
  export const typeAccountPlan = Object.freeze([
    { id: 1, name: 'Receita', color: 'green' },
    { id: 2, name: 'Despesa', color: 'red' },
  ])
  
  export const accountTransferStatus = Object.freeze([
    { id: 1, name: 'Aguardando autorização', color: 'blue' },
    { id: 2, name: 'Autorizado', color: 'green' },
    { id: 3, name: 'Transferido', color: 'green' },
    { id: 4, name: 'Rejeitado', color: 'red' },
    { id: 5, name: 'Aguardando recuperação', color: 'blue' },
    { id: 7, name: 'Aguardando cancelamento', color: 'blue' },
    { id: 8, name: 'Cancelado', color: 'red' },
  ])
  
  export const groupDRE = Object.freeze([
    { id: 1, name: '1 - Receitas operacionais', key: 'receitasOperacionais' },
    { id: 2, name: '2 - Deduções sobre receita', key: 'deducoesReceitas' },
    { id: 3, name: '3 - Custos operacionais', key: 'custosOperacionais' },
    { id: 4, name: '4 - Despesas gerais', key: 'despesasGerais' },
    {
      id: 5,
      name: '5 - Receitas e despesas não operacionais',
      key: 'receitasDespesasNaoOperacionais',
    },
  ])
  
  export const financialStatusTitle = isReceive =>
    Object.freeze([
      { id: 1, name: 'A vencer', color: 'yellow' },
      { id: 2, name: 'Vencido', color: 'red' },
      { id: 3, name: 'Cancelado', color: 'gray' },
      { id: 4, name: isReceive ? 'Recebido' : 'Pago', color: 'green' },
      { id: 5, name: 'Aguardando cancelamento', color: 'black' },
    ])
  
  export const financialStatusParcel = isReceive =>
    Object.freeze([
      { id: 1, name: 'Cancelado', color: 'gray' },
      { id: 2, name: isReceive ? 'Recebido' : 'Pago', color: 'green' },
      { id: 3, name: 'Liberado', color: 'orange' },
      { id: 4, name: 'A vencer', color: 'yellow' },
      { id: 5, name: 'Vencido', color: 'red' },
      { id: 6, name: 'Aguardando recuperação', color: 'blue' },
      {
        id: 7,
        name: `Aguardando ${isReceive ? 'recebimento' : 'pagamento'}`,
        color: '#663300', // brown,
      },
      {
        id: 8,
        name: 'Aguardando cancelamento',
        color: 'black',
      },
      {
        id: 9,
        name: 'Aguardando depósito',
        color: '#1aa991',
      },
    ])
  
  export const checkStatus = isReceive =>
    Object.freeze([
      { id: 1, name: 'Pendente', color: 'orange' },
      { id: 2, name: isReceive ? 'Recebido' : 'Pago', color: 'green' },
    ])
  
  export const receiptOrPayment = Object.freeze([
    { id: 1, name: 'Recebimento' },
    { id: 2, name: 'Pagamento' },
  ])
  
  export const entryOrExit = Object.freeze([
    { id: 1, name: 'Entrada', key: 'Entrada' },
    { id: 2, name: 'Saída', key: 'Saida' },
  ])
  
  export const transactionType = Object.freeze([
    { id: 1, key: 'Baixa' },
    { id: 2, key: 'Transferencia' },
    { id: 3, key: 'SaldoInicial' },
  ])
  
  export const sefazCode = Object.freeze([
    { id: 1, key: 'Dinheiro', name: 'Dinheiro' },
    { id: 2, key: 'Cheque', name: 'Cheque' },
    { id: 3, key: 'CartaoDeCredito', name: 'Cartão de crédito' },
    { id: 4, key: 'CartaoDeDebito', name: 'Cartão de débito' },
    { id: 5, key: 'CreditoLoja', name: 'Crédito loja' },
    { id: 10, key: 'ValeAlimentacao', name: 'Vale alimentação' },
    { id: 11, key: 'ValeRefeicao', name: 'Vale refeição' },
    { id: 12, key: 'ValePresente', name: 'Vale presente' },
    { id: 13, key: 'ValeCombustivel', name: 'Vale combustível' },
    { id: 14, key: 'DuplicataMercantil', name: 'Duplicata Mercantil' },
    { id: 15, key: 'BoletoBancario', name: 'Boleto bancário' },
    { id: 16, key: 'DepositoBancario', name: 'Depósito Bancário' },
    { id: 17, key: 'PagamentoInstantaneo', name: 'Pagamento Instantâneo (PIX)' },
    {
      id: 18,
      key: 'TransferenciaBancaria',
      name: 'Transferência bancária, Carteira Digital',
    },
    {
      id: 19,
      key: 'ProgramaFidelidade',
      name: 'Programa de fidelidade, Cashback, Crédito Virtual',
    },
    { id: 90, key: 'SemPagamento', name: 'Sem pagamento' },
    { id: 99, key: 'Outros', name: 'Outros' },
  ])
  
  export const dateType = Object.freeze([
    { id: 1, key: 'DataEmissao', name: 'Data de emissão' },
    { id: 2, key: 'DataVencimento', name: 'Data de vencimento' },
    { id: 3, key: 'DataRenegociacao', name: 'Data de renegociação' },
    { id: 4, key: 'Dataliberacao', name: 'Data de liberação' },
    {
      id: 5,
      key: 'DataProgramacaoBaixa',
      name: 'Programação de recebimento ou pagamento',
    },
    { id: 6, key: 'DataBaixa', name: 'Data de recebimento ou pagamento' },
  ])
  
  // enum TipoEntradaOuSaida
  // {
  // 	Entrada = 1,
  // 	Saida = 2
  // }
  
  // all enums
  // enum Condicao
  // {
  // 	Compra = 1,
  // 	Venda = 2
  // }
  
  // enum PlanoContaResultado
  // {
  // 	Financeiro = 1,
  // 	Economico = 2
  // }
  
  // enum StatusCheque
  // {
  // 	Pendente = 1,
  // 	Pago = 2,
  // 	Recebido = 3
  // }
  
  // enum StatusMovimentacaoContaCorrente
  // {
  // 	Conciliado = 1,
  // 	AguardandoConciliacao = 2
  // }
  
  // enum StatusParcela
  // {
  // 	Cancelado = 1,
  // 	Baixado = 2,
  // 	Liberado = 3,
  // 	AVencer = 4,
  // 	Vencido = 5,
  // 	AguardandoRecuperacao = 6
  // }
  
  // enum StatusTituloFinanceiro
  // {
  // 	AVencer = 1,
  // 	Vencido = 2,
  // 	Cancelado = 3,
  // 	Baixado = 4
  // }
  
  // enum StatusTransferencia
  // {
  // 	AguardandoAutorizacao = 1,
  // 	Autorizado = 2,
  // 	Transferido = 3,
  // 	Rejeitado = 4,
  // 	AguardandoRecuperacao = 5,
  // 	Recuperado = 6,
  // 	AguardandoCancelamento = 7,
  // 	Cancelado = 8
  // }
  
  // enum TipoGrupoDre
  // {
  // 	ReceitasOperacionais = 1,
  // 	DeducoesSobreReceita = 2,
  // 	CustosMercadoriasServicos = 3,
  // 	DespesasGerais = 4,
  // 	ReceitasEDespesasNaoOperacionais = 5
  // }
  
  // enum TipoPlanoConta
  // {
  // 	Receita = 1,
  // 	Despesa = 2
  // }
  
  // enum TipoRateio
  // {
  // 	PlanoConta = 1,
  // 	CentroCusto = 2
  // }
  
  // enum TipoRecebimentoOuPagamento
  // {
  // 	Recebimento = 1,
  // 	Pagamento = 2
  // }
  