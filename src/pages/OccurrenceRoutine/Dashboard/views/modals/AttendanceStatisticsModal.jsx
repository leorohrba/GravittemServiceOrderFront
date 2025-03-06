import { customSort, hasPermission } from '@utils'
import {
  Button,
  Col,
  Modal,
  Popover,
  Row,
  Skeleton,
  Spin,
  Tabs,
  Tooltip,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import ReactExport from 'react-data-export'
import { prepareAttendanceDataExport } from '../../../AttendanceAndOccurrence/utils'
import AttendanceStatistcsContent from './components/AttendanceStatisticsContent'
import AttendanceStatisticsTable from './components/AttendanceStatisticsTable'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile
const { TabPane } = Tabs

const defaultColor = '#63b3ed'

const models = [
  {
    title: 'Status',
    id: 'idStatus',
    description: 'descricaoStatus',
    color: 'corStatus',
    chartDescription: 'Quantidade de atendimentos por status',
  },
  {
    title: 'Prioridade',
    id: 'idPrioridade',
    description: 'descricaoPrioridade',
    color: 'corPrioridade',
    noDescription: 'Sem prioridade',
    chartDescription: 'Quantidade de atendimentos por prioridade',
  },
  {
    title: 'Responsável',
    id: 'idResponsavelAtendimento',
    typeId: 'tipoResponsavelAtendimento',
    ids: ['idResponsavelAtendimento', 'idGrupoColaborador'],
    description: 'nomeResponsavelAtendimento',
    noDescription: 'Sem responsável',
    chartDescription: 'Quantidade de atendimentos por responsável',
  },
  {
    title: 'Canal',
    id: 'idCanalAtendimento',
    description: 'descricaoCanalAtendimento',
    noDescription: 'Sem canal',
    chartDescription: 'Quantidade de atendimentos por canal de atendimento',
  },
  {
    title: 'Classificação',
    id: 'idClassificacaoAtendimento',
    description: 'descricaoClassificacaoAtendimento',
    noDescription: 'Sem classificacao',
    chartDescription:
      'Quantidade de atendimentos por classificação de atendimento',
  },
  {
    title: 'Categoria',
    id: 'idCategoriaAtendimento',
    description: 'descricaoCategoriaAtendimento',
    noDescription: 'Sem categoria',
    chartDescription: 'Quantidade de atendimentos por categoria de atendimento',
    viewModel: 'categoriasAtendimento',
  },
  {
    title: 'Agendamento',
    id: 'dataAgendamento',
    description: 'dataAgendamento',
    type: 'moment',
    idFormat: 'YYYY-MM-DD',
    descriptionFormat: 'DD/MM',
    chartDescription: 'Quantidade de atendimentos por data de agendamento',
    noDescription: 'Sem data',
  },
  {
    title: 'Diário',
    id: 'dataInclusao',
    description: 'dataInclusao',
    type: 'moment',
    idFormat: 'YYYY-MM-DD',
    descriptionFormat: 'DD/MM',
    chartDescription: 'Quantidade de atendimentos por data de inclusão',
  },
  {
    title: 'Mensal',
    id: 'dataInclusao',
    description: 'dataInclusao',
    type: 'moment',
    idFormat: 'YYYY-MM',
    descriptionFormat: 'MMM/YYYY',
    chartDescription: 'Quantidade de atendimentos por mês/ano de inclusão',
  },
]

function AttendanceStatisticsModal(props) {
  const {
    attendances,
    attendanceStatisticsModalVisible,
    setAttendanceStatisticsModalVisible,
    editAttendance,
    userPermissions,
    loading,
  } = props

  const [preparing, setPreparing] = useState(true)
  const [data, setData] = useState([])
  const [chartType, setChartType] = useState('VB')
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [attendancesFiltered, setAttendancesFiltered] = useState([])
  const [activeTabKey, setActiveTabKey] = useState('0')
  const [dataExport, setDataExport] = useState([])

  useEffect(() => {
    if (attendanceStatisticsModalVisible) {
      prepareData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceStatisticsModalVisible, attendances])

  useEffect(() => {
    if (!attendanceStatisticsModalVisible) {
      setPopoverVisible(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceStatisticsModalVisible])

  function prepareData() {
    setPreparing(true)
    const dataSource = []

    models.map((m, index) => {
      dataSource.push({
        title: m.title,
        chartDescription: m.chartDescription,
        hasColor: !!m.color,
        total: attendances.length,
        index,
        data: [],
      })
      return true
    })

    attendances.map(d => {
      models.map((m, i) => {
        if (!!m.viewModel && d[m.viewModel]?.length > 0) {
          d[m.viewModel].map(s => {
            addData(dataSource, s, m, i)
			return true
          })
        } else if (!m.viewModel) {
          addData(dataSource, d, m, i)
        }

        return true
      })
      return true
    })

    models.map((m, i) => {
      dataSource[i].data.sort((a, b) => customSort(a.sort, b.sort))
      return true
    })
    setData(dataSource)
    setPreparing(false)
  }

  function addData(dataSource, d, m, i) {
    const { typeId } = m
    let targetId = m.id
    const type = typeId ? d[typeId] : null

    if (typeId && m.ids && m.ids.length <= type) {
      targetId = m.ids[type - 1]
    }

    const id =
      m.type !== 'moment'
        ? d[targetId]
        : d[targetId]
        ? moment(d[targetId]).format(m.idFormat)
        : null

    const index = dataSource[i].data.findIndex(
      x =>
        (!id && !x.id) ||
        (id && x.id === id && (!type || (type && x.type === type))),
    )

    if (index > -1) {
      dataSource[i].data[index].quantity++
      dataSource[i].data[index].percent =
        dataSource[i].data[index].quantity / dataSource[i].total
    } else {
      let description =
        m.type !== 'moment'
          ? d[m.description]
          : d[m.description]
          ? moment(d[m.description]).format(m.descriptionFormat)
          : null

      let sort = description || `zz${m.noDescription}` // para colocar os noDescription por ultimo
      if (m.type === 'moment') {
        sort = description ? id : sort
      }

      if (!description) {
        description = m.noDescription
      }

      const color = m.color ? d[m.color] || defaultColor : defaultColor

      dataSource[i].data.push({
        id,
        type,
        description,
        color,
        sort,
        quantity: 1,
        percent: 1 / dataSource[i].total,
      })
    }
  }

  useEffect(() => {
    setDataExport(prepareAttendanceDataExport(attendancesFiltered))
  }, [attendancesFiltered])

  const handlePopoverVisible = visible => {
    if (!visible) {
      setPopoverVisible(visible)
    }
  }

  const contentPopover = (
    <div
      className="mb-2"
      style={{ width: '480px', maxHeight: '450px', overflowY: 'auto' }}
    >
      <div style={{ paddingRight: '5px' }}>
        <AttendanceStatisticsTable
          data={attendancesFiltered}
          editAttendance={id => {
            setPopoverVisible(false)
            if (editAttendance !== undefined) {
              editAttendance(id)
            }
          }}
          userPermissions={userPermissions}
        />
      </div>
    </div>
  )

  const popoverTitle = (
    <Row type="flex" className="w-full" align="middle">
      <Col>
        <span className="align-middle">
          <h3>Listagem dos Atendimentos</h3>
        </span>
      </Col>
      <Col style={{ marginLeft: 'auto' }}>
        <Row type="flex" className="w-full">
          {hasPermission(userPermissions, 'ExportExcel') && (
            <Col>
              <ExcelFile
                filename={`Atendimentos_${moment().format('DD_MM_YYYY_HH_mm')}`}
                element={
                  <Tooltip title="Exportar dados">
                    <i
                      className="fa fa-download fa-lg mr-4 cursor-pointer"
                      style={{ color: 'gray' }}
                    />
                  </Tooltip>
                }
              >
                <ExcelSheet dataSet={dataExport} name="Atendimentos" />
              </ExcelFile>
            </Col>
          )}
          <Col>
            <i
              className="fa fa-times fa-lg cursor-pointer"
              style={{ color: 'gray' }}
              role="button"
              onClick={() => setPopoverVisible(false)}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )

  const modalTitle = (
    <Popover
      title={popoverTitle}
      visible={popoverVisible}
      content={contentPopover}
      onVisibleChange={visible => handlePopoverVisible(visible)}
    >
      <Row className="w-full">Estatística de Atendimentos</Row>
    </Popover>
  )

  const openAttendances = (index, id, type) => {
    if (!models[index].viewModel && models[index].type !== 'moment') {
      if (!models[index].typeId) {
        setAttendancesFiltered(
          attendances.filter(
            x =>
              (!id && !x[models[index].id]) ||
              (id && x[models[index].id] === id),
          ),
        )
      } else {
        setAttendancesFiltered(
          attendances.filter(
            x =>
              (!type && !x[models[index].typeId]) ||
              (id && x[models[index].ids[type - 1]] === id),
          ),
        )
      }
    } else if (!models[index].viewModel) {
      setAttendancesFiltered(
        attendances.filter(
          x =>
            (!id && !x[models[index].id]) ||
            (id &&
              x[models[index].id] &&
              moment(x[models[index].id]).format(models[index].idFormat) ===
                id),
        ),
      )
    } else if (models[index].viewModel) {
      setAttendancesFiltered(
        attendances.filter(x =>
          x[models[index].viewModel].find(y => y[models[index].id] === id),
        ),
      )
    }
    setPopoverVisible(true)
  }

  return (
    <Modal
      title={modalTitle}
      visible={attendanceStatisticsModalVisible}
      centered
      width="95%"
      destroyOnClose
      onCancel={() => setAttendanceStatisticsModalVisible(false)}
      footer={
        <Row type="flex">
          <Button
            onClick={() => setAttendanceStatisticsModalVisible(false)}
            type="secondary"
            style={{
              marginLeft: 'auto',
            }}
          >
            Fechar
          </Button>
        </Row>
      }
    >
      <Spin spinning={loading || preparing} size="large">
        <Skeleton loading={preparing} paragraph={{ rows: 13 }} active>
          <Tabs
            type="card"
            activeKey={activeTabKey}
            onChange={activeKey => setActiveTabKey(activeKey)}
          >
            {data.map((d, index) => (
              <TabPane
                tab={`${d.title} (${d.data.length})`}
                key={index.toString()}
              >
                <AttendanceStatistcsContent
                  data={d}
                  chartType={chartType}
                  setChartType={setChartType}
                  openAttendances={openAttendances}
                />
              </TabPane>
            ))}
          </Tabs>
        </Skeleton>
      </Spin>
    </Modal>
  )
}

AttendanceStatisticsModal.propTypes = {
  attendances: PropTypes.array,
  attendanceStatisticsModalVisible: PropTypes.bool,
  setAttendanceStatisticsModalVisible: PropTypes.func,
  editAttendance: PropTypes.func,
  userPermissions: PropTypes.array,
  loading: PropTypes.bool,
}

export default AttendanceStatisticsModal
