import CurrentAccountBank from './currentAccountBank'
import CurrentAccountDetail from './modals/currentAccountDetail'
import NewCurrentAccount from './modals/newCurrentAccount'

export default {
  'currentAccount.index.currentAccount': 'Conta Corrente',
  'currentAccount.index.newAccount': 'Nova conta',
  'currentAccount.index.agency': 'Agência',
  'currentAccount.index.unit': 'Unidade',
  'currentAccount.index.currentAccountBalance': 'Saldo atual das contas',
  ...CurrentAccountBank,
  ...CurrentAccountDetail,
  ...NewCurrentAccount,
}
