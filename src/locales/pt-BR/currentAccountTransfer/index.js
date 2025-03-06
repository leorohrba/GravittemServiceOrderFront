import NewAccountTransfer from './NewAccountTransfer'
import StatusHistory from './modals/StatusHistory'
import JustifyModal from './modals/JustifyModal'

export default {
  'currentAccountTransfer.index.currentAccountTransfer':
    'Transferência entre contas correntes',
  'currentAccountTransfer.index.newTransfer': 'Nova transferência',
  'currentAccountTransfer.index.date': 'Data',
  'currentAccountTransfer.index.originAccount': 'Conta de origem',
  'currentAccountTransfer.index.destinationAccount': 'Conta de destino',
  'currentAccountTransfer.index.value': 'Valor',
  'currentAccountTransfer.index.status': 'Status',
  'currentAccountTransfer.index.document': 'Documento',
  'currentAccountTransfer.index.authorized': 'Autorizado',
  'currentAccountTransfer.index.waitingAuthorization': 'Aguardando autorização',
  'currentAccountTransfer.index.waitingCancellation': 'Aguardando cancelamento',
  'currentAccountTransfer.index.waitingRecovery': 'Aguardando recuperação',
  'currentAccountTransfer.index.canceled': 'Cancelado',
  'currentAccountTransfer.index.transfered': 'Transferido',
  'currentAccountTransfer.index.recovered': 'Recuperado',
  'currentAccountTransfer.index.rejected': 'Rejeitado',
  ...NewAccountTransfer,
  ...StatusHistory,
  ...JustifyModal,
}
