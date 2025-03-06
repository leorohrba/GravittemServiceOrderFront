import constate from 'constate'
import moment from 'moment'
import { useState } from 'react'

function useNotificationManagementData() {
  const [documentsModal, setDocumentsModal] = useState(false)
  const [newNotificationModal, setNewNotificationModal] = useState(false)
  const [linkedDocuments, setLinkedDocuments] = useState([
    { id: 1, ordemServico: 'ordem-de-serviço-4366' },
  ])

  const [tags, setTags] = useState([])
  const searchOptions = [
    {
      value: 'remetente',
      label: 'Remetente',
      type: 'search',
    },
  ]
  function startSearch() {}
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([
    {
      id: 1,
      assunto: 'Lorem ipsum dolor sit amet',
      mensagem: 'Horas trabalhadas através de check-in/out',
      remetente: 'All Service',
      icon: 'users',
      data: moment(),
      tipo: 1,
      prioridade: 1,
      documentos: [
        {
          id: 1,
          nome: 'proposta-2248',
        },
        {
          id: 2,
          nome: 'proposta-2248',
        },
      ],
    },
    {
      id: 2,
      assunto: 'Lorem ipsum dolor sit amet',
      mensagem: 'Visualizar cadastro de causa do defeito',
      remetente: 'Clear Channel',
      icon: 'phone',
      data: moment(),
      tipo: 2,
      prioridade: 2,
      lido: true,
    },
  ])

  const [selectedViewType, setSelectedViewType] = useState('sent')

  return {
    tags,
    searchOptions,
    startSearch,
    data,
    editData,
    documentsModal,
    setDocumentsModal,
    newNotificationModal,
    setNewNotificationModal,
    linkedDocuments,
    setLinkedDocuments,
    selectedViewType,
    setSelectedViewType,
  }
}

const [
  NotificationManagementDataProvider,
  useNotificationManagementDataContext,
] = constate(useNotificationManagementData)

export {
  NotificationManagementDataProvider,
  useNotificationManagementDataContext,
}
