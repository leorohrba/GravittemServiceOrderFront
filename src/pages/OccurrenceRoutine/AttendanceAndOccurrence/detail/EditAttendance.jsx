/**
 * breadcrumb: Editar atendimento
 * hide: true
 */
import { Form } from '@ant-design/compatible'
import { apiAttendance } from '@services/api'
import {
  fieldsValidationToast,
  getMinutesDuration,
  getPermissions,
  handleAuthError,
  hasPermission,
  showApiMessages,
  formatCellPhone,
} from '@utils'
import { message, Modal, notification, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import NewServiceOrderModal from '../modals/NewServiceOrderModal'
import EditAttendanceFooter from './components/EditAttendanceFooter'
import EditAttendanceForm from './components/EditAttendanceForm'
import EditAttendanceHeader from './components/EditAttendanceHeader'

const { confirm } = Modal

function EditAttendance(props) {
  const { form, attendanceId, location, onClose, isRouter } = props

  const [serviceOrderModalVisible, setServiceOrderModalVisible] = useState(
    false,
  )
  const [keyModal, setKeyModal] = useState(0)
  const [userPermissions, setUserPermissions] = useState([])
  const [tags, setTags] = useState([])
  const [editData, setEditData] = useState(null)
  const [alertMessages, setAlertMessages] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [selectedAssets, setSelectedAssets] = useState([])
  const [assets, setAssets] = useState([])
  const [statuses, setStatuses] = useState([])
  const [priorities, setPriorityes] = useState([])
  const [categories, setCategories] = useState([])
  const [classifications, setClassifications] = useState([])
  const [channels, setChannels] = useState([])
  const [responsibleSource, setResponsibleSource] = useState([])
  const [requesterSource, setRequesterSource] = useState([])

  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [documents, setDocuments] = useState([])

  const [loading, setLoading] = useState(true)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [loadingChannel, setLoadingChannel] = useState(true)
  const [loadingPriority, setLoadingPriority] = useState(true)
  const [loadingCategory, setLoadingCategory] = useState(true)
  const [loadingClassification, setLoadingClassification] = useState(true)
  const [loadingPlace, setLoadingPlace] = useState(false)

  const query = new URLSearchParams(location.search)

  const createLinkedAttendance = query.get('createLinkedAttendance') === 'true'
  const isFromScheduler = query.get('isFromScheduler') === 'true'

  const [formChanged, setFormChanged] = useState(false)

  const [attendanceNumber, setAttendanceNumber] = useState('')
  const refForm = React.useRef()

  useEffect(() => {
    setCanBeUpdated(hasPermission(userPermissions, 'Alter'))
  }, [userPermissions])

  useEffect(() => {
    setFormChanged(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  useEffect(() => {
    form.resetFields()
    setFormChanged(createLinkedAttendance)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    setPermissions()
    refreshForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  useEffect(() => {
    if (
      !loadingClassification &&
      !loadingPriority &&
      !loadingStatus &&
      !loadingChannel &&
      !loadingCategory
    ) {
      setLoading(false)
    }
  }, [
    loadingClassification,
    loadingPriority,
    loadingStatus,
    loadingChannel,
    loadingCategory,
  ])

  function refreshForm() {
    setCanBeUpdated(hasPermission(userPermissions, 'Include'))

    setLoading(true)

    if (attendanceId) {
      getAttendance()
    } else {
      setAttendanceNumber('')
      setRequesterSource([])
      setResponsibleSource([])
      getStatus()
      getPriority()
      getAttendanceClassification()
      getAttendanceChannel()
      getAttendanceCategory()
      setEditData(null)
    }
  }

  const returnAttendances = () => {
    if (isRouter) {
      router.push(
        `/OccurrenceRoutine/AttendanceAndOccurrence${
          isFromScheduler ? '?isFromScheduler=true' : ''
        }`,
      )
    } else {
      onClose()
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
          incluirTodosAtivosCliente: true,
        },
      })
      const { data } = response
      if (data.isOk && data.atendimento.length === 0) {
        setLoading(false)
        message.error('Atendimento não encontrado!')
        returnAttendances()
      } else if (data.isOk) {
        const attendance = data.atendimento[0]
        setAttendanceNumber(attendance.numero)
        getDocuments()
        const status = {
          id: attendance.idStatus,
          descricao: attendance.descricaoStatus,
          cor: attendance.corStatus,
          motivos: [],
        }
        if (attendance.idMotivo) {
          status.motivos.push({
            id: attendance.idMotivo,
            descricao: attendance.descricaoMotivo,
          })
        }
        getStatus(status)
        let priority
        if (attendance.idPrioridade) {
          priority = {
            id: attendance.idPrioridade,
            descricao: attendance.descricaoPrioridade,
            cor: attendance.corPrioridade,
          }
        }
        getPriority(priority)
        let classification
        if (attendance.idClassificacaoAtendimento) {
          classification = {
            id: attendance.idClassificacaoAtendimento,
            descricao: attendance.descricaoClassificacaoAtendimento,
          }
        }
        getAttendanceClassification(classification)
        let attendanceCategories
        if (attendance.idsCategoriasAtendimento?.length > 0) {
          attendanceCategories = attendance.idsCategoriasAtendimento.map(c => ({
            id: c.idCategoriaAtendimento,
            descricao: c.descricaoCategoriaAtendimento,
          }))
        }
        getAttendanceCategory(attendanceCategories)
        let channel
        if (attendance.idCanalAtendimento) {
          channel = {
            id: attendance.idCanalAtendimento,
            descricao: attendance.descricaoCanalAtendimento,
          }
        }
        getAttendanceChannel(channel)
        if (attendance.idSolicitante) {
          setRequesterSource([
            {
              id: attendance.idSolicitante,
              name: attendance.nomeCliente,
              document: attendance.cpfCnpjFormatado,
              personType: attendance.tipoPessoa,
              personId: attendance.idPessoaSolicitante,
            },
          ])
        }
        if (
          attendance.idResponsavelAtendimento ||
          attendance.idGrupoColaborador
        ) {
          setResponsibleSource([
            {
              id: attendance.idResponsavelAtendimento
                ? `p-${attendance.idResponsavelAtendimento}`
                : `g-${attendance.idGrupoColaborador}`,
              name: attendance.nomeResponsavelAtendimento,
            },
          ])
        }
        setEditData(attendance)
        setAssets(attendance.ativos || [])
        setSelectedAssets(
          (attendance.ativos && attendance.ativos.filter(x => x.id)) || [],
        )
        setTags(attendance.tags.map(record => record.descricao))
      } else {
        setLoading(false)
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  async function getAssets(requesterId) {
    setSelectedAssets([])
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtivo`,
        data: {
          idCliente: [requesterId],
          ativo: [true],
        },
      })
      const { data } = response
      if (data.isOk) {
        const assetsSource = data.ativo.map((record, index) => ({
          idAtivo: record.id,
          idCliente: record.idCliente,
          nomeCliente: record.nomeCliente,
          descricaoProduto: record.descricaoProduto,
          numeroSerie: record.numeroSerie,
        }))
        setAssets(assetsSource)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getStatus(status) {
    setLoadingStatus(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/StatusMotivo`,
        params: { status: 1 },
      })
      const { data } = response
      setLoadingStatus(false)
      if (data.isOk) {
        const source = data.statusCadastrado
        if (status) {
          const statusIndex = source.findIndex(x => x.id === status.id)
          if (statusIndex <= -1) {
            source.push(status)
          } else if (status.motivos.length > 0) {
            const reasonIndex = source[statusIndex].motivos.findIndex(
              x => x.id === status.motivos[0].id,
            )
            if (reasonIndex <= -1) {
              source[statusIndex].motivos.push(status.motivos[0])
            }
          }
        }
        setStatuses(source)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingStatus(false)
      handleAuthError(error)
    }
  }

  async function getPriority(priority) {
    setLoadingPriority(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Prioridade`,
        params: { ativo: true },
      })
      const { data } = response
      setLoadingPriority(false)
      if (data.isOk) {
        const source = data.prioridade
        if (priority && source.findIndex(x => x.id === priority.id) <= -1) {
          source.push(priority)
        }
        setPriorityes(source)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingPriority(false)
      handleAuthError(error)
    }
  }

  async function getAttendanceClassification(classification) {
    setLoadingClassification(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/ClassificacaoAtendimento`,
        params: { status: 1 },
      })
      setLoadingClassification(false)
      const { data } = response
      if (data.isOk) {
        const source = data.classificacaoAtendimento
        if (
          classification &&
          source.findIndex(x => x.id === classification.id) <= -1
        ) {
          source.push(classification)
        }
        setClassifications(source)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingClassification(false)
      handleAuthError(error)
    }
  }

  async function getAttendanceChannel(channel) {
    setLoadingChannel(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/CanalAtendimento`,
        params: { ativo: true },
      })
      setLoadingChannel(false)
      const { data } = response
      if (data.isOk) {
        const source = data.canalAtendimento
        if (channel && source.findIndex(x => x.id === channel.id) <= -1) {
          source.push(channel)
        }
        setChannels(source)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingChannel(false)
      handleAuthError(error)
    }
  }

  async function getAttendanceCategory(attendanceCategories) {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/CategoriaAtendimento`,
        params: { status: 1 },
      })
      setLoadingCategory(false)
      const { data } = response
      if (data.isOk) {
        const source = data.categoriaAtendimento
        // eslint-disable-next-line no-unused-expressions
        attendanceCategories?.forEach(category => {
          if (source.findIndex(x => x.id === category.id) <= -1) {
            source.push(category)
          }
        })
        setCategories(source)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingClassification(false)
      handleAuthError(error)
    }
  }

  async function getPersonPlace(personId) {
    setLoadingPlace(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/EnderecoPessoa`,
        params: { idPessoa: personId },
      })
      setLoadingPlace(false)
      const { data } = response
      if (data.isOk) {
        let place = ''
        if (data.enderecoPessoa.length > 0) {
          place = data.enderecoPessoa[0].endereco
        }
        form.setFieldsValue({ place })
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingPlace(false)
      handleAuthError(error)
    }
  }

  async function getDocuments() {
    setLoadingDocuments(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/DocumentoAtendimento`,
        params: { idAtendimento: attendanceId },
      })
      setLoadingDocuments(false)
      const { data } = response
      if (data.isOk) {
        setDocuments(data.documentoAtendimento)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingDocuments(false)
      handleAuthError(error)
    }
  }

  async function getContact(personId) {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/ContatoPessoa`,
        params: { idPessoa: personId },
      })
      const { data } = response
      if (data.isOk) {
        const { contato } = data
        form.setFieldsValue({
          phone: contato.telefone || '',
          email: contato.email,
        })
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function handleSave(
    createLinkedAttendanceAfterSave,
    openServiceOrderAfterSave,
  ) {
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        saveAttendance(
          createLinkedAttendanceAfterSave,
          openServiceOrderAfterSave,
        )
      }
    })
  }

  async function saveAttendance(
    createLinkedAttendanceAfterSave,
    openServiceOrderAfterSave,
  ) {
    setIsSaving(true)
    setLoading(true)

    const responsibleId = form.getFieldValue('responsibleId')
    const idResponsavelAtendimento =
      responsibleId && responsibleId.substr(0, 2) === 'p-'
        ? parseInt(responsibleId.substr(2), 10)
        : null
    const idGrupoColaborador =
      responsibleId && responsibleId.substr(0, 2) === 'g-'
        ? responsibleId.substr(2)
        : null

    const attendanceBody = {
      id: createLinkedAttendance ? null : attendanceId,
      idSolicitante: form.getFieldValue('requesterId'),
      nomeSolicitante: form.getFieldValue('requesterName'),
      telefone: formatCellPhone(form.getFieldValue('phone'), true) || null,
      email: form.getFieldValue('email'),
      idClassificacaoAtendimento: form.getFieldValue('classification'),
      idsCategoriasAtendimento: form.getFieldValue('category'),
      descricao: form.getFieldValue('description'),
      providencia: form.getFieldValue('providence'),
      localAtendimento: form.getFieldValue('place'),
      idResponsavelAtendimento,
      idGrupoColaborador,
      dataAgendamento: form.getFieldValue('scheduleDate')
        ? form.getFieldValue('scheduleDate').format('YYYY-MM-DD')
        : null,
      horarioAgendamento: form.getFieldValue('time')
        ? form.getFieldValue('time').format('YYYY-MM-DDTHH:mm')
        : null,
      duracao: form.getFieldValue('duration')
        ? getMinutesDuration(form.getFieldValue('duration'))
        : null,
      idPrioridade: form.getFieldValue('priority'),
      idCanalAtendimento: form.getFieldValue('channel'),
      idStatus: form.getFieldValue('status'),
      idMotivo: form.getFieldValue('reason'),
      idAtendimentoVinculado: createLinkedAttendance
        ? attendanceId
        : editData
        ? editData.idAtendimentoVinculado
        : null,
      ativos:
        form.getFieldValue('requesterId') === null
          ? []
          : selectedAssets.map(record => ({ idAtivo: record.idAtivo })),
      tags: tags.map(record => ({ descricao: record })),
    }
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/Atendimento`,
        data: attendanceBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        if (createLinkedAttendanceAfterSave) {
          doCreateLinkedAttendance()
        } else if (openServiceOrderAfterSave) {
          openServiceOrder()
        } else {
          returnAttendances()
        }

        if (createLinkedAttendance || !attendanceId) {
          notification.success({
            message: 'Atendimento gerado com sucesso!',
            description: (
              <h3>
                Número de atendimento gerado:
                <b className="ml-2 mr-2">{data.numeroGerado}</b>
              </h3>
            ),
          })
        } else {
          message.success(
            formatMessage({
              id: 'successSave',
            }),
          )
        }
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      handleAuthError(error)
    }
  }

  const onChangeRequester = requesterId => {
    const person = requesterSource.find(x => x.id === requesterId)
    if (person) {
      getPersonPlace(person.personId)
      getContact(person.personId)
    }
    getAssets(requesterId)
  }

  const handleChangeRequesterFromAssets = (source, id) => {
    const person = source.find(x => x.id === id)
    if (person) {
      getPersonPlace(person.personId)
      getContact(person.personId)
    }
  }

  const onChangeAssets = () => {
    setFormChanged(true)
  }

  const confirmCreateLinkedAttendance = () => {
    if (formChanged) {
      confirm({
        title: 'Atenção!',
        content:
          'Deseja salvar as alterações do atendimento antes de prosseguir?',
        onOk: () => {
          handleSave(true, false)
        },
        onCancel: () => {
          doCreateLinkedAttendance()
        },
        cancelText: formatMessage({
          id: 'globalComponents.confirmModal.no',
        }),
        okText: formatMessage({
          id: 'globalComponents.confirmModal.yes',
        }),
        okButtonProps: { size: 'large' },
        cancelButtonProps: { size: 'large' },
      })
    } else {
      doCreateLinkedAttendance()
    }
  }

  function doCreateLinkedAttendance() {
    router.push({
      pathname: isRouter
        ? `/occurrenceRoutine/AttendanceAndOccurrence/detail/${attendanceId}`
        : `/occurrenceRoutine/AttendanceAndOccurrence`,
      query: {
        createLinkedAttendance: true,
        isFromScheduler,
      },
    })
    setFormChanged(true)
    if (refForm.current) {
      refForm.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }
  const confirmOpenServiceOrder = () => {
    if (formChanged) {
      confirm({
        title: 'Atenção!',
        content:
          'Deseja salvar as alterações do atendimento antes de prosseguir?',
        onOk: () => {
          handleSave(false, true)
        },
        onCancel: () => {
          openServiceOrder()
        },
        cancelText: formatMessage({
          id: 'globalComponents.confirmModal.no',
        }),
        okText: formatMessage({
          id: 'globalComponents.confirmModal.yes',
        }),
        okButtonProps: { size: 'large' },
        cancelButtonProps: { size: 'large' },
      })
    } else {
      openServiceOrder()
    }
  }

  const openServiceOrder = () => {
    setServiceOrderModalVisible(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="container" ref={refForm}>
      <NewServiceOrderModal
        serviceOrderModalVisible={serviceOrderModalVisible}
        setServiceOrderModalVisible={setServiceOrderModalVisible}
        attendanceId={attendanceId}
        key={keyModal}
        refreshData={refreshForm}
      />

      <Spin spinning={loading} size="large">
        <EditAttendanceHeader
          attendanceId={attendanceId}
          attendanceNumber={attendanceNumber}
          loading={loading}
          isSaving={isSaving}
          canBeUpdated={canBeUpdated}
          assets={assets}
          form={form}
          setSelectedAssets={setSelectedAssets}
          selectedAssets={selectedAssets}
          requesterSource={requesterSource}
          setRequesterSource={setRequesterSource}
          userPermissions={userPermissions}
          createLinkedAttendance={createLinkedAttendance}
          documents={documents}
          getDocuments={getDocuments}
          loadingDocuments={loadingDocuments}
          returnAttendances={returnAttendances}
          handleChangeRequesterFromAssets={handleChangeRequesterFromAssets}
          onChangeAssets={onChangeAssets}
        />

        <Skeleton
          loading={loading && !isSaving}
          paragraph={{ rows: 15 }}
          active
        />

        <div style={{ display: loading && !isSaving ? 'none' : 'block' }}>
          <EditAttendanceForm
            form={form}
            tags={tags}
            setTags={setTags}
            setResponsibleSource={setResponsibleSource}
            responsibleSource={responsibleSource}
            requesterSource={requesterSource}
            setRequesterSource={setRequesterSource}
            statuses={statuses}
            priorities={priorities}
            categories={categories}
            classifications={classifications}
            refreshForm={refreshForm}
            canBeUpdated={canBeUpdated}
            editData={editData}
            alertMessages={alertMessages}
            loading={loading}
            onChangeRequester={onChangeRequester}
            loadingPlace={loadingPlace}
            channels={channels}
            setFormChanged={setFormChanged}
          />
        </div>

        <EditAttendanceFooter
          formChanged={formChanged}
          handleSave={handleSave}
          isSaving={isSaving}
          canBeUpdated={canBeUpdated}
          hideLinkedAttendanceButton={createLinkedAttendance || !attendanceId}
          hideServiceOrderButton={
            createLinkedAttendance ||
            !attendanceId ||
            (editData && editData.idOrdemServico)
          }
          confirmCreateLinkedAttendance={confirmCreateLinkedAttendance}
          editData={editData}
          openServiceOrder={confirmOpenServiceOrder}
          returnAttendances={returnAttendances}
        />
      </Spin>
    </div>
  )
}

EditAttendance.propTypes = {
  form: PropTypes.any,
  attendanceId: PropTypes.number,
  location: PropTypes.any,
  onClose: PropTypes.func,
  isRouter: PropTypes.bool,
}

const WrappedEditAttendance = Form.create()(EditAttendance)
export default WrappedEditAttendance
