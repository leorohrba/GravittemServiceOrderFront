/**
 * breadcrumb: Mapa
 */
import { apiAttendance } from '@services/api'
import {
  getLocaleDateFormat,
  getPermissions,
  handleAuthError,
  setParamValues,
  showApiMessages,
} from '@utils'
import { Badge, message, Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import NewAttendanceModal from '../AttendanceAndOccurrence/modals/NewAttendanceModal'
import { prepareAttendanceDataExport } from '../AttendanceAndOccurrence/utils'
import AttendanceStatisticsModal from '../Dashboard/views/modals/AttendanceStatisticsModal'
import { MapContent } from './components/MapContent'
import { MapHeader } from './components/MapHeader'

let params = {}

const defaultPosition = [-26.27522, -48.82132]

const initialRangeDate = [moment().startOf('day'), moment().endOf('day')]

const initialParameterValues = [
  {
    key: 0,
    fieldName: 'Data de agendamento',
    fieldValue: 'dataAgendamento',
    fieldType: 'rangeDate',
    searchField: `${initialRangeDate[0].format(
      getLocaleDateFormat(),
    )}~${initialRangeDate[1].format(getLocaleDateFormat())}`,
    searchFieldValue: initialRangeDate,
  },
]

function Map() {
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

  const [tags, setTags] = useState(initialParameterValues)
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [mapData, setMapData] = useState([])
  const [position, setPosition] = useState(defaultPosition)
  const [newAttendanceModal, setNewAttendanceModal] = useState(false)
  const [attendanceId, setAttendanceId] = useState(null)
  const [keyModal, setKeyModal] = useState(0)
  const [dataExport, setDataExport] = useState([])
  const [
    attendanceStatisticsModalVisible,
    setAttendanceStatisticsModalVisible,
  ] = useState(false)

  useEffect(() => {
    setPermissions()
    clearParams()
    getOptionsSearchOptions()
    startSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getOptionsSearchOptions() {
    getPriority()
    getStatus()
    getAttendanceChannel()
    getAttendanceClassification()
    getAttendanceCategory()
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
      trazerDetalhesAtendimento: false,
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

        if (data.atendimento.length === 0) {
          message.info('Não há atendimentos para visualizar!')
        }
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

  function startSearch() {
    clearParams()
    setParamValues(params, searchOptions, tags)
    getData()
  }

  const editAttendance = id => {
    setAttendanceId(id)
    setNewAttendanceModal(true)
    setKeyModal(keyModal + 1)
  }

  useEffect(() => {
    const dataFiltered = data.filter(x => x.latitude && x.longitude)
    if (dataFiltered.length > 0) {
      setPosition([dataFiltered[0].latitude, dataFiltered[0].longitude])
    }
    setMapData(dataFiltered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const onSelectAttendance = id => {
    const attendance = mapData.find(x => x.id === id)
    if (attendance) {
      setPosition([attendance.latitude, attendance.longitude])
    }
  }

  return (
    <div>
      <AttendanceStatisticsModal
        attendanceStatisticsModalVisible={attendanceStatisticsModalVisible}
        setAttendanceStatisticsModalVisible={
          setAttendanceStatisticsModalVisible
        }
        attendances={data}
        userPermissions={userPermissions}
        editAttendance={editAttendance}
        loading={loading}
      />

      <NewAttendanceModal
        newAttendanceModal={newAttendanceModal}
        setNewAttendanceModal={setNewAttendanceModal}
        attendanceId={attendanceId}
        key={keyModal}
        userPermissions={userPermissions}
        refreshData={() => getData()}
      />

      <Spin spinning={loading} size="large">
        <MapHeader
          setTags={setTags}
          tags={tags}
          searchOptions={searchOptions}
          startSearch={startSearch}
          data={data}
          userPermissions={userPermissions}
          onSelectAttendance={onSelectAttendance}
          editAttendance={editAttendance}
          dataExport={dataExport}
          setAttendanceStatisticsModalVisible={
            setAttendanceStatisticsModalVisible
          }
        />
        <MapContent
          data={mapData}
          userPermissions={userPermissions}
          editAttendance={editAttendance}
          position={position}
        />
      </Spin>
    </div>
  )
}

export default Map
