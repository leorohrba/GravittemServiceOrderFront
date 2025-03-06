import CostCenterApportionment from './CostCenterApportionment'
import CostCenterReports from './CostCenterReports'
import NewCostCenterApportionment from './NewCostCenterApportionment'

export default {
  'costCenter.index.newCostCenter': 'Novo centro de custo',
  'costCenter.index.reports': 'Relatórios',
  'costCenter.index.description': 'Descrição',
  'costCenter.index.status': 'Status',
  'costCenter.index.active': 'Ativo',
  'costCenter.index.inactive': 'Inativo',
  ...CostCenterReports,
  ...CostCenterApportionment,
  ...NewCostCenterApportionment,
}
