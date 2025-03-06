/* eslint-disable no-param-reassign */
import { Form } from '@ant-design/compatible'
import { apiAttendance } from '@services/api'
import {
  fieldsValidationToast,
  getMinutesDuration,
  handleAuthError,
  hasPermission,
  showApiMessages,
  formatCellPhone,
} from '@utils'
import {
  Button,
  Col,
  message,
  Modal,
  notification,
  Row,
  Skeleton,
  Spin,
  Tabs,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewAttendanceModalAssets from './NewAttendanceModalAssets'
import NewAttendanceModalGeneral from './NewAttendanceModalGeneral'

// import NewAttendanceModalImages from './NewAttendanceModalImages'

const { TabPane } = Tabs

function NewAttendanceModal({
  form,
  newAttendanceModal,
  setNewAttendanceModal,
  attendanceId,
  userPermissions,
  refreshData,
  newScheduleDate,
  newDuration,
}) {
  // eslint-disable-next-line
  const [selectedAssets, setSelectedAssets] = useState([])
  const [assets, setAssets] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [statuses, setStatuses] = useState([])
  const [priorities, setPriorities] = useState([])
  const [classifications, setClassifications] = useState([])
  const [categories, setCategories] = useState([])
  const [channels, setChannels] = useState([])
  const [responsibleSource, setResponsibleSource] = useState([])
  const [requesterSource, setRequesterSource] = useState([])
  const [alertMessages, setAlertMessages] = useState([])
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [loadingChannel, setLoadingChannel] = useState(true)
  const [loadingPriority, setLoadingPriority] = useState(true)
  const [loadingCategory, setLoadingCategory] = useState(true)
  const [loadingClassification, setLoadingClassification] = useState(true)
  const [loadingPlace, setLoadingPlace] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState('1')

  // const [fileList, setFileList] = useState([])

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

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
    if (attendanceId) {
      getAttendance()
    } else {
      setRequesterSource([])
      setResponsibleSource([])
      getStatus()
      getPriority()
      getAttendanceClassification()
      getAttendanceCategory()
      getAttendanceChannel()
      setEditData(null)
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
        setNewAttendanceModal(false)
      } else if (data.isOk) {
        const attendance = data.atendimento[0]
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
        setPriorities(source)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingPriority(false)
      handleAuthError(error)
    }
  }

  async function getAttendanceClassification(classification) {
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

  async function getAttendanceChannel(channel) {
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

  function handleSave() {
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        saveAttendance()
      }
    })
  }

  async function saveAttendance() {
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
      id: attendanceId,
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
      idAtendimentoVinculado: editData ? editData.idAtendimentoVinculado : null,
      ativos:
        form.getFieldValue('requesterId') === null
          ? []
          : selectedAssets.map(record => ({ idAtivo: record.idAtivo })),
      tags: null,
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
        if (refreshData !== undefined) {
          refreshData()
        }
        setNewAttendanceModal(false)
        if (attendanceId) {
          message.success(
            formatMessage({
              id: 'successSave',
            }),
          )
        } else {
          notification.success({
            message: 'Atendimento gerado com sucesso!',
            description: (
              <h3>
                Número de atendimento gerado:
                <b className="ml-2 mr-2">{data.numeroGerado}</b>
              </h3>
            ),
          })
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

  return (
    <Modal
      title={
        !attendanceId
          ? 'Novo atendimento'
          : canBeUpdated
          ? `Editar atendimento ${editData?.numero ? editData.numero : ''}`
          : `Consultar atendimento ${editData?.numero ? editData.numero : ''}`
      }
      width={780}
      visible={newAttendanceModal}
      centered
      destroyOnClose
      onCancel={() => setNewAttendanceModal(false)}
      footer={
        <Row type="flex" gutter={16}>
          <Col>
            {canBeUpdated && (!loading || (loading && isSaving)) && (
              <Button
                loading={isSaving}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                }}
                onClick={() => handleSave()}
              >
                {formatMessage({ id: 'saveButton' })}
              </Button>
            )}
          </Col>

          <Col className="ml-auto">
            <Button
              type="secondary"
              onClick={() => setNewAttendanceModal(false)}
            >
              {formatMessage({ id: 'cancelButton' })}
            </Button>
          </Col>
        </Row>
      }
    >
      <Skeleton
        loading={loading && !isSaving}
        paragraph={{ rows: 13 }}
        active
      />

      <div style={{ display: loading && !isSaving ? 'none' : 'block' }}>
        <Spin size="large" spinning={loading}>
          <Tabs
            type="card"
            activeKey={activeTabKey}
            onChange={activeKey => setActiveTabKey(activeKey)}
          >
            <TabPane
              tab={formatMessage({
                id:
                  'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.general',
              })}
              key="1"
            >
              <NewAttendanceModalGeneral
                form={form}
                setResponsibleSource={setResponsibleSource}
                responsibleSource={responsibleSource}
                requesterSource={requesterSource}
                setRequesterSource={setRequesterSource}
                statuses={statuses}
                priorities={priorities}
                classifications={classifications}
                categories={categories}
                newAttendanceModal={newAttendanceModal}
                refreshForm={refreshForm}
                canBeUpdated={canBeUpdated}
                editData={editData}
                alertMessages={alertMessages}
                loading={loading}
                onChangeRequester={onChangeRequester}
                loadingPlace={loadingPlace}
                channels={channels}
                setActiveTabKey={setActiveTabKey}
                attendanceId={attendanceId}
                newScheduleDate={newScheduleDate}
                newDuration={newDuration}
              />
            </TabPane>
            <TabPane
              tab={formatMessage({
                id:
                  'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.assets',
              })}
              key="2"
            >
              <NewAttendanceModalAssets
                assets={assets}
                form={form}
                selectedAssets={selectedAssets}
                setSelectedAssets={setSelectedAssets}
                canBeUpdated={canBeUpdated}
                requesterSource={requesterSource}
                setRequesterSource={setRequesterSource}
                userPermissions={userPermissions}
                handleChangeRequesterFromAssets={
                  handleChangeRequesterFromAssets
                }
              />
            </TabPane>
            {/* TODO: Aguardando dominio de imagens ficar pronto
            <TabPane
              tab={formatMessage({
                id:
                  'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.images',
              })}
              key="3"
            >
              <NewAttendanceModalImages
                fileList={fileList}
                setFileList={setFileList}
              />
            </TabPane>
            */}
          </Tabs>
          {editData && (
            <React.Fragment>
              <Row type="flex" justify="end">
                <h5 style={{ color: 'gray' }}>{`Atendimento criado em ${moment(
                  editData.dataInclusao,
                ).format('DD/MM/YYYY HH:mm')} por ${
                  editData.nomeUsuarioInclusao
                }`}</h5>
              </Row>
              {editData.dataAlteracao && (
                <Row type="flex" justify="end">
                  <h5
                    style={{ color: 'gray' }}
                  >{`Última alteração feita em ${moment(
                    editData.dataAlteracao,
                  ).format('DD/MM/YYYY HH:mm')} por ${
                    editData.nomeUsuarioAlteracao
                  }`}</h5>
                </Row>
              )}
            </React.Fragment>
          )}
        </Spin>
      </div>
    </Modal>
  )
}

NewAttendanceModal.propTypes = {
  form: PropTypes.any,
  newAttendanceModal: PropTypes.bool,
  setNewAttendanceModal: PropTypes.any,
  attendanceId: PropTypes.number,
  userPermissions: PropTypes.array,
  refreshData: PropTypes.func,
  newScheduleDate: PropTypes.object,
  newDuration: PropTypes.number,
}

export default Form.create()(NewAttendanceModal)
