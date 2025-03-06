import { apiAttendance } from '@services/api'
import { handleAuthError, showApiMessages } from '@utils'
import { getTimeDistance } from '@utils/dashboard'
import { Col, notification, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import NewAttendanceModal from '../../AttendanceAndOccurrence/modals/NewAttendanceModal'
import { prepareAttendanceDataExport } from '../../AttendanceAndOccurrence/utils'
import DashboardHeader from '../components/DashboardHeader'
import AttendanceResponsibleCard from './components/AttendanceResponsibleCard'
import AttendanceResponsibleStatusCard from './components/AttendanceResponsibleStatusCard'
import AttendanceStatusCard from './components/AttendanceStatusCard'
import AttendanceDetailModal from './modals/AttendanceDetailModal'

const chartHeight = 320

function AttendanceView(props) {
  const {
    viewOptions,
    viewOption,
    setViewOption,
    show,
    userPermissions,
  } = props

  const [newAttendanceModal, setNewAttendanceModal] = useState(false)
  const [attendanceId, setAttendanceId] = useState(null)
  const [keyModal, setKeyModal] = useState(0)
  const [rangeDate, setRangeDate] = useState(getTimeDistance('month'))
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [loadingResponsibleCard, setLoadingResponsibleCard] = useState(false)
  const [
    loadingResponsibleStatusCard,
    setLoadingResponsibleStatusCard,
  ] = useState(false)
  const [loadingStatusCard, setLoadingStatusCard] = useState(false)
  const [responsibleCardData, setResponsibleCardData] = useState([])
  const [responsibleStatusCardData, setResponsibleStatusCardData] = useState([])
  const [statusCardData, setStatusCardData] = useState([])
  const [attendances, setAttendances] = useState([])
  const [
    attendanceDetailModalVisible,
    setAttendancDetailModalVisible,
  ] = useState(false)
  const [loadingAttendance, setLoadingAttendance] = useState(true)
  const [dataExport, setDataExport] = useState([])

  useEffect(() => {
    if (show) {
      if (isFirstTime) {
        fetchData()
      }
      setIsFirstTime(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  useEffect(() => {
    if (fetchData !== undefined && show) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDate])

  function fetchData() {
    getResponsibleStatusData()
    getStatusData()
    getResponsibleData()
  }

  async function getResponsibleStatusData() {
    setLoadingResponsibleStatusCard(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Dashboard/ResponsavelStatusAtendimento`,
        params: {
          dataAgendamentoInicial: rangeDate[0].format('YYYY-MM-DD'),
          dataAgendamentoFinal: rangeDate[1].format('YYYY-MM-DD'),
        },
      })
      setLoadingResponsibleStatusCard(false)
      const { data } = response
      if (data.isOk) {
        setResponsibleStatusCardData(data.atendimentos)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingResponsibleStatusCard(false)
      handleAuthError(error)
    }
  }

  async function getStatusData() {
    setLoadingStatusCard(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Dashboard/StatusAtendimento`,
        params: {
          dataAgendamentoInicial: rangeDate[0].format('YYYY-MM-DD'),
          dataAgendamentoFinal: rangeDate[1].format('YYYY-MM-DD'),
        },
      })
      setLoadingStatusCard(false)
      const { data } = response
      if (data.isOk) {
        setStatusCardData(data.atendimentos)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingStatusCard(false)
      handleAuthError(error)
    }
  }

  async function getResponsibleData() {
    setLoadingResponsibleCard(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Dashboard/ResponsavelAtendimento`,
        params: {
          dataAgendamentoInicial: rangeDate[0].format('YYYY-MM-DD'),
          dataAgendamentoFinal: rangeDate[1].format('YYYY-MM-DD'),
        },
      })
      setLoadingResponsibleCard(false)
      const { data } = response
      if (data.isOk) {
        setResponsibleCardData(data.atendimentos)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingResponsibleCard(false)
      handleAuthError(error)
    }
  }

  async function openAttendances(parameters) {
    setLoadingAttendance(true)
    setAttendancDetailModalVisible(true)
    setAttendances([])

    const params = parameters
    params.dataAgendamentoInicial = rangeDate[0].format('YYYY-MM-DD')
    params.dataAgendamentoFinal = rangeDate[1].format('YYYY-MM-DD')
    params.trazerDetalhesAtendimento = false

    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtendimento`,
        data: params,
      })
      setLoadingAttendance(false)
      const { data } = response
      if (data.isOk) {
        setAttendances(data.atendimento)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingAttendance(false)
      setAttendancDetailModalVisible(false)
      handleAuthError(error)
    }
  }

  const editAttendance = id => {
    setAttendanceId(id)
    setNewAttendanceModal(true)
    setKeyModal(keyModal + 1)
  }

  useEffect(() => {
    setDataExport(prepareAttendanceDataExport(attendances))
  }, [attendances])

  const handleRefreshData = () => {
    notification.warning({
      message: <h3>Atenção!</h3>,
      description:
        'É necessário reprocessar a consulta para obter as informações atualizadas!',
    })
  }

  if (!show) {
    return null
  }

  return (
    <React.Fragment>
      <AttendanceDetailModal
        data={attendances}
        loading={loadingAttendance}
        attendanceDetailModalVisible={attendanceDetailModalVisible}
        setAttendanceDetailModalVisible={setAttendancDetailModalVisible}
        userPermissions={userPermissions}
        editAttendance={editAttendance}
        dataExport={dataExport}
      />

      <NewAttendanceModal
        newAttendanceModal={newAttendanceModal}
        setNewAttendanceModal={setNewAttendanceModal}
        attendanceId={attendanceId}
        userPermissions={userPermissions}
        refreshData={handleRefreshData}
        key={keyModal}
      />

      <DashboardHeader
        viewOptions={viewOptions}
        viewOption={viewOption}
        setViewOption={setViewOption}
        rangeDate={rangeDate}
        setRangeDate={setRangeDate}
        fetchData={fetchData}
      />

      <div className="mb-2 w-full">
        <AttendanceResponsibleStatusCard
          data={responsibleStatusCardData}
          chartHeight={chartHeight}
          loading={loadingResponsibleStatusCard}
          openAttendances={openAttendances}
        />
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <AttendanceStatusCard
            data={statusCardData}
            chartHeight={chartHeight}
            loading={loadingStatusCard}
            openAttendances={openAttendances}
          />
        </Col>
        <Col span={12}>
          <AttendanceResponsibleCard
            data={responsibleCardData}
            chartHeight={chartHeight}
            loading={loadingResponsibleCard}
            openAttendances={openAttendances}
          />
        </Col>
      </Row>
    </React.Fragment>
  )
}

AttendanceView.propTypes = {
  viewOption: PropTypes.string,
  setViewOption: PropTypes.func,
  viewOptions: PropTypes.array,
  show: PropTypes.bool,
  userPermissions: PropTypes.bool,
}

export default AttendanceView
