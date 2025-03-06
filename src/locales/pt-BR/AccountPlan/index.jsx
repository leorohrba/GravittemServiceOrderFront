import AccountPlanApportionment from './AccountPlanApportionment'
import AccountPlanReports from './AccountPlanReports'
import NewAccountPlan from './NewAccountPlan'
import NewAccountPlanApportionment from './NewAccountPlanApportionment'

export default {
  'accountPlan.index.accountPlan': 'Plano de contas',
  'accountPlan.index.unit': 'Unidade',
  'accountPlan.index.newAccountPlan': 'Novo plano de contas',
  'accountPlan.index.reports': 'Relatórios',
  'accountPlan.index.managerial': 'Gerencial',
  'accountPlan.index.key': 'Chave',
  'accountPlan.index.description': 'Descrição',
  'accountPlan.index.type': 'Tipo',
  'accountPlan.index.shortCode': 'Código reduzido',
  'accountPlan.index.status': 'Status',
  'accountPlan.index.active': 'Ativo',
  'accountPlan.index.inactive': 'Inativo',
  'accountPlan.index.revenue': 'Receita',
  'accountPlan.index.expense': 'Despesa',
  ...NewAccountPlan,
  ...AccountPlanReports,
  ...AccountPlanApportionment,
  ...NewAccountPlanApportionment,
}
