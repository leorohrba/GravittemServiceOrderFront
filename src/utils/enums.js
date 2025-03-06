export const documentEnum = Object.freeze([
  {
    id: 1,
    name: 'Ordem de serviço',
    key: 'OrdemServico',
  },
  {
    id: 2,
    name: 'Pedido de compra',
    key: 'PedidoCompra',
  },
  {
    id: 3,
    name: 'Pedido de venda',
    key: 'PedidoVenda',
  },
  {
    id: 4,
    name: 'NFe',
    key: 'NFe',
  },
  {
    id: 5,
    name: 'NFSe',
    key: 'NFSe',
  },
  {
    id: 6,
    name: 'NFCe',
    key: 'NFCe',
  },
  {
    id: 7,
    name: 'SAT CFe',
    key: 'SATCFe',
  },
  {
    id: 8,
    name: 'ECF',
    key: 'ECF',
  },
  {
    id: 9,
    name: 'Conhecimento frete',
    key: 'ConhecimentoFrete',
  },
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