import AddRequisitionItem from './AddRequisitionItem'
import newMaterialRequisition from './NewMaterialRequisition'
import SimilarItems from './modals/SimilarItems'
import RequiredDevolution from './modals/RequiredDevolution'

export default {
  'materialRequest.index.number': 'Número',
  'materialRequest.index.requester': 'Solicitante',
  'materialRequest.index.period': 'Período',
  'materialRequest.index.status': 'Status',
  'materialRequest.index.pending': 'Pendente',
  'materialRequest.index.edit': 'Editar',
  'materialRequest.index.query': 'Consultar',
  'materialRequest.index.searchRequestNumber': 'Buscar número da requisição',
  'materialRequest.index.newRequest': 'Nova requisição',
  ...AddRequisitionItem,
  ...newMaterialRequisition,
  ...SimilarItems,
  ...RequiredDevolution,
}
