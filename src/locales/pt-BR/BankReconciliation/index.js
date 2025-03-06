import Detail from './Detail'
import AccountTransferModal from './modals/AccountTransferModal'
import ConciliationHistoryModal from './modals/ConciliationHistoryModal'
import RegisterPaymentModal from './modals/RegisterPaymentModal'
import SearchPaymentModal from './modals/SearchPaymentModal'
import SearchReceiptModal from './modals/SearchReceiptModal'

export default {
  'bankReconciliation.index.selectAccountAndFile':
    'Para realizar uma conciliação bancária, selecione a conta bancária que deseja conciliar e depois importe um arquivo .ofx.',
  ...Detail,
  ...RegisterPaymentModal,
  ...AccountTransferModal,
  ...SearchPaymentModal,
  ...SearchReceiptModal,
  ...ConciliationHistoryModal,
}
