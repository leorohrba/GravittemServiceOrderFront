/**
 * breadcrumb: Relatório de check-in e check-out
 */
import { apiAttendance } from '@services/api'
import {
  getPermissions,
  handleAuthError,
  minuteToHourMinute,
  setParamValues,
  showApiMessages,
} from '@utils'
import { Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import NewAttendanceModal from '../AttendanceAndOccurrence/modals/NewAttendanceModal'
import CheckInCheckOutData from './components/CheckInCheckOutData'
import CheckInCheckOutHeader from './components/CheckInCheckOutHeader'

const params = {
  nomeResponsavel: [],
  nomeSolicitante: [],
  dataInicial: null,
  dataFinal: null,
  numero: [],
  idClassificacaoAtendimento: [],
  dataAgendamentoInicial: null,
  dataAgendamentoFinal: null,
  idPrioridade: [],
}

function CheckInCheckOut() {
  const [tags, setTags] = useState([])
  const [data, setData] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataExport, setDataExport] = useState([])
  const [newAttendanceModal, setNewAttendanceModal] = useState(false)
  const [attendanceId, setAttendanceId] = useState(null)
  const [keyModal, setKeyModal] = useState(0)

  const [searchOptions, setSearchOptions] = useState([
    {
      value: 'nomeCliente',
      label: 'Cliente',
      type: 'search',
      placeholder: 'Informe o nome do cliente',
    },
    {
      value: 'nomeSolicitante',
      label: 'Solicitante',
      type: 'search',
      placeholder: 'Informe o nome do solicitante',
    },
    {
      value: 'nomeResponsavelAtendimento',
      label: 'Responsável',
      type: 'search',
      placeholder: 'Informe o nome do responsável pelo check-in',
    },
    {
      value: 'data',
      label: 'Data',
      type: 'rangeDate',
    },
    {
      value: 'numero',
      label: 'Número',
      type: 'search',
      placeholder: 'Informe o número do atendimento',
    },
    {
      value: 'idClassificacaoAtendimento',
      label: 'Classificação de atendimento',
      placeholder: 'Selecione a classificação de atendimento',
      type: 'select',
      options: [],
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
  ])

  useEffect(() => {
    setPermissions()
    clearParams()
    getOptionsSearchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getOptionsSearchOptions() {
    getPriority()
    getAttendanceClassification()
  }

  function clearParams() {
    params.nomeResponsavel = []
    params.nomeSolicitante = []
    params.nomeCliente = []
    params.dataInicial = null
    params.dataFinal = null
    params.numero = []
    params.idClassificacaoAtendimento = []
    params.dataAgendamentoInicial = null
    params.dataAgendamentoFinal = null
    params.idPrioridade = []
  }

  useEffect(() => {
    const source = [
      {
        columns: [
          'Número',
          'Solicitante',
          'Data inicial',
          'Data final',
          'Classificação do atendimento',
          'Descrição',
          'Local do atendimento',
          'Responsável',
          'Data de agendamento',
          'Duração',
          'Prioridade',
        ],
        data: [],
      },
    ]

    data.map(d =>
      source[0].data.push([
        d.numero,
        d.nomeSolicitante,
        d.dataInicial
          ? moment(d.dataInicial).format('DD/MM/YYYY HH:mm:ss')
          : '',
        d.dataFinal ? moment(d.dataFinal).format('DD/MM/YYYY HH:mm:ss') : '',
        d.descricaoClassificacaoAtendimento,
        d.descricao,
        d.localAtendimento,
        d.nomeResponsavel,
        d.dataAgendamento
          ? moment(d.dataAgendamento).format(
              d.horarioAgendamento ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY',
            )
          : '',
        d.duracao ? minuteToHourMinute(d.duracao) : '',
        d.descricaoPrioridade,
      ]),
    )

    setDataExport(source)
  }, [data])

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

  async function getData() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaEntradaSaida`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.entradaSaida)
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

  const refreshData = () => {
    getData()
  }

  return (
    <div className="container">
      <NewAttendanceModal
        newAttendanceModal={newAttendanceModal}
        setNewAttendanceModal={setNewAttendanceModal}
        attendanceId={attendanceId}
        key={keyModal}
        userPermissions={userPermissions}
        refreshData={refreshData}
      />
      <Spin spinning={loading} size="large">
        <CheckInCheckOutHeader
          {...{
            searchOptions,
            setTags,
            tags,
            startSearch,
            dataExport,
            userPermissions,
          }}
        />
        <CheckInCheckOutData data={data} editAttendance={editAttendance} />
      </Spin>
    </div>
  )
}

export default CheckInCheckOut
