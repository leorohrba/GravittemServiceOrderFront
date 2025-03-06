/**
 * breadcrumb: Atendimentos e ocorrências
 */
import { apiAttendance } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  setParamValues,
  showApiMessages,
  showApiNotifications,
} from '@utils'
import { Badge, message, Modal, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import AttendanceStatisticsModal from '../Dashboard/views/modals/AttendanceStatisticsModal'
import AttendanceAndOccurrenceHeader from './components/AttendanceAndOccurrenceHeader'
import AttendanceAndOccurrenceTable from './components/AttendanceAndOccurrenceTable'
import AttendanceAndOccurrenceScheduler from './components/AttendanceAndOcurrenceScheduler'
import NewAttendanceModal from './modals/NewAttendanceModal'
import { prepareAttendanceDataExport } from './utils'
import EditAttendance from './detail/EditAttendance'

const { confirm } = Modal

let params = {}

function AttendanceAndOccurrence(props) {
  const { location } = props

  const [screen, setScreen] = useState('Grid')
  const [searchOptions, setSearchOptions] = useState(
  [
    {
      value: 'numero',
      label: 'Número',
      type: 'search',
      placeholder: 'Informe o número do atendimento',
    },
    {
      value: 'idStatus',
      label: 'Status',
      placeholder: 'Selecione o status',
      type: 'select',
      options: [],
    },
    {
      value: 'nomeSolicitante',
      label: 'Solicitante',
      type: 'search',
      placeholder: 'Informe o nome do solicitante',
    },
    {
      value: 'nomeCliente',
      label: 'Cliente',
      type: 'search',
      placeholder: 'Informe o nome do cliente',
    },
    {
      value: 'nomeResponsavelAtendimento',
      label: 'Responsável',
      type: 'search',
      placeholder: 'Informe a pessoa ou o grupo',
    },
    {
      value: 'dataAgendamento',
      label: 'Data de agendamento',
      type: 'rangeDate',
    },
    {
      value: 'idPrioridade',
      label: 'Prioridade',
      placeholder: 'Selecione a prioridade',
      type: 'select',
      options: [],
    },
    {
      value: 'idClassificacaoAtendimento',
      label: 'Classificação de atendimento',
      placeholder: 'Selecione a classificação de atendimento',
      type: 'select',
      options: [],
    },
    {
      value: 'idCategoriaAtendimento',
      label: 'Categoria de atendimento',
      placeholder: 'Selecione a categoria de atendimento',
      type: 'select',
      options: [],
    },
    {
      value: 'idCanalAtendimento',
      label: 'Canal de atendimento',
      placeholder: 'Selecione o canal de atendimento',
      type: 'select',
      options: [],
    },
    {
      value: 'descricaoMotivo',
      label: 'Motivo',
      type: 'search',
      placeholder: 'Informe o motivo do atendimento',
    },
    {
      value: 'descricao',
      label: 'Descrição',
      type: 'search',
      placeholder: 'Informe a descrição do atendimento',
    },
    {
      value: 'localAtendimento',
      label: 'Local',
      type: 'search',
      placeholder: 'Informe o local do atendimento',
    },
    {
      value: 'tags',
      label: 'Tag',
      type: 'search',
      placeholder: 'Informe as tags de atendimento',
    },
  ])

  const [tags, setTags] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [selectedRows, setSelectedRows] = useState([])
  const [isScheduleView, setIsScheduleView] = useState(false)
  const [newAttendanceModal, setNewAttendanceModal] = useState(false)
  const [attendanceId, setAttendanceId] = useState(null)
  const [keyModal, setKeyModal] = useState(0)
  const [dataExport, setDataExport] = useState([])
  const [data, setData] = useState([])
  const [events, setEvents] = useState([])
  const [newScheduleDate, setNewScheduleDate] = useState(null)
  const [newDuration, setNewDuration] = useState(null)
  const [
    attendanceStatisticsModalVisible,
    setAttendanceStatisticsModalVisible,
  ] = useState(false)

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    setIsScheduleView(query.get('isFromScheduler') === 'true')
  }, [location.search])

  useEffect(() => {
    setPermissions()
    clearParams()
    getOptionsSearchOptions()
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getOptionsSearchOptions() {
    getPriority()
    getStatus()
    getAttendanceChannel()
    getAttendanceClassification()
    getAttendanceCategory()
  }

  useEffect(() => {
    const eventsData = []

    data
      .filter(d => d.dataAgendamento)
      .map(data => {
        const record = data
        record.title = data.descricao
        record.start = moment(data.dataAgendamento).toDate()
        record.end = !data.horarioAgendamento
          ? moment(data.dataAgendamento)
              .add(1, 'days')
              .startOf('day')
              .toDate()
          : moment(data.dataAgendamento)
              .add(data.duracao || 0, 'minutes')
              .toDate()
        eventsData.push(record)
        return true
      })

    setEvents(eventsData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  function clearParams() {
    params = 
    {
      id: [],
      numero: [],
      idPrioridade: [],
      idCanalAtendimento: [],
      nomeSolicitante: [],
      nomeCliente: [],
      descricao: [],
      localAtendimento: [],
      idClassificacaoAtendimento: [],
      idCategoriaAtendimento: [],
      idResponsavelAtendimento: [],
      nomeResponsavelAtendimento: [],
      dataAgendamentoInicial: null,
      dataAgendamentoFinal: null,
      idStatus: [],
      descricaoMotivo: [],
      tags: [],
      listarAtivos: false,
      trazerDetalhesAtendimento: false,
      incluirTodosAtivosCliente: false,
    }
  }

  useEffect(() => {
    setDataExport(prepareAttendanceDataExport(data))
  }, [data])

  async function getStatus() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/StatusMotivo`,
        params: { status: 1 },
      })
      const { data } = response
      if (data.isOk) {
        const index = searchOptions.findIndex(s => s.value === 'idStatus')
        if (index > -1) {
          data.statusCadastrado.map(status =>
            searchOptions[index].options.push({
              label: status.descricao,
              value: status.id,
              render: <Badge color={status.cor} text={status.descricao} />,
            }),
          )
          setSearchOptions([...searchOptions])
        }
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getPriority() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Prioridade`,
        params: { ativo: true },
      })
      const { data } = response
      if (data.isOk) {
        const index = searchOptions.findIndex(s => s.value === 'idPrioridade')
        if (index > -1) {
          data.prioridade.map(prioridade =>
            searchOptions[index].options.push({
              label: prioridade.descricao,
              value: prioridade.id,
              render: (
                <div>
                  <i
                    className="fa fa-exclamation-circle fa-lg mr-3"
                    style={{
                      color: `${prioridade.cor}`,
                    }}
                  />
                  <span>{prioridade.descricao}</span>
                </div>
              ),
            }),
          )
          setSearchOptions([...searchOptions])
        }
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getAttendanceChannel() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/CanalAtendimento`,
        params: { ativo: true },
      })
      const { data } = response
      if (data.isOk) {
        const index = searchOptions.findIndex(
          s => s.value === 'idCanalAtendimento',
        )
        if (index > -1) {
          data.canalAtendimento.map(record =>
            searchOptions[index].options.push({
              label: record.descricao,
              value: record.id,
            }),
          )
          setSearchOptions([...searchOptions])
        }
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getAttendanceClassification() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/ClassificacaoAtendimento`,
        params: { status: 1 },
      })
      const { data } = response
      if (data.isOk) {
        const index = searchOptions.findIndex(
          s => s.value === 'idClassificacaoAtendimento',
        )
        if (index > -1) {
          data.classificacaoAtendimento.map(record =>
            searchOptions[index].options.push({
              label: record.descricao,
              value: record.id,
            }),
          )
          setSearchOptions([...searchOptions])
        }
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  async function getAttendanceCategory() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/CategoriaAtendimento`,
        params: { status: 1 },
      })
      const { data } = response
      if (data.isOk) {
        const index = searchOptions.findIndex(
          s => s.value === 'idCategoriaAtendimento',
        )
        if (index > -1) {
          data.categoriaAtendimento.map(record =>
            searchOptions[index].options.push({
              label: record.descricao,
              value: record.id,
            }),
          )
          setSearchOptions([...searchOptions])
        }
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtendimento`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.atendimento)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  function confirmDeleteAttendances() {
    confirm({
      title: formatMessage({
        id:
          selectedRows.length === 1
            ? 'confirmDeleteSingular'
            : 'confirmDeletePlural',
      }),
      onOk: () => deleteAttendances(),
      okType: 'danger',
      cancelText: formatMessage({
        id: 'globalComponents.confirmModal.no',
      }),
      okText: formatMessage({
        id: 'globalComponents.confirmModal.yes',
      }),
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  }
  async function deleteAttendances() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'DELETE',
        url: `/api/Atendimento`,
        data: { ids: selectedRows.map(record => record.id) },
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getData()
        message.success(
          formatMessage({
            id: 'successDelete',
          }),
        )
      } else {
        showApiNotifications(data)
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  function startSearch() {
    clearParams()
    setParamValues(params, searchOptions, tags)
    getData()
  }

  const editAttendance = (id, newDate, newDuration, isModal, createLinkedAttendance, isFromScheduler) => {
    setAttendanceId(id)
    if (!id || newDate || newDuration || isModal) {
      setNewScheduleDate(newDate)
      setNewDuration(newDuration)
      setNewAttendanceModal(true)
      setKeyModal(keyModal + 1)
    } else {
      router.push({
        pathname: '/occurrenceRoutine/AttendanceAndOccurrence',
        query: {
          createLinkedAttendance: !!createLinkedAttendance,
          isFromScheduler: !!isFromScheduler,
        },
      }) 
      setScreen('Edit')
    }
  }

  const refreshData = () => {
    getData()
  }
  
  const handleClose = () => {
    startSearch()
    setScreen('Grid')
  }

  return (
    <React.Fragment>
      {screen === 'Grid' ? (
        <div className="container">
          <AttendanceStatisticsModal
            attendanceStatisticsModalVisible={attendanceStatisticsModalVisible}
            setAttendanceStatisticsModalVisible={
              setAttendanceStatisticsModalVisible
            }
            attendances={data}
            userPermissions={userPermissions}
            editAttendance={id => editAttendance(id, null, null, true)}
            loading={loading}
          />

          <NewAttendanceModal
            newAttendanceModal={newAttendanceModal}
            setNewAttendanceModal={setNewAttendanceModal}
            attendanceId={attendanceId}
            key={keyModal}
            userPermissions={userPermissions}
            refreshData={() => getData()}
            newScheduleDate={newScheduleDate}
            newDuration={newDuration}
          />
          <Spin spinning={loading} size="large">
            <AttendanceAndOccurrenceHeader
              {...{
                selectedRows,
                isScheduleView,
                setIsScheduleView,
                editAttendance,
                searchOptions,
                startSearch,
                userPermissions,
                tags,
                setTags,
                dataExport,
                confirmDeleteAttendances,
                data,
                setAttendanceStatisticsModalVisible,
                refreshData,
              }}
            />
            {isScheduleView ? (
              <AttendanceAndOccurrenceScheduler
                events={events}
                setEvents={setEvents}
                editAttendance={editAttendance}
                userPermissions={userPermissions}
              />
            ) : (
              <AttendanceAndOccurrenceTable
                editAttendance={editAttendance}
                keyTable={keyTable}
                data={data}
                rowSelection={rowSelection}
                userPermissions={userPermissions}
                refreshData={refreshData}
              />
            )}
          </Spin>
        </div> ) : (
         <EditAttendance
           attendanceId={attendanceId} 
           setAttendanceId={setAttendanceId} 
           location={location}
           onClose={handleClose}
         />
      )} 
    </React.Fragment>
  )
}

AttendanceAndOccurrence.propTypes = {
  location: PropTypes.any,
}
export default AttendanceAndOccurrence
