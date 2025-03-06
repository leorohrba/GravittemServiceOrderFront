import AccountPay from './accountPay/index'
import AccountPlan from './AccountPlan/index'
import AccountReceive from './accountReceive/index'
import BankReconciliation from './BankReconciliation/index'
import CashFlow from './cashFlow/index'
import Check from './check/index'
import Contract from './Contract/index'
import ContractClassification from './ContractClassification/index'
import CostCenter from './CostCenter/index'
import CurrentAccount from './currentAccount/index'
import CurrentAccountTransfer from './currentAccountTransfer/index'
import DRE from './DRE/index'
import FinancialDashboard from './FinancialDashboard/index'
import InstallmentCondition from './InstallmentCondition/index'
import MaterialRequest from './materialRequest/index'
import OccurrenceRoutine from './OccurrenceRoutine/index'
import Person from './person/index'
import ServiceOrderParts from './ServiceOrder/ServiceOrderParts'
import ServiceOrderConfiguration from './ServiceOrderConfiguration/index'
import WriteOffMethod from './WriteOffMethod/index'

export default {
  ...MaterialRequest,
  ...CurrentAccountTransfer,
  ...CurrentAccount,
  ...AccountReceive,
  ...AccountPay,
  ...DRE,
  ...CashFlow,
  ...Person,
  ...Check,
  ...BankReconciliation,
  ...CostCenter,
  ...AccountPlan,
  ...FinancialDashboard,
  ...Contract,
  ...ServiceOrderParts,
  ...WriteOffMethod,
  ...InstallmentCondition,
  ...ContractClassification,
  ...OccurrenceRoutine,
  ...ServiceOrderConfiguration,
}
