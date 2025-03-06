import { Form } from 'antd'
import constate from 'constate'
import moment from 'moment'
import { useState } from 'react'

function useNewServiceOrder() {
  const [form] = Form.useForm()
  const [showServiceOrderBlock, setShowServiceOrderBlock] = useState(true)
  const [showClientBlock, setShowClientBlock] = useState(true)
  const [showAssetBlock, setShowAssetBlock] = useState(true)
  const [showSchedulingBlock, setShowSchedulingBlock] = useState(true)
  const [showServicesBlock, setShowServicesBlock] = useState(true)
  const [showItemsBlock, setShowItemsBlock] = useState(true)
  const [showWarrantyBlock, setShowWarrantyBlock] = useState(true)
  const [showContractBlock, setShowContractBlock] = useState(true)
  const [showBudgetBlock, setShowBudgetBlock] = useState(true)
  const [showQuestionnaireBlock, setShowQuestionnaireBlock] = useState(true)

  const [visibleResponsibleModal, setVisibleResponsibleModal] = useState(false)
  const [responsible, setResponsible] = useState({
    id: 1,
    nome: 'Resolve Tudo Ltda',
    endereco: 'Rua Iririú, 847 - Saguaçu - Joinville, SC',
    telefone: '47 93137-4196',
  })

  const serviceOrderResume = {
    numero: '4341',
    status: 3,
    prioridade: 'alta',
    data: moment(),
    idade: '3 dias',
  }

  const classifications = [
    {
      id: 1,
      descricao: 'Fora de garantia',
    },
  ]
  const priorities = [
    {
      id: 1,
      descricao: 'Alta',
    },
  ]
  const soTypes = [
    {
      id: 1,
      descricao: 'Padrão',
    },
  ]

  const clientTableData = [
    {
      id: 1,
      nome: 'Pedro Paulo Araújo',
      documento: '89565898556',
      telefone: '(47) 99999-9999',
      principal: true,
      endereco: 'Rua dos Bancários',
      complemento: 'Joinville - SC',
      registros: 3,
      bloqueado: true,
    },
  ]

  const [assetTableData, setAssetTableData] = useState([
    {
      id: 1,
      ativo: '123 - Ar condicionado',
      nSerie: '2342423NA1',
      nf: 'NF-e 0044',
      data: moment(),
      defeitoReclamado: 'Não liga',
      defeitoConstatado: 'Chicote rompido',
    },
  ])

  const [schedulingTableData, setSchedulingTableData] = useState([
    {
      id: 1,
      servico: 'Instalação',
      tecnico: 'Mauro Silva',
      data: moment(),
      periodo: 'Manhã',
      status: 2,
      motivo: 'Agendado',
    },
  ])

  const [visibleServiceModal, setVisibleServiceModal] = useState(false)
  const [servicesTableData, setServicesTableData] = useState([
    {
      id: 1,
      codigo: '003',
      servico: 'Serviço de instalação',
      quantidade: 1,
      valorUnitario: 100,
      desconto: 1,
      porcDesconto: 20,
      total: 25,
      status: 1,
      orcamento: true,
    },
    {
      id: 2,
      codigo: '002',
      servico: 'Reparo de produto',
      quantidade: 1,
      valorUnitario: 50,
      desconto: 1,
      porcDesconto: 20,
      total: 25,
      status: 2,
      orcamento: true,
    },
  ])
  const [servicesResume, setServicesResume] = useState({
    totalPrevisto: 20,
    totalServicos: 20,
    totalDescontos: 5,
    totalParcial: 20,
    valorNovoDesconto: 0,
    porcDesconto: 0,
    total: 20,
  })

  const [visibleItemModal, setVisibleItemModal] = useState(false)
  const [itemsTableData, setItemsTableData] = useState([
    {
      id: 1,
      codigo: '2280',
      descricao: 'Tirante Cristal 22',
      quantidade: 5,
      valorUnitario: 5,
      descontoUnitario: 1,
      porcDesconto: 20,
      total: 25,
      status: 1,
      // orcamento: 1,
    },
  ])
  const [itemsResume, setItemsResume] = useState({
    totalPrevisto: 20,
    totalDescUnitario: 5,
    totalParcial: 20,
    valorNovoDesconto: 0,
    porcDesconto: 0,
    total: 20,
  })

  const [visibleSchedulingModal, setVisibleSchedulingModal] = useState(false)
  const [services, setServices] = useState([
    { id: 1, codigo: '001', servico: 'Serviço de instalação' },
  ])
  const [reasons, setReasons] = useState([])
  const [factory, setFactory] = useState([])
  const [technical, setTechnical] = useState([])
  const [cancelReason, setCancelReason] = useState([])

  const [visibleConfirmOrderModal, setVisibleConfirmOrderModal] = useState(
    false,
  )
  const provider = [
    {
      id: 1,
      descricao: 'Comércio de peças ME',
    },
  ]
  const orderType = [
    {
      id: 1,
      descricao: 'Compra para comercialização',
    },
  ]
  const installment = [
    {
      id: 1,
      descricao: '30 dias',
    },
  ]

  const [visibleAssetModal, setVisibleAssetModal] = useState(false)
  const [visibleSearchAssetModal, setVisibleSearchAssetModal] = useState(false)
  const [assetsTableData, setAssetsTableData] = useState([
    {
      id: 1,
      codigo: '2280',
      descricao: 'Tirante Cristal 22',
    },
  ])

  const [visibleAuditHistoryModal, setVisibleAuditHistoryModal] = useState(
    false,
  )
  const [auditHistory, setAuditHistory] = useState([
    {
      nomeUsuario: 'odair.pereira',
      alteracoes: [
        {
          id: 1,
          propriedade: 'Número de série',
          alteracao: 'inexistente',
          data: moment(),
        },
      ],
    },
  ])
  const [warrantyData, setWarrantyData] = useState([
    {
      id: 1,
      codigo: '001',
      descricao: 'Reparo',
      quantidade: 1,
      valorUnitario: 50,
      total: 50,
      status: 1,
      motivo: '',
      pedido: '',
      nfe: '723',
    },
    {
      id: 2,
      codigo: '002',
      descricao: 'Correia',
      quantidade: 1,
      valorUnitario: 50,
      total: 50,
      status: 2,
      motivo: 'Não se aplica',
      pedido: '',
      nfe: '',
    },
    {
      id: 3,
      codigo: '003',
      descricao: 'Parafuso',
      quantidade: 1,
      valorUnitario: 50,
      total: 50,
      status: 3,
      motivo: '',
      pedido: '',
      nfe: '',
    },
  ])

  const [budgetData, setBudgetData] = useState({
    status: 1,
    values: [
      {
        id: 1,
        descricao: 'Serviços aprovados',
        valor: 10,
        desconto: 0,
        total: 10,
      },
    ],
    totalValue: 10,
    totalDiscount: 0,
    total: 10,
    parcels: [],
  })

  const [visibleQuestionnaireModal, setVisibleQuestionnaireModal] = useState(
    false,
  )
  const [questionnaireData, setQuestionnaireData] = useState([
    {
      id: 1,
      questionario: 'Pesquisa de satisfação',
      status: 1,
      type: 6,
      questions: [
        {
          id: 1,
          question: 'Lorem ipsum dolor sit amet?',
        },
        {
          id: 2,
          question: 'Lorem ipsum dolor sit amet?',
        },
      ],
    },
    {
      id: 2,
      questionario: 'Revisão do ativo',
      status: 2,
      type: 5,
      questions: [
        {
          id: 1,
          question: 'Lorem ipsum dolor sit amet?',
          options: [
            { id: 1, option: 'Lorem ipsum' },
            { id: 2, option: 'Lorem ipsum' },
          ],
        },
        {
          id: 2,
          question: 'Lorem ipsum dolor sit amet?',
          options: [
            { id: 1, option: 'Lorem ipsum' },
            { id: 2, option: 'Lorem ipsum' },
          ],
        },
      ],
    },
  ])

  return {
    form,
    responsible,
    visibleResponsibleModal,
    setVisibleResponsibleModal,
    showServiceOrderBlock,
    showClientBlock,
    showAssetBlock,
    showSchedulingBlock,
    showServicesBlock,
    showItemsBlock,
    showWarrantyBlock,
    showContractBlock,
    showBudgetBlock,
    showQuestionnaireBlock,
    serviceOrderResume,
    classifications,
    priorities,
    soTypes,
    clientTableData,
    assetTableData,
    setAssetTableData,
    schedulingTableData,
    setSchedulingTableData,
    visibleSchedulingModal,
    setVisibleSchedulingModal,
    services,
    reasons,
    factory,
    technical,
    cancelReason,
    visibleServiceModal,
    setVisibleServiceModal,
    servicesTableData,
    setServicesTableData,
    servicesResume,
    setServicesResume,
    visibleItemModal,
    setVisibleItemModal,
    itemsTableData,
    itemsResume,
    setItemsResume,
    visibleConfirmOrderModal,
    setVisibleConfirmOrderModal,
    provider,
    orderType,
    installment,
    visibleAssetModal,
    setVisibleAssetModal,
    visibleSearchAssetModal,
    setVisibleSearchAssetModal,
    assetsTableData,
    setAssetsTableData,
    visibleAuditHistoryModal,
    setVisibleAuditHistoryModal,
    auditHistory,
    warrantyData,
    budgetData,
    setBudgetData,
    questionnaireData,
    visibleQuestionnaireModal,
    setVisibleQuestionnaireModal,
  }
}

const [NewServiceOrderProvider, useNewServiceOrderContext] = constate(
  useNewServiceOrder,
)

export { NewServiceOrderProvider, useNewServiceOrderContext }
