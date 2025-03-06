/* eslint-disable no-useless-return */
import constate from 'constate'
import { useState, useEffect } from 'react'
import {
  apiCRM,
  apiChecklist,
  apiContract,
  apiLayoutGenerator,
  apiMaterialRequest,
  apiSchedule,
} from '@services/api'
import {
  // showApiNotifications,
  showNotifications,
  handleAuthError,
  getPermissions,
  getProcessId,
} from '@utils'
import { Form, message } from 'antd'
import { PdfMakeConfig } from '../../../../components/refactored/print/functions'
import { notNullUndefined } from '@utils/generics'
import { IPartKit } from '../interfaces/PartKitInterface'
import { IInputOption } from '../interfaces/InputOptionInterface'
import {
  getValidadeScheduluBody,
  generateScheduleBody,
  getDateTime,
} from '../utils'
import { getServiceUtils } from '@utils/services'
import { Moment } from 'moment'

function useNewService() {
  const [userPermissions, setUserPermissions] = useState(null)
  const [manufacturerId, setManufacturerId] = useState(null)
  const [serviceOrderTypeId, setServiceOrderTypeId] = useState(null)
  const [serviceOrderTypeGuid, setServiceOrderTypeGuid] = useState(null)
  const [questionnairesList, setQuestionnairesList] = useState([])
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState()
  const [assistants, setAssistants] = useState([])
  const [loadingSave, setLoadingSave] = useState(false)
  const [generatedOSId, setGeneratedOSId] = useState()
  const [generatedOS, setGeneratedOS] = useState(null)
  const [isSaved, setisSaved] = useState(false)
  const [clients, setClients] = useState([])
  const [contractors, setContractors] = useState([])
  const [clientAddress, setClientAddress] = useState([])
  const [generatedDocument, setGeneratedDocument] = useState()
  const [selectedClassification, setSelectedClassification] = useState()
  const [personId, setPersonId] = useState()
  const [statuses, setStatuses] = useState([])
  const [serviceStatus, setServiceStatus] = useState([])
  const [actStatusId, setActStatusId] = useState(null)
  const [visibleItemModal, setVisibleItemModal] = useState(false)
  const [keyModal, setKeyModal] = useState(0)
  const [software, setSoftware] = useState(null)
  const [serviceOrderLabel, setServiceOrderLabel] = useState(null)
  const [resetedForm, setResetedForm] = useState(false)
  const [form] = Form.useForm()
  const [addressString, setAddressString] = useState('')
  const [responsibleId, setResponsibleId] = useState(0)
  const [contactsClient, setContactsClient] = useState()
  const [selectedContact, setSelectedContact] = useState()
  const [placeContactClient, setPlaceContactClient] = useState()
  const [technicals, setTechnicals] = useState([])
  const [scheduleForm] = Form.useForm()
  const [selectedService, setSelectedService] = useState<IInputOption>()
  const [serviceEstimatedTime, setServiceEstimatedTime] = useState<number>(0)
  const [selectedKit, setSelectedKit] = useState<IInputOption>(null)
  const [viewPlace, setViewPlace] = useState(true)
  const [isSchedule, setIsSchedule] = useState(false)
  const [activeKey, setActiveKey] = useState('1')
  const [partKitIdValue, setPartKitIdValue] = useState<number>(null)
  const [kits, setKits] = useState<IPartKit[]>([])
  const [specificKit, setSpecificKit] = useState<IPartKit[]>([])
  const [serviceOrderPartId, setServiceOrderPartId] = useState<number>(0)

  async function getContractorEdit(responsibleFranchiseeId: number) {
    try {
      const response = await apiCRM.get(
        `api/CRM/Person?isSellerActive=true&queryOperator=like&franchiseeId=${responsibleFranchiseeId}&onlyMyOwnerId=false&getDeletedPerson=false&getPersonDetails=true`,
      )
      const { data } = response
      return data.person
    } catch (error) {
      handleAuthError(error)
    }
  }

  const setPermissions = async () => {
    setUserPermissions(await getPermissions())
  }
  const getManufacturersByOwner = async () => {
    try {
      const response = await apiChecklist.get(
        `api/Manufacturer/ManufacturersByOwner`,
      )
      const { data } = response
      if (data.IsOK) {
        setManufacturerId(data.manufacturers[0]?.ManufacturerId ?? null)
      }
    } catch (error) {
      message.error('Não foi possível obter as informações padrão')
    }
  }

  const getServiceOrderTypesByOwner = async () => {
    try {
      const response = await apiChecklist.get(
        `api/BusinessDocument/ServiceOrderTypesByOwner`,
      )
      const { data } = response

      if (data.IsOK) {
        const serviceType =
          data?.ServiceOrderTypes &&
          data?.ServiceOrderTypes.filter(soType => soType.OsServico)[0]
        setActStatusId(serviceType?.StatusInicialPecaPreDiagnostico ?? 0)
        setServiceOrderTypeId(serviceType?.ServiceOrderTypeId ?? 0)
        setServiceOrderTypeGuid(serviceType?.TipoOrdemServicoGuid ?? 0)
        setServiceOrderLabel(serviceType)
      }
    } catch (error) {
      message.error('Não foi possível obter as informações padrão')
    }
  }
  async function getSoftware() {
    const processId = getProcessId()
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/services/Software`,
        params: { processId },
      })
      const { data } = response
      setSoftware(data)
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getStatuses() {
    try {
      const {
        data: { statusByClassDefinition },
      } = await apiChecklist.get(
        `API/BusinessDocument/StatusByClassDefinition?classDefinition=DefaultServiceOrder`,
      )
      statusByClassDefinition.find(x => x.Code == 'CRIA').StatusId = 0
      setStatuses(statusByClassDefinition)
      if (statusByClassDefinition) {
        const statusCode = statusByClassDefinition.find(
          x => x.Code == 'CRIA',
        ).StatusId
        form.setFieldsValue({
          actStatusId: statusCode,
        })
      }
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter o status')
    }
  }

  async function getServiceStatus() {
    try {
      const {
        data: { statusByClassDefinition },
      } = await apiChecklist.get(
        `API/BusinessDocument/StatusByClassDefinition?classDefinition=DefaultServiceOrderService`,
      )

      if (statusByClassDefinition) {
        setServiceStatus(statusByClassDefinition)
      }
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter o status')
    }
  }

  async function handleSave() {
    if (!serviceOrderTypeId) {
      message.error('Tipo de ordem de serviço não encontrado')
      return
    }
    form
      .validateFields()
      .then(values => {
        setLoadingSave(true)
        saveServiceOrder(values)
        getSoftware()
      })
      .catch(err => {
        message.warning('Há campos a serem preenchidos')
      })
  }

  async function sendSchedule(
    date: Moment,
    scheduleTime: Moment,
    technicalId: number,
  ) {
    const body = {
      serviceOrderId: generatedOSId,
      scheduledByHours: true,
      date: getDateTime(date, scheduleTime).format('YYYY-MM-DD HH:mm:ss'),
      periodOfServiceCode: 'C',
      technicalId,
      auxiliarOS: assistants.map(item => item.technicalId),
      auxiliarRoteiro: [],
    }

    const statusDesc = statuses.find(
      (x: { StatusId: number }) =>
        x.StatusId == form.getFieldValue('actStatusId'),
    ).Code

    try {
      const response = await apiContract({
        method: statusDesc == 'CRIA' ? 'POST' : 'PUT',
        url: '/api/Services/ServiceOrderSchedule',
        data: body,
      })
      const { data } = response
      if (data.isOk) {
        const statusCode = statuses.find(x => x.Code == 'AGED').StatusId
        form.setFieldsValue({ actStatusId: statusCode })
        message.success('Agendado com sucesso!')
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  function validateSchedule() {
    scheduleForm.validateFields().then(_ => {
      handleSchedule()
    })
  }

  async function handleSchedule() {
    const selectedClient = clients.find(item => item.personId === personId)
    const selectedResponsible = scheduleForm.getFieldValue('technicalId')
    const technicalSelected = technicals.find(
      item => item.technicalId === selectedResponsible,
    )
    const values = scheduleForm.getFieldsValue()
    const validateScheduleBody = getValidadeScheduluBody(
      values,
      serviceEstimatedTime,
      technicalSelected.personGuid,
      assistants,
    )
    const validateResult = await getServiceUtils(
      '/api/Agenda/ValidaAgendamento',
      null,
      null,
      apiSchedule,
      null,
      validateScheduleBody,
    )

    if (!validateResult?.isOk) {
      validateResult?.notificacoes?.forEach((error: { mensagem: string }) => {
        message.error(error.mensagem)
      })
      return
    }

    const body = generateScheduleBody(
      values,
      serviceEstimatedTime,
      selectedService,
      selectedClient,
      technicalSelected.personGuid,
      generatedOSId,
      selectedClassification?.serviceOrderClassificationId,
      selectedClassification?.serviceOrderClassificationDescription,
      assistants,
    )

    try {
      const response = await apiSchedule({
        url: 'API/Agenda/Agendamento',
        method: 'POST',
        data: body,
      })
      const { data } = response
      if (data.isOk) {
        sendSchedule(values.date, values.scheduleTime, values.technicalId)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const saveServiceOrder = async values => {
    const classification = form.getFieldValue('serviceOrderClassificationId')
    const service = form.getFieldValue('serviceId')
    const validated = values
    const {
      date,
      technicalId,
      openDate,
      finalCustomerAddressServiceId,
      finalCustomerAddressId,
      enderecolocalatendimento,
    } = validated
    delete validated.date
    delete validated.technicalId
    delete validated.questionnaire
    delete validated.openDate
    delete validated.clientContact
    delete validated.nomeContatoLocalAtendimento
    delete validated.serviceOrderClassificationId
    delete validated.serviceId
    delete validated.finalCustomerAddressId
    delete validated.finalCustomerAddressServiceId
    delete validated.enderecolocalatendimentoS
    delete validated.partKitId
    validated.serviceId = service.value
    const serviceStatusCode = statuses.find(
      x => x.StatusId == validated.actStatusId,
    )?.Code
    const noPlace = { ...validated }
    noPlace.StatusId =
      serviceStatus.find(x => x.Code == serviceStatusCode)?.StatusId ?? 0

    const body = [
      {
        serviceOrder: {
          serviceOrderId: generatedOSId,
          manufacturerId: selectedClassification?.manufacturerId,
          serviceOrderTypeId,
          dataCriacao: openDate,
          contatoCliente: selectedContact?.contactName,
          personId,
          questionarioId: selectedQuestionnaire?.questionario?.questionarioId,
          questionarioFixoId: selectedQuestionnaire?.questionario?.idFixo,
          serviceType: 2,
          nomeContatoLocalAtendimento: placeContactClient?.contactName,
          serviceOrderClassificationId: classification.value,
          finalCustomerAddressId: finalCustomerAddressId,
          finalCustomerAddressServiceId: viewPlace
            ? finalCustomerAddressServiceId.value
            : 0,
          enderecolocalatendimento: viewPlace ? enderecolocalatendimento : 0,
          partKitId: partKitIdValue,
          ...validated,
        },
        serviceOrderService: [noPlace],
        serviceOrderAttachments: [],
        serviceOrderFinalCustomerProduct: [],
        serviceOrderProductDefectClaimed: [],
      },
    ]

    try {
      const { data } = await apiContract.post(
        `/api/Services/ServiceOrder`,
        body,
      )
      if (data.isOk) {
        const { serviceOrders } = data
        if (serviceOrders) {
          setGeneratedOSId(serviceOrders[0].serviceOrderId)
          setGeneratedOS(serviceOrders[0])
          form.setFieldsValue({
            sequenceNumber: serviceOrders[0].sequenceNumber,
          })

          if (date && technicalId) {
            const scheduleBody = {
              serviceOrderId: serviceOrders[0].serviceOrderId,
              scheduledByHours: true,
              periodOfServiceCode: 'C',
              auxiliarOS: assistants.map(assistant => assistant?.id),
              auxiliarRoteiro: [],
              date,
              technicalId,
            }

            const responseScheduling = await apiContract.post(
              `/api/Services/ServiceOrderSchedule`,
              scheduleBody,
            )
            if (!responseScheduling.data.isOk) {
              if (responseScheduling.data.notifications?.length > 0) {
                showNotifications(responseScheduling.data.notifications)
              } else {
                message.error(
                  responseScheduling.data.message ||
                    'Erro ao salvar agendamento',
                )
              }
            }
          }

          if (notNullUndefined(selectedKit?.value)) {
            const partKitBody = {
              serviceOrderPart: specificKit[0].partKitParts.map(
                (item: IPartKitPart) => ({
                  serviceOrderPartId: isSaved ? serviceOrderPartId : 0,
                  serviceOrderId: serviceOrders[0].serviceOrderId,
                  partId: item.partId,
                  partCode: item.partCode,
                  partDescription: item.partDescription,
                  stockLocationId: item.stockLocationId,
                  quantity: item.quantity ?? 0,
                  unitValue: item.unitValue ?? 0,
                  discountValue: 0,
                  requestNewItemId: 0,
                  actStatusId: actStatusId,
                  finalCustomerProductId: 0,
                  serviceId: selectedService.value,
                  fctao: 'Replaced',
                  pieceDefectId: 0,
                  receiptBy: 'Consumer',
                  isFromOthers: false,
                  isDevolutionMandatory: item.returnRequired,
                  usedMeasuringUnitId: item.measuringUnitId,
                  purchaseOrderId: 0,
                  priceListId: item.priceListId,
                  partKitId: item.partKitId,
                  partKitPartId: item.partKitPartId,
                  osServico: true,
                }),
              ),
            }

            const responseServiceOrderPart = await apiMaterialRequest.post(
              `/api/Services/ServiceOrderPart`,
              partKitBody,
            )
            if (!responseServiceOrderPart.data.isOk) {
              message.error(
                responseServiceOrderPart.data.message ||
                  'Erro ao salvar as partes da ordem de serviço',
              )
            } else {
              setServiceOrderPartId(
                responseServiceOrderPart.data.idGenerated ?? 0,
              )
            }
          }

          message.info('Salvo com sucesso')
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setisSaved(true)
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingSave(false)
      message.error('Não foi possível salvar as informações')
    }
    setLoadingSave(false)
  }

  async function getKits(id: number = null) {
    try {
      const response = await apiMaterialRequest.get(
        `/api/Stock/PartKit?getPartKitParts=true${
          notNullUndefined(id) ? `&partKitId=${id}` : ''
        }`,
      )
      if (!notNullUndefined(id)) {
        setKits(response.data.partKit)
      } else {
        setSpecificKit(response.data.partKit)
      }
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os kits')
    }
  }

  async function handlePrint(modeloDocumentoId) {
    try {
      const response = await apiLayoutGenerator.get('/api/Documento', {
        params: {
          ModeloDocumentoId: modeloDocumentoId,
          Parametros: 'OrdemServicoId',
          Valores: generatedOSId,
        },
      })
      const { data } = response
      const callBack = value => message.info(value)
      if (data.isOk) {
        setGeneratedDocument(data.documentoGerado)
        PdfMakeConfig({
          documentContent: data.documentoGerado,
          type: 'show',
          callback: callBack,
        })
      }
    } catch (err) {
      handleAuthError(err)
    }
  }

  const newItem = id => {
    setGeneratedOSId(id)
    setKeyModal(keyModal + 1)
    setVisibleItemModal(true)
  }

  const handleCancelForm = () => {
    setIsSchedule(false)
    setisSaved(false)
    form.resetFields()
    scheduleForm.resetFields()
    setResponsibleId(0)
    setGeneratedOSId()
    setClients([])
    setContractors([])
    setClientAddress([])
    setAssistants([])
    setSelectedQuestionnaire(null)
    getStatuses()
    getServiceStatus()
    form.setFieldsValue({ serviceType: 2 })
    setResetedForm(true)
    setActiveKey('1')
    setViewPlace(true)
  }

  useEffect(() => {
    getManufacturersByOwner()
    getServiceOrderTypesByOwner()
    setPermissions()
    getServiceStatus()
  }, [])

  return {
    userPermissions,
    form,
    handleCancelForm,
    manufacturerId,
    setManufacturerId,
    serviceOrderTypeId,
    setServiceOrderTypeId,
    serviceOrderTypeGuid,
    setServiceOrderTypeGuid,
    questionnairesList,
    setQuestionnairesList,
    selectedQuestionnaire,
    setSelectedQuestionnaire,
    assistants,
    setAssistants,
    loadingSave,
    setLoadingSave,
    generatedOSId,
    setGeneratedOSId,
    isSaved,
    setisSaved,
    handleSave,
    handlePrint,
    getStatuses,
    statuses,
    setStatuses,
    clients,
    setClients,
    contractors,
    setContractors,
    clientAddress,
    setClientAddress,
    generatedDocument,
    setGeneratedDocument,
    selectedClassification,
    setSelectedClassification,
    personId,
    setPersonId,
    visibleItemModal,
    setVisibleItemModal,
    newItem,
    keyModal,
    setKeyModal,
    software,
    setSoftware,
    actStatusId,
    setActStatusId,
    generatedOS,
    setGeneratedOS,
    serviceOrderLabel,
    setServiceOrderLabel,
    resetedForm,
    setResetedForm,
    getContractorEdit,
    addressString,
    setAddressString,
    responsibleId,
    setResponsibleId,
    contactsClient,
    setContactsClient,
    selectedContact,
    setSelectedContact,
    placeContactClient,
    setPlaceContactClient,
    handleSchedule,
    technicals,
    setTechnicals,
    scheduleForm,
    validateSchedule,
    selectedService,
    setSelectedService,
    serviceEstimatedTime,
    setServiceEstimatedTime,
    selectedKit,
    setSelectedKit,
    viewPlace,
    setViewPlace,
    isSchedule,
    setIsSchedule,
    activeKey,
    setActiveKey,
    setPartKitIdValue,
    kits,
    setKits,
    getKits,
  }
}

const [NewServiceProvider, useNewServiceContext] = constate(useNewService)
export { NewServiceProvider, useNewServiceContext }
