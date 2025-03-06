export const soStatus = Object.freeze([
  { id: 1, name: 'Criado', color: 'blue' },
  { id: 2, name: 'Agendado', color: 'gold' },
  { id: 3, name: 'Em andamento', color: 'orange', icon: 'hourglass-half' },
  { id: 4, name: 'Em oficina', color: 'volcano' },
  { id: 5, name: 'Aguardando cancelamento', color: 'black' },
  { id: 6, name: 'Canceldo', color: 'gray' },
  { id: 7, name: 'Aguardando conclusão', color: 'lime' },
  { id: 8, name: 'Concluído', color: 'green' },
  { id: 9, name: 'Reaberto', color: 'cyan' },
])

export const schedulingStatus = Object.freeze([
  { id: 1, name: 'Criado', color: 'blue' },
  { id: 2, name: 'Agendado', color: 'gold' },
  { id: 3, name: 'Em oficina', color: 'orange' },
  { id: 4, name: 'Em processo', color: 'volcano' },
  { id: 5, name: 'Concluído', color: 'green' },
  { id: 6, name: 'Cancelado', color: 'gray' },
])

export const servicesStatus = Object.freeze([
  { id: 1, name: 'Utilizado', color: 'green' },
  { id: 2, name: 'Cancelado', color: 'gray' },
])

export const itemStatus = Object.freeze([
  { id: 1, name: 'Pré-diagnóstico', color: 'gold' },
  { id: 2, name: 'Reservado', color: 'blue' },
  { id: 3, name: 'Requisitado', color: 'cyan' },
  { id: 4, name: 'Utilizado', color: 'green' },
  { id: 5, name: 'Faltante', color: 'volcano' },
  { id: 6, name: 'Cancelado', color: 'gray' },
])

export const itemBudgetStatus = Object.freeze([
  { id: 1, name: 'Aguardando aprovação', color: 'orange' },
  { id: 2, name: 'Aprovado', color: 'green' },
  { id: 2, name: 'Reprovado', color: 'red' },
])

export const warrantyStatus = Object.freeze([
  { id: 1, name: 'Aprovado', color: 'green' },
  { id: 2, name: 'Reprovado', color: 'red' },
  { id: 3, name: 'Analisar', color: 'orange' },
])

export const questionnaireStatus = Object.freeze([
  { id: 1, name: 'Pendente', color: 'orange' },
  { id: 2, name: 'Concluído', color: 'green' },
])
