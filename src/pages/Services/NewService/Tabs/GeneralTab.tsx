/* eslint-disable consistent-return */
import React, { Fragment, useEffect, useState } from 'react'
import DefaultTable from '@components/DefaultTable'
import { apiContract, apiCRM, apiQuestionnaire } from '@services/api'
import {
  handleAuthError,
  formatCellPhone,
  hasPermission,
  getPermissions,
} from '@utils'
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
} from 'antd'
import moment from 'moment'
import { useNewServiceContext } from '../context/newServiceContext'
import { NewDateAutoComplete } from '@components/refactored'
import CRMPersonModal from '../Modal/CRMPersonModal'
import { notNullUndefined } from '@utils/generics'
import CRMAutoComplete from './components/CRMAutoComplete'
import ClientAutoComplete from './components/ClientAutoComplete'
import { hasSome } from '@utils/rescript/Generics.bs'
import { IInputOption } from '../interfaces/InputOptionInterface'
import { IPartKit } from '../interfaces/PartKitInterface'
import { IClassificationServiceOrder } from '../interfaces/ClassificationServiceOrderInterface'
const { Option } = Select

export default function GeneralTab() {
  const {
    form,
    isSaved,
    questionnairesList,
    setQuestionnairesList,
    selectedQuestionnaire,
    setSelectedQuestionnaire,
    getStatuses,
    statuses,
    clients,
    setClients,
    contractors,
    setContractors,
    clientAddress,
    setClientAddress,
    serviceOrderTypeGuid,
    selectedClassification,
    setSelectedClassification,
    setPersonId,
    serviceOrderLabel,
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
    setSelectedService,
    setServiceEstimatedTime,
    setSelectedKit,
    viewPlace,
    setViewPlace,
    setPartKitIdValue,
    kits,
    getKits,
    scheduleForm,
  } = useNewServiceContext()

  const [selectedRows, setSelectedRows] = useState([])
  const [classifications, setClassifications] = useState([])
  const [serviceChannels, setServiceChannels] = useState([])
  const [services, setServices] = useState([])
  const [priorities, setPriorities] = useState([])
  const [loading, setLoadig] = useState(false)
  const [visibleCRMModal, setVisibleCRMModal] = useState(false)
  const [isNewPerson, setIsNewPerson] = useState(false)
  const [buttonOrigin, setButtonOrigin] = useState('')
  const [isDisabledContractPerson, setIsDisabledContractPerson] = useState(true)
  const [userPermissions, setUserPermissions] = useState([])
  const [sendedMessage, setSendedMessage] = useState(false)
  const columns = [
    { title: 'Ordem', render: (text, record, index) => index + 1 },
    { title: 'Questionário', render: d => d?.questionario?.descricao },
  ]

  const serviceStatuses = [
    { id: 0, description: 'Manutenção Preventiva' },
    { id: 1, description: 'Manutenção corretiva' },
    { id: 2, description: 'Execução de Serviço' },
  ]

  function viewPlaceClient(e) {
    if (e.target.value === 1) {
      setViewPlace(true)
    } else {
      setViewPlace(false)
    }
  }

  function handleContactName() {
    if (selectedContact !== undefined) {
      return selectedContact?.cellPhoneId > 0
        ? formatCellPhone(selectedContact?.cellPhone)
        : selectedContact?.phoneId > 0
        ? formatCellPhone(selectedContact?.phone)
        : selectedContact?.emailId > 0
        ? selectedContact?.email
        : ''
    }
  }

  function handleSelectClientContact(e) {
    setSelectedContact(
      contactsClient?.filter(
        contact => contact?.contactId === form.getFieldValue('clientContact'),
      )[0],
    )
    setResetedForm(false)
  }
  function handleSelectPlaceClientContact(e) {
    setPlaceContactClient(
      contactsClient?.filter(
        contact =>
          contact?.contactId ===
          form.getFieldValue('nomeContatoLocalAtendimento'),
      )[0],
    )
  }

  async function handleGetPermission() {
    setUserPermissions(await getPermissions())
  }

  useEffect(() => {
    getClassifications()
    getStatuses()
    getServiceChannel()
    getServices()
    getKits()
    getQuestionnairesList()
    getPriorities()
    handleGetPermission()
  }, [])

  useEffect(() => {
    form.setFieldsValue({ serviceType: 2 })
  }, [])

  useEffect(() => {
    if (placeContactClient !== undefined) {
      const contactPhone =
        placeContactClient?.phoneId > 0
          ? formatCellPhone(placeContactClient?.phone)
          : placeContactClient?.cellPhoneId > 0
          ? formatCellPhone(placeContactClient?.cellPhone)
          : ''
      form.setFieldsValue({ telefoneLocalAtendimento: contactPhone })
    }
  }, [placeContactClient])

  async function getClassifications() {
    try {
      const {
        data: { sOClassifications },
      } = await apiContract.get(`api/Manufacturer/SOClassificationByOwner`)
      setClassifications(sOClassifications)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter as classificações')
    }
  }

  async function getServiceChannel() {
    try {
      const {
        data: { serviceChannels },
      } = await apiContract.get(`/api/Manufacturer/ServiceChannelsByOwner`)
      setServiceChannels(serviceChannels)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os canais de atendimento')
    }
  }

  async function getServices() {
    try {
      const {
        data: { item },
      } = await apiCRM.get(
        `/api/CRM/Item?type=Service&queryOperator=like&status=1&getPriceList=true`,
      )
      setServices(item)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os serviços')
    }
  }

  function openNewPersonModal() {
    setVisibleCRMModal(true)
    setIsNewPerson(true)
  }

  function validatePersonPermission() {
    if (!hasPermission(userPermissions, 'Include') && !sendedMessage) {
      setSendedMessage(true)
      return message.warn(
        'Usuário sem permissão de incluir. Foi desabilitada a inserção de novas pessoas!',
      )
    }
  }

  function editCRMPerson(origin) {
    if (form.getFieldValue('finalCustomerId') === undefined) {
      message.error('Necessário selecionar um cliente!')
    } else {
      setButtonOrigin(origin)
      setVisibleCRMModal(true)
    }
  }

  const hasSelectedPerson = hasSome(form.getFieldValue('finalCustomerId'))

  async function getPriorities() {
    try {
      const {
        data: { priorities },
      } = await apiContract.get(`/api/Manufacturer/PrioritiesByOwner`)
      setPriorities(priorities)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter as prioridades')
    }
  }

  async function getQuestionnairesList() {
    setLoadig(true)
    try {
      const { data } = await apiQuestionnaire.get(
        '/api/QuestionarioOrdemServico',
        {
          params: {
            TipoOrdemServico: serviceOrderTypeGuid,
            ClassificacaoOSId:
              selectedClassification?.serviceOrderClassificationGuid,
          },
        },
      )
      const newQuestionnairesList = data[0]?.questionarios.filter(quest => {
        const dataVigenciaInicial = new Date(
          quest?.questionario?.dataVigenciaInicial,
        )
        const validDataVigenciaFinal =
          quest?.questionario.dataVigenciaFinal === null
            ? true
            : new Date(quest?.questionario.dataVigenciaFinal) >= new Date()
        if (dataVigenciaInicial <= new Date() && validDataVigenciaFinal) {
          return true
        }
        return false
      })
      setQuestionnairesList(newQuestionnairesList)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os questionários')
    }
    setLoadig(false)
  }

  function handleSelectClient(customerId, selected, option) {
    const client = clients.find(c => c.customerId === customerId)
    setClientAddress(client.personAddresses)
    const adressList = client.personAddresses.filter(
      address => address.typeName === 'SER',
    )
    form.setFieldsValue({
      // placeId: client.personAddresses.find(
      //   address => address.typeName === 'SER',
      // )?.id,
      placeId: adressList.length > 1 ? '' : adressList[0]?.id,
      finalCustomerAddressId: client.personAddresses.find(
        address => address.isStandart,
      )?.id,
    })
    const { responsibleFranchiseeId } = client
    const recordSelected = clients.find(d => d.customerId === customerId)
    setPersonId(recordSelected?.personId)
    setContactsClient(
      clients.filter(
        c => c.customerId === form.getFieldValue('finalCustomerId'),
      )[0]?.personContacts,
    )
    if (notNullUndefined(responsibleFranchiseeId)) {
      // getContractorEdit(responsibleFranchiseeId)
      setResponsibleId(responsibleFranchiseeId)
    }
    validatePersonPermission()
  }

  function handleSelectQuestionnaire(
    questionarioId = form.getFieldValue('questionnaire'),
  ) {
    if (questionarioId) {
      const recordSelected = questionnairesList.filter(
        quest => quest?.questionario?.questionarioId === questionarioId,
      )

      setSelectedQuestionnaire(...recordSelected)
      form.setFieldsValue({ questionnaire: undefined })
    }
  }

  const handlDeleteQuestionnaire = () => {
    // const filteredQuestionnaire = serviceQuestionnaires.filter(
    //   quest => !selectedRows.includes(quest.id),
    // )
    // setServiceQuestionnaires(filteredQuestionnaire)
    // setSelectedRows([])
    setSelectedRows([])
    setSelectedQuestionnaire(undefined)
  }

  const handleSelectClassification = id => {
    const classification = classifications.filter(
      d => d.serviceOrderClassificationId === id,
    )
    setSelectedClassification(...classification)
    form.setFieldsValue({ questionnaire: undefined })
    setSelectedQuestionnaire(undefined)
  }

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRowKey)
    },
  }

  function handleContractPerson() {
    validatePersonPermission()
  }

  function getAddress(address) {
    const addressList = [
      address?.name,
      address?.number,
      address?.neighborhood,
      address?.zipCode,
      address?.cityName,
    ].join()
    const stringfy = `${addressList} - ${address?.stateAbbreviation}`
    return stringfy
  }

  function getClientAddress(address) {
    return getAddress(address)
  }

  useEffect(() => {
    getQuestionnairesList()
  }, [selectedClassification])

  function findSelectedLocation(id) {
    const selectedAddress = clientAddress?.filter(
      address =>
        address.typeName === 'SER' && address.isActive && address?.id === id,
    )[0]
    setAddressString(getAddress(selectedAddress))
  }

  const handleDisabledContractPerson = (e: IInputOption) => {
    setIsDisabledContractPerson(false)
    findSelectedLocation(e.value)
    validatePersonPermission()
  }

  const handleSelectService = (value: IInputOption, estimatedTime: number) => {
    setSelectedService(value)
    setServiceEstimatedTime(estimatedTime)
    scheduleForm.setFieldsValue({
      durationTime: getDurationFromOS(estimatedTime),
    })
  }

  const getDurationFromOS = (estimatedTime: number) => {
    const hours = estimatedTime / 60
    const minutes = estimatedTime % 60
    return moment.utc().hours(hours).minutes(minutes)
  }

  return (
    <>
      <Row gutter={16}>
        <Col md={12}>
          <Form.Item label="Número da ordem de serviço" name="sequenceNumber">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label="Classificação da ordem de serviço"
            name="serviceOrderClassificationId"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              labelInValue
              placeholder="Selecione a classificação da ordem de serviço"
              onChange={e => handleSelectClassification(e?.value)}
              filterOption={(input: string, option: { children: string }) =>
                option.children
                  .toLowerCase()
                  .includes(input.toLocaleLowerCase())
              }
              filterSort={(
                optionA: { children: string },
                optionB: { children: string },
              ) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {classifications
                .filter(
                  (classification: IClassificationServiceOrder) =>
                    classification.permiteAgendamento === true,
                )
                .map((classification: IClassificationServiceOrder) => (
                  <Option
                    value={classification.serviceOrderClassificationId}
                    key={classification.serviceOrderClassificationId}
                  >
                    {classification.serviceOrderClassificationDescription +
                      ' (' +
                      classification.manufacturerName +
                      ')'}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col md={12}>
          <NewDateAutoComplete
            form={form}
            label="Data de abertura"
            fieldName="openDate"
            initialValue={moment()}
            desablePreviosDate={false}
          />
        </Col>
        <Col md={12}>
          <Form.Item
            label="Status"
            name="actStatusId"
            rules={[{ required: true }]}
          >
            <Select disabled>
              {statuses.map(status => (
                <Option value={status.StatusId} key={status.StatusId}>
                  {status.Description}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col md={12}>
          <Form.Item
            label="Tipo de Serviço"
            name="serviceType"
            rules={[{ required: true }]}
          >
            <Select>
              {' '}
              {serviceStatuses.map(status => (
                <Option value={status.id} key={status.id}>
                  {status.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label={
              serviceOrderLabel !== null &&
              serviceOrderLabel?.ChangeServiceOrderExternalNumber !== '' &&
              notNullUndefined(
                serviceOrderLabel?.ChangeServiceOrderExternalNumber,
              )
                ? serviceOrderLabel.ChangeServiceOrderExternalNumber
                : 'Código Externo'
            }
            name="number"
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Col>
      </Row>
      <ClientAutoComplete
        {...{
          form,
          clients,
          setClients,
          handleSelectClient,
          openNewPersonModal,
          userPermissions,
          isDisabledContractPerson,
          editCRMPerson,
          handleSelectClientContact,
          contactsClient,
          resetedForm,
          handleContactName,
          hasSelectedPerson,
        }}
      />

      <Form.Item label="Endereço principal" name="finalCustomerAddressId">
        <Select>
          {clientAddress &&
            clientAddress
              .filter(address => address.isStandart)
              .map(address => (
                <Option value={address.id} key={address.id}>
                  {getAddress(address)}
                </Option>
              ))}
        </Select>
      </Form.Item>

      <Row wrap={true} gutter={3} align="middle" justify="space-between">
        <Col flex={1}>
          <b>Local do atendimento</b>
          <Radio.Group
            className="ml-3 py-2"
            onChange={e => viewPlaceClient(e)}
            value={viewPlace ? 1 : 2}
          >
            <Radio value={1}>Cadastro do Cliente</Radio>
            <Radio value={2}>Apenas na Ordem de Serviço</Radio>
          </Radio.Group>
          {viewPlace ? (
            <Form.Item
              name="finalCustomerAddressServiceId"
              rules={[{ required: true }]}
              initialValue={clientAddress.length > 0 ? clientAddress[0] : null}
            >
              <Select
                placeholder="Digite o nome do local de atendimento"
                showSearch
                labelInValue
                onSelect={(e: IInputOption) => handleDisabledContractPerson(e)}
                filterOption={(input: string, option: { children: string }) =>
                  option.children
                    .toLowerCase()
                    .includes(input.toLocaleLowerCase())
                }
                filterSort={(
                  optionA: { children: string },
                  optionB: { children: string },
                ) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {clientAddress &&
                  clientAddress
                    .filter(
                      address =>
                        address.typeName === 'SER' && address?.isActive,
                    )
                    .map(address => (
                      <Option value={address.id} key={address.id}>
                        {getClientAddress(address)}
                      </Option>
                    ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item name="enderecolocalatendimento">
              <Input />
            </Form.Item>
          )}
        </Col>
        {hasPermission(userPermissions, 'Include') && viewPlace ? (
          <Fragment>
            <Col className="mt-3">
              <Button icon size="small" onClick={() => openNewPersonModal()}>
                <i className="fa fa-file-text-o" aria-hidden="true"></i>
              </Button>
            </Col>

            <Col className="mt-3">
              <Button
                disabled={isDisabledContractPerson}
                icon
                size="small"
                onClick={() => editCRMPerson('Client')}
              >
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </Button>
            </Col>
          </Fragment>
        ) : null}
      </Row>
      <Row gutter={3}>
        <Col span={11}>
          <Form.Item
            label="Nome do contato no local de atendimento"
            name="nomeContatoLocalAtendimento"
          >
            <Select
              placeholder="Informar o nome do responsável pelo local do atendimento"
              onSelect={e => handleSelectPlaceClientContact(e)}
            >
              {contactsClient
                ?.filter(client => client.phoneId > 0 || client.cellPhoneId > 0)
                .map(contact => (
                  <Option value={contact?.contactId} key={contact?.contactId}>
                    {contact?.contactName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col className="ml-1" style={{ paddingTop: '1.9rem' }} flex={11}>
          <Form.Item name="telefoneLocalAtendimento">
            <Input disabled placeholder="Número do Contato" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={3} justify="center">
        <CRMAutoComplete
          {...{
            form,
            contractors,
            setContractors,
            apiCRM,
            handleContractPerson,
            responsibleId,
            getContractorEdit,
            hasPermission,
            userPermissions,
            openNewPersonModal,
            editCRMPerson,
            hasSelectedPerson,
          }}
        />
        <Col className="ml-1" flex={11}>
          <Form.Item
            label="Canal de atendimento"
            name="customerServiceChannelId"
            rules={[{ required: true }]}
          >
            <Select placeholder="Selecione o canal de atendimento">
              {serviceChannels.map(channel => (
                <Option
                  value={channel.customerServiceChannelId}
                  key={channel.customerServiceChannelId}
                >
                  {channel.customerServiceChannelDescription}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col md={12} />
        <Col md={12}>
          <Form.Item
            label="Prioridade"
            name="priorityId"
            rules={[{ required: true }]}
          >
            <Select placeholder="Selecione a prioridade">
              {priorities.map(priority => (
                <Option value={priority.priorityId} key={priority.priorityId}>
                  {priority.priorityDescription}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col md={12}>
          <Form.Item
            label="Serviço"
            name="serviceId"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Digite o nome do serviço"
              showSearch
              labelInValue
              onSelect={(
                value: IInputOption,
                option: { estimatedTime: number },
              ) => handleSelectService(value, option.estimatedTime)}
              filterOption={(input, option: any) =>
                option.children
                  .toLowerCase()
                  .includes(input.toLocaleLowerCase())
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              disabled={isSaved}
            >
              {services.map(service => (
                <Option
                  value={service.itemId}
                  key={service.itemId}
                  estimatedTime={service.estimatedTime}
                >
                  {(service.code ? `${service.code} - ` : '') + service.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label="Distância da base até o local do serviço"
            name="qtKMdeslocamento"
          >
            <InputNumber
              min={0}
              className="w-full"
              placeholder="Digite a distância. Ex: 5km."
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12} className="mb-5 pr-2">
          <Form.Item
            label="Kit - Itens"
            name="partKitId"
            rules={[{ required: false }]}
          >
            <Select
              placeholder="Digite o nome do Kit"
              showSearch
              labelInValue
              allowClear
              onClear={() => {
                setSelectedKit(null)
                setPartKitIdValue(null)
              }}
              onSelect={(item: IInputOption) => {
                setSelectedKit(item)
                setPartKitIdValue(item.value)
                if (notNullUndefined(item.value)) {
                  getKits(item.value)
                }
              }}
              filterOption={(input: string, option: { children: string }) =>
                option.children
                  .toLowerCase()
                  .includes(input.toLocaleLowerCase())
              }
              filterSort={(
                optionA: { children: string },
                optionB: { children: string },
              ) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              disabled={isSaved}
            >
              {kits.map((kit: IPartKit) => (
                <Option value={kit.partKitId} key={kit.partKitId}>
                  {kit.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Descrição do serviço a ser executado"
        name="request"
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Equipamentos" name="equipamentos">
        <Input.TextArea />
      </Form.Item>
      {selectedRows.length > 0 ? (
        <Button
          danger
          icon={<i className="fa fa-trash fa-lg mr-3" />}
          onClick={() => handlDeleteQuestionnaire()}
        >
          Excluir
        </Button>
      ) : (
        <Row gutter={16}>
          <Col span={20}>
            <Form.Item name="questionnaire">
              <Select placeholder="Selecionar questionário" loading={loading}>
                {questionnairesList?.map(quest => (
                  <Option value={quest?.questionario?.questionarioId}>
                    {quest?.questionario?.descricao}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Button type="primary" onClick={() => handleSelectQuestionnaire()}>
            Selecionar
          </Button>
        </Row>
      )}
      <DefaultTable
        className="mt-5"
        dataSource={selectedQuestionnaire ? [selectedQuestionnaire] : []}
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        locale={{
          emptyText: (
            <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
              <i
                className="fa fa-exclamation-circle fa-3x m-5"
                aria-hidden="true"
              />
              <h3>
                Não há dados aqui. Para cadastrar clique em{' '}
                <b>Adicionar questionário.</b>
              </h3>
            </div>
          ),
        }}
      />
      {visibleCRMModal ? (
        <CRMPersonModal
          form={form}
          clients={clients}
          visibleModal={visibleCRMModal}
          setVisibleModal={setVisibleCRMModal}
          isNewPerson={isNewPerson}
          buttonOrigin={buttonOrigin}
        />
      ) : null}
    </>
  )
}
