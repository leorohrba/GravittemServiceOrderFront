import NewClient from './newClient'
import ImportExcel from './modals/importExcel'
import AddDocument from './modals/addDocument'
import AddContact from './modals/addContact'
import AddAddress from './modals/addAddress'
import HistoryModal from './modals/historyModal'
import ComplementaryDataModal from './modals/complementaryDataModal'
import LinkedEntriesModal from './modals/linkedEntriesModal'

export default {
  'person.index.newClient': 'Novo cliente',
  'person.index.name': 'Nome',
  'person.index.address': 'Endereço',
  'person.index.contact': 'Contato',
  'person.index.status': 'Status',
  'person.index.latestRegistered': 'Últimos cadastrados',
  'person.index.noDataMessage':
    'Não há dados aqui. Para cadastrar clique em Novo ou em Importar.',
  'person.index.active': 'Ativo',
  'person.index.inactive': 'Inativo',
  'person.index.blocked': 'Bloqueado',
  'person.index.registersWithThisDocument':
    ' registros encontrados com esse CPF.',
  'person.index.clickForDetails': 'Clique aqui para ver detalhes.',
  'person.index.importError':
    'A importação de clientes apresentou problemas. Acesse o Histórico de Importação para verificar.',
  ...NewClient,
  ...ImportExcel,
  ...AddDocument,
  ...AddContact,
  ...AddAddress,
  ...HistoryModal,
  ...ComplementaryDataModal,
  ...LinkedEntriesModal,
}
