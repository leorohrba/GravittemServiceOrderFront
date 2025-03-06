import {
  apiChecklist,
  apiContract,
  apiLayoutGenerator,
  apiQuestionnaire,
} from '@services/api'
import { Button, Form, message, Modal, Row, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import GeneralTab from '../Tabs/GeneralTab'
import SchedulingTab from '../Tabs/SchedulingTab'

const { TabPane } = Tabs

export default function NewServiceModal({ visible, setVisible }) {
  const [form] = Form.useForm()
  const [priorityId, setPriorityId] = useState(null)
  const [manufacturerId, setManufacturerId] = useState(null)
  const [serviceOrderTypeId, setServiceOrderTypeId] = useState(null)
  const [serviceOrderTypeGuid, setServiceOrderTypeGuid] = useState(null)
  const [serviceQuestionnaires, setServiceQuestionnaires] = useState([])
  const [assistants, setAssistants] = useState([])
  const [loadingSave, setLoadingSave] = useState(false)
  const [generatedOSId, setGeneratedOSId] = useState()
  const [isSaved, setisSaved] = useState(false)

  useEffect(() => {
    async function getDefaultFields() {
      try {
        const {
          data: { priorities },
        } = await apiContract.get(`/api/Manufacturer/PrioritiesByOwner`)
        const {
          data: { manufacturers },
        } = await apiChecklist.get(`api/Manufacturer/ManufacturersByOwner`)
        const {
          data: { ServiceOrderTypes },
        } = await apiChecklist.get(
          `api/BusinessDocument/ServiceOrderTypesByOwner`,
        )
        setPriorityId(priorities[0]?.priorityId ?? null)
        setManufacturerId(manufacturers[0]?.ManufacturerId ?? null)
        const serviceType =
          ServiceOrderTypes &&
          ServiceOrderTypes.filter(soType => soType.OsServico)[0]
        setServiceOrderTypeGuid(serviceType?.TipoOrdemServicoGuid)
        setServiceOrderTypeId(serviceType?.ServiceOrderTypeId ?? 0)
      } catch (error) {
        message.error('Não foi possível obter as informações padrão')
      }
    }

    getDefaultFields()
  }, [])

  async function handleSave() {
    const validated = await form.validateFields()
    if (validated) {
      setLoadingSave(true)
      const { scheduling } = validated
      delete validated.scheduling
      delete validated.questionnaire
      delete validated.openDate
      const body = [
        {
          serviceOrder: {
            manufacturerId,
            priorityId,
            serviceOrderTypeId,
            ...validated,
          },
          serviceOrderService: [validated],
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
        const { serviceOrders } = data
        if (serviceOrders) {
          setGeneratedOSId(serviceOrders[0].serviceOrderId)
          form.setFieldsValue({
            sequenceNumber: serviceOrders[0].sequenceNumber,
          })
          if (serviceQuestionnaires.length > 0) {
            const questionnaireBody = {
              status: 1,
              tipoOrdemServicoId: serviceOrderTypeGuid,
              questionarios: serviceQuestionnaires.map(
                (questionnaire, index) => ({
                  questionarioIdFixo: questionnaire.id,
                  numeroOrdenacao: index,
                }),
              ),
            }
            const responseQuestionnaire = await apiQuestionnaire.post(
              `/api/QuestionarioOrdemServico`,
              questionnaireBody,
            )
            if (!responseQuestionnaire.data.isOk) {
              message.error(responseQuestionnaire.data.message)
            }
          }
          if (scheduling && scheduling.date && scheduling.technicalId) {
            const scheduleBody = {
              serviceOrderId: serviceOrders[0].serviceOrderId,
              scheduledByHours: true,
              auxiliarOS: assistants.map(assistant => assistant),
              auxiliarRoteiro: [],
              ...scheduling,
            }
            const responseScheduling = await apiContract.post(
              `/api/Services/ServiceOrderSchedule`,
              scheduleBody,
            )
            if (!responseScheduling.data.isOk) {
              message.error(responseScheduling.data.message)
            }
          }

          message.info(
            'Novo serviço salvo com sucesso. Novas funções foram habilitadas',
          )

          setLoadingSave(false)
          setisSaved(true)
          // setVisible(false)
        }
      } catch (error) {
        setLoadingSave(false)
        message.error('Não foi possível salvar as informações')
      }
    }
  }

  async function handlePrint() {
    const response = await apiLayoutGenerator({
      method: 'GET',
      url: `/api/modelodocumento/liberado`,
      params: { codigo: generatedOSId },
    })
    // eslint-disable-next-line no-console
    console.log(response)
  }

  return (
    <Modal
      title="Novo serviço"
      visible
      bodyStyle={{ paddingTop: 0 }}
      width={600}
      centered
      footer={
        <Row gutter={16}>
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => handleSave()}
            loading={loadingSave}
            disabled={isSaved}
          >
            Salvar
          </Button>
          <Button className="mr-auto" loading={loadingSave}>
            Cancelar
          </Button>
          <Button
            icon={<i className="fa fa-print fa-lg mr-3" />}
            onClick={() => handlePrint(true)}
            loading={loadingSave}
            disabled={!isSaved}
          >
            Imprimir
          </Button>
        </Row>
      }
    >
      <Form layout="vertical" form={form}>
        <Tabs type="card" defaultActiveKey={1}>
          <TabPane tab="Geral" key={1}>
            <GeneralTab
              {...{ form, serviceQuestionnaires, setServiceQuestionnaires }}
            />
          </TabPane>
          <TabPane tab="Agendamento" key={2} forceRender>
            <SchedulingTab {...{ form, assistants, setAssistants }} />
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  )
}
