import { Form } from '@ant-design/compatible'
import {
  apiAttendance,
  apiChecklist,
  apiContract,
  apiAttachment,
} from '@services/api'
import {
  fieldsValidationToast,
  handleAuthError,
  showApiMessages,
  showApiNotifications,
  showNotifications,
} from '@utils'
import { Button, Col, message, Modal, notification, Row, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { NewServiceOrderModalForm } from './NewServiceOrderModalForm'

function NewServiceOrderModal({
  serviceOrderModalVisible,
  setServiceOrderModalVisible,
  attendanceId,
  form,
  refreshData,
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingAttendance, setLoadingAttendance] = useState(true)
  const [loadingAddress, setLoadingAddress] = useState(true)
  const [loadingManufacturer, setLoadingManufacturer] = useState(true)
  const [loadingServiceOrderType, setLoadingServiceOrderType] = useState(true)
  const [loadingPriority, setLoadingPriority] = useState(true)
  const [loadingClassification, setLoadingClassification] = useState(true)
  const [loadingChannel, setLoadingChannel] = useState(true)
  const [loadingService, setLoadingService] = useState(false)
  const [loadingContract, setLoadingContract] = useState(true)
  const [canBeScheduled, setCanBeScheduled] = useState(true)
  const [scheduledByHours, setScheduledByHours] = useState(false)

  const [technicalSource, setTechnicalSource] = useState([])
  const [attendance, setAttendance] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [manufacturers, setManufacturers] = useState([])
  const [serviceOrderTypes, setServiceOrderTypes] = useState([])
  const [priorities, setPriorities] = useState([])
  const [classifications, setClassifications] = useState([])
  const [channels, setChannels] = useState([])
  const [contracts, setContracts] = useState([])
  const [services, setServices] = useState([])

  useEffect(() => {
    if (
      !loadingContract &&
      !loadingAddress &&
      !loadingAttendance &&
      !loadingManufacturer &&
      !loadingServiceOrderType &&
      !loadingPriority &&
      !loadingClassification &&
      !loadingChannel
    ) {
      setLoading(false)
    }
  }, [
    loadingContract,
    loadingAddress,
    loadingAttendance,
    loadingManufacturer,
    loadingServiceOrderType,
    loadingPriority,
    loadingClassification,
    loadingChannel,
  ])

  useEffect(() => {
    form.resetFields(['request'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance])

  function refreshForm() {
    if (!attendanceId) {
      message.error('Atendimento inválido')
      setServiceOrderModalVisible(false)
    } else {
      form.resetFields()
      getAttendance()
      getManufacturers()
      getServiceOrderTypes()
      getPriorities()
      getClassifications()
      getChannels()
    }
  }

  async function getAttendance() {
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtendimento`,
        data: {
          id: [attendanceId],
          trazerDetalhesAtendimento: true,
          incluirTodosAtivosCliente: false,
        },
      })
      setLoadingAttendance(false)
      const { data } = response
      if (data.isOk && data.atendimento.length === 0) {
        setLoading(false)
        message.error('Atendimento não encontrado!')
        setServiceOrderModalVisible(false)
      } else if (data.isOk) {
        const record = data.atendimento[0]

        if (record.idOrdemServico) {
          setLoading(false)
          notification.error({
            message: 'Atenção!',
            description: `Este atendimento já está vinculado à ordem de servico nº ${record.numeroOrdemServico}`,
          })
          setServiceOrderModalVisible(false)
          return
        }

        if (!record.idSolicitante) {
          setLoading(false)
          notification.error({
            message: 'Atenção!',
            description: (
              <p>
                Atendimento deve ter um solicitante que esteja cadastrado na
                base de clientes para que seja possível gerar uma ordem de
                serviço!
              </p>
            ),
          })
          setServiceOrderModalVisible(false)
          return
        }
        getAddresses(record.idPessoaSolicitante)
        getContracts(record.idPessoaSolicitante)
        setAttendance(record)
        setScheduledByHours(record.agendamentoPorHora)
      } else {
        setLoadingAttendance(false)
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingAttendance(false)
      handleAuthError(error)
    }
  }

  async function getAddresses(personId) {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/EnderecoPessoa`,
        params: { idPessoa: personId },
      })
      setLoadingAddress(false)
      const { data } = response
      if (data.isOk) {
        setAddresses(data.enderecoPessoa)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingAddress(false)
      handleAuthError(error)
    }
  }

  async function getManufacturers() {
    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/Manufacturer/ManufacturersByOwner`,
      })
      setLoadingManufacturer(false)
      const { data } = response
      if (data.IsOK) {
        setManufacturers(data.manufacturers)
      } else {
        message.error(data.Exception)
      }
    } catch (error) {
      setLoadingManufacturer(false)
      handleAuthError(error)
    }
  }

  async function getServiceOrderTypes() {
    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/BusinessDocument/ServiceOrderTypesByOwner`,
      })
      setLoadingServiceOrderType(false)
      const { data } = response
      if (data.IsOK) {
        setServiceOrderTypes(data.ServiceOrderTypes)
      } else {
        message.error(data.Exception)
      }
    } catch (error) {
      setLoadingServiceOrderType(false)
      handleAuthError(error)
    }
  }

  async function getPriorities() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Prioridade`,
        params: { ativo: true, incluirPrioridadeVinculadoFabricante: true },
      })
      const { data } = response
      setLoadingPriority(false)
      if (data.isOk) {
        setPriorities(data.prioridade)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingPriority(false)
      handleAuthError(error)
    }
  }

  async function getClassifications() {
    try {
      const response = await apiContract({
        method: 'GET',
        url: `api/Manufacturer/SOClassificationByOwner`,
      })
      setLoadingClassification(false)
      const { data } = response
      if (data.isOk) {
        setClassifications(data.sOClassifications)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingClassification(false)
      handleAuthError(error)
    }
  }

  async function getChannels() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/CanalAtendimento`,
        params: { ativo: true, incluirCanalVinculadoFabricante: true },
      })
      setLoadingChannel(false)
      const { data } = response
      if (data.isOk) {
        setChannels(data.canalAtendimento)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingChannel(false)
      handleAuthError(error)
    }
  }

  async function getServices(manufacturerId) {
    setLoadingService(true)
    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/Manufacturer/Services`,
        params: { manufacturerId },
      })
      setLoadingService(false)
      const { data } = response
      if (data.IsOK) {
        setServices(data.services)
        form.setFieldsValue({ service: null })
      } else {
        message.error(data.Exception)
      }
    } catch (error) {
      setLoadingService(false)
      handleAuthError(error)
    }
  }

  async function getContracts(personId) {
    try {
      const response = await apiContract({
        method: 'POST',
        url: `api/Contract/ValidConsultContract`,
        data: {
          contractId: null,
          contractNumber: null,
          personId,
          languageId: 1,
        },
      })
      setLoadingContract(false)
      const { data } = response
      if (data.isOk) {
        setContracts(data.contract)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingContract(false)
      handleAuthError(error)
    }
  }

  async function onChangeServiceOrderType(serviceOrderTypeId) {
    try {
      const response = await apiContract({
        method: 'GET',
        url: `api/Services/ServiceOrderTypeCanBeScheduled`,
        params: { serviceOrderTypeId },
      })
      const { data } = response
      if (data.isOk) {
        setCanBeScheduled(data.serviceOrderTypeCanBeScheduled)
      } else {
        setCanBeScheduled(false)
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function handleSubmit() {
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else if (scheduleValidate()) {
        if (
          scheduledByHours &&
          (form.getFieldValue('technicalId') ||
            form.getFieldValue('scheduleDate') ||
            form.getFieldValue('scheduleTime') ||
            form.getFieldValue('period'))
        ) {
          const response = await apiContract({
            method: 'GET',
            url: `/api/Services/ValidateSchedule?startDate=${moment(
              form.getFieldValue('scheduleDate'),
            ).format('YYYY-MM-DD')}T${moment(
              form.getFieldValue('scheduleTime'),
            ).format('HH:mm')}&serviceId=${form.getFieldValue(
              'service',
            )}&technicalId=${form.getFieldValue('technicalId')}`,
          })

          if (response.data.exists) {
            Modal.confirm({
              title: 'Agendamento existente',
              content:
                'Já existe agendamento para o período informado, deseja continuar?',
              okText: 'Sim',
              onOk: saveServiceOrder,
              cancelText: 'Não',
            })
          } else {
            saveServiceOrder()
          }
        } else {
          saveServiceOrder()
        }
      }
    })
  }

  function scheduleValidate() {
    if (!canBeScheduled) {
      return true
    }

    if (
      !form.getFieldValue('technicalId') &&
      !form.getFieldValue('scheduleDate') &&
      (scheduledByHours
        ? !form.getFieldValue('scheduleTime')
        : !form.getFieldValue('period'))
    ) {
      return true
    }

    if (
      !form.getFieldValue('technicalId') ||
      !form.getFieldValue('scheduleDate') ||
      (scheduledByHours
        ? !form.getFieldValue('scheduleTime')
        : !form.getFieldValue('period')) ||
      !form.getFieldValue('service')
    ) {
      notification.error({
        message: 'Atenção!',
        description:
          'Para fazer o agendamento é necessário informar os campos: serviço, técnico, data de agendamento e período!',
      })
      return false
    }

    const scheduleDate = form.getFieldValue('scheduleDate')
    if (scheduleDate.format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
      notification.error({
        message: 'Atenção!',
        description: 'Data de agendamento não pode ser inferior a data atual!',
      })
      return false
    }

    return true
  }

  async function saveServiceOrder() {
    setIsSaving(true)
    setLoading(true)

    const body = [
      {
        serviceOrder: {
          serviceOrderId: 0,
          mobileGeneratedOSId: null,
          originServiceOrderId: null,
          manufacturerId: form.getFieldValue('manufacturer'),
          personId: attendance.idPessoaSolicitante,
          finalCustomerId: attendance.idSolicitante,
          customerServiceChannelId: form.getFieldValue('channel') || 0,
          serviceOrderClassificationId:
            form.getFieldValue('classification') || 0,
          contractId: form.getFieldValue('contract') || 0,
          priorityId: form.getFieldValue('priority') || 0,
          serviceOrderTypeId: form.getFieldValue('serviceOrderType'),
          customerType: 0,
          isStress: false,
          finalCustomerAddressId:
            addresses.length > 0 ? addresses[0].idEnderecoPessoa : 0,
          request: form.getFieldValue('request'),
          finalCustomerProductId:
            attendance.ativos.length > 0 ? attendance.ativos[0].idAtivo : 0,
          actStatusId: 0,
          actReasonId: 0,
          number: `Atendimento nr. ${attendance.numero}`,
          sequenceNumber: 0,
          serviceOrderAge: 0,
          contractSchedulingId: 0,
          serviceType: form.getFieldValue('serviceType'),
        },
        ServiceOrderAttachments: await getFiles(),
        serviceOrderService: [],
        serviceOrderFinalCustomerProduct: [],
        serviceOrderProductDefectClaimed: [
          /*
          {
            serviceOrderProductDefectClaimedId: 0,
            defectClaimedId: 0,
            finalCustomerProductId: 0
          }
          */
        ],
      },
    ]

    if (form.getFieldValue('service')) {
      body[0].serviceOrderService.push({
        serviceOrderServiceId: 0,
        statusId: 0,
        reasonId: 0,
        serviceId: form.getFieldValue('service'),
        isPending: 0,
        isRequiredProtocol: 0,
        roadMapId: 0,
      })
    }

    attendance.ativos.map(record =>
      body[0].serviceOrderFinalCustomerProduct.push({
        serviceOrderFinalCustomerProductId: 0,
        finalCustomerProductId: record.idAtivo,
        request: attendance.descricao,
      }),
    )

    try {
      const response = await apiContract({
        method: 'POST',
        url: `/api/Services/ServiceOrder`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      const { data } = response
      if (data.isOk && data.ids.length > 0) {
        if (form.getFieldValue('scheduleDate') && canBeScheduled) {
          scheduleServiceOrder(data.ids[0])
        } else {
          saveAttendance(data.ids[0])
        }
      } else {
        setIsSaving(false)
        setLoading(false)
        setServiceOrderModalVisible(false)
        message.error(
          data.message || 'Ocorreu um erro ao gerar a ordem de serviço!',
        )
      }
    } catch (error) {
      setServiceOrderModalVisible(false)
      handleAuthError(error)
    }
  }

  async function getFiles() {
    const response = await apiAttachment.get(`/api/Anexo/${attendance.id}`)
    const { data } = response
    return data?.arquivos?.map(file => ({
      originalFileName: file.nome,
      key: file.chave,
      fileType: file.tipoArquivo,
      size: file.tamanho,
    }))
  }

  async function scheduleServiceOrder(serviceOrderId) {
    const scheduleDate = form.getFieldValue('scheduleDate')
    const scheduleTime = form.getFieldValue('scheduleTime')
    const body = {
      serviceOrderId,
      date: scheduleTime
        ? `${scheduleDate.format('YYYY-MM-DD')}T${scheduleTime.format('HH:mm')}`
        : scheduleDate.format('YYYY-MM-DD'),
      periodOfServiceCode: form.getFieldValue('period'),
      technicalId: form.getFieldValue('technicalId'),
      scheduledByHours,
    }

    try {
      const response = await apiContract({
        method: 'POST',
        url: `/api/Services/ServiceOrderSchedule`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      const { data } = response
      saveAttendance(
        serviceOrderId,
        data.isOk
          ? null
          : data.notifications && data.notifications.length > 0
          ? data.notifications
          : [data.message],
      )
    } catch (error) {
      setServiceOrderModalVisible(false)
      handleAuthError(error)
    }
  }

  async function saveAttendance(serviceOrderId, scheduleNotifications) {
    try {
      const response = await apiAttendance({
        method: 'PUT',
        url: `/api/OrdemServicoAtendimento`,
        data: { idAtendimento: attendanceId, idOrdemServico: serviceOrderId },
      })
      setIsSaving(false)
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        notification.success({
          message: 'Ordem de serviço gerada com sucesso!',
          description: `O número da ordem de serviço é: ${data.numeroGerado}`,
        })
        if (scheduleNotifications) {
          showNotifications(
            scheduleNotifications,
            'Não foi possível fazer o agendamento da OS!',
          )
        }
        setServiceOrderModalVisible(false)
        if (refreshData !== undefined) {
          refreshData()
        }
      } else {
        setServiceOrderModalVisible(false)
        showApiNotifications(data)
        showApiMessages(data)
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      setServiceOrderModalVisible(false)
      handleAuthError(error)
    }
  }

  return (
    <Modal
      visible={serviceOrderModalVisible}
      destroyOnClose
      centered
      width="50%"
      title="Criar ordem de serviço"
      onCancel={() => setServiceOrderModalVisible(false)}
      footer={
        <Row type="flex">
          <Col>
            <Button
              key="submit"
              loading={isSaving}
              type="primary"
              onClick={handleSubmit}
              htmlType="submit"
              className="formButton"
            >
              Salvar
            </Button>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Button
              key="back"
              onClick={() => setServiceOrderModalVisible(false)}
            >
              Cancelar
            </Button>
          </Col>
        </Row>
      }
    >
      <Spin spinning={loading} size="large">
        <NewServiceOrderModalForm
          scheduledByHours={scheduledByHours}
          serviceOrderModalVisible={serviceOrderModalVisible}
          refreshForm={refreshForm}
          attendance={attendance}
          manufacturers={manufacturers}
          serviceOrderTypes={serviceOrderTypes}
          priorities={priorities}
          classifications={classifications}
          channels={channels}
          loadingService={loadingService}
          services={services}
          getServices={getServices}
          contracts={contracts}
          technicalSource={technicalSource}
          setTechnicalSource={setTechnicalSource}
          form={form}
          onChangeServiceOrderType={onChangeServiceOrderType}
          canBeScheduled={canBeScheduled}
        />
      </Spin>
    </Modal>
  )
}

NewServiceOrderModal.propTypes = {
  form: PropTypes.object,
  serviceOrderModalVisible: PropTypes.bool,
  setServiceOrderModalVisible: PropTypes.func,
  refreshData: PropTypes.func,
  attendanceId: PropTypes.string,
}

export default Form.create()(NewServiceOrderModal)
