import AddItemModal from './modals/AddItemModal'
import AddParticipantModal from './modals/AddParticipantModal'
import AddPlaceModal from './modals/AddPlaceModal'
import AddServiceModal from './modals/AddServiceModal'
import EditParticipantsModal from './modals/EditParticipantsModal'
import FeaturesModal from './modals/FeaturesModal'
import PreventiveMaintenanceModal from './modals/PreventiveMaintenanceModal'
import ReadjustmentModal from './modals/ReadjustmentModal'
import RenewalModal from './modals/RenewalModal'
import SearchParticipantsModal from './modals/SearchParticipantsModal'
import SearchPlacesModal from './modals/SearchPlacesModal'
import NewContract from './NewContract'
import PlaceStructure from './PlaceStructure'

export default {
  'contract.index.newContract': 'Novo contrato',
  'contract.index.contractNumber': 'N° do contrato',
  'contract.index.contractor': 'Contratante',
  'contract.index.client': 'Contratado',
  'contract.index.validity': 'Vigência',
  'contract.index.status': 'Status',
  'contract.index.noDataHere': 'Não há dados aqui',
  'contract.index.clickToRegister': 'Para cadastrar clique em ',
  ...NewContract,
  ...AddPlaceModal,
  ...SearchPlacesModal,
  ...PreventiveMaintenanceModal,
  ...FeaturesModal,
  ...EditParticipantsModal,
  ...PlaceStructure,
  ...AddParticipantModal,
  ...SearchParticipantsModal,
  ...AddItemModal,
  ...AddServiceModal,
  ...ReadjustmentModal,
  ...RenewalModal,
}
