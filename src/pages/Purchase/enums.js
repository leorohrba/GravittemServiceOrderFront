export const defaultStatus = Object.freeze([
  { id: 1, name: 'Ativo', color: 'green' },
  { id: 2, name: 'Inativo', color: 'red' },
])

export const purchaseStatus = Object.freeze([
  { id: 1, name: 'Pendente', color: 'orange' },
  { id: 2, name: 'Rejeitado', color: 'red' },
  { id: 3, name: 'Cotação', color: 'geekblue' },
  { id: 4, name: 'Pedido', color: 'cyan' },
  { id: 5, name: 'Recebido', color: 'green' },
  { id: 6, name: 'Cancelado', color: 'gray' },
])

export const purchaseOrderStatus = Object.freeze([
  { id: 1, name: 'Pendente', color: 'orange' },
  { id: 2, name: 'Cancelado', color: 'red' },
  { id: 3, name: 'Concluído', color: 'green' },
])

export const quotationAnalysisStatus = Object.freeze([
  { id: 1, name: 'Pendente', color: 'orange' },
  { id: 2, name: 'Recebida', color: 'green' },
])
