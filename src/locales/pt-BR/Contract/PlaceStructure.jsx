import LinkAssetModal from './modals/LinkAssetModal'
import SearchAssetsModal from './modals/SearchAssetsModal'

export default {
  'contract.placeStructure.place': 'Local',
  'contract.placeStructure.assets': 'Ativos',
  'contract.placeStructure.addStructure': 'Adicionar estrutura',
  'contract.placeStructure.addAsset': 'Adicionar ativo',
  'contract.placeStructure.name': 'Nome',
  'contract.placeStructure.assetDescription': 'Descrição do ativo',
  'contract.placeStructure.serialNumber': 'N° de série',
  'contract.placeStructure.status': 'Status',
  'contract.placeStructure.searchAssets': 'Pesquisar ativos',
  'contract.placeStructure.active': 'Ativo',
  'contract.placeStructure.deleteStructure': 'Excluir estrutura?',
  'contract.placeStructure.deletedStructureWontBePartOfThisLocation':
    'As estruturas excluídas não farão mais parte deste local.',
  'contract.placeStructure.deleteAssets': 'Excluir ativos?',
  'contract.placeStructure.deletedAssetsWontBePartOfThisContract':
    'Os ativos excluídos não farão mais parte deste contrato.',
  ...LinkAssetModal,
  ...SearchAssetsModal,
}
