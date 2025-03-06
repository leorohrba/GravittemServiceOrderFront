import ConfigurationModal from '@components/modals/ConfigurationModal'
import NewSimpleSearch from '@components/NewSimpleSearch'
import { apiCRM } from '@services/api'
import { useSearchOptions } from '@utils/customHooks'
import { exportExcel } from '@utils/export'
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Menu,
  Row,
  Select,
  Spin,
  Tooltip,
} from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { useScheduleContext } from '../context/ScheduleContext'
import { scheduleStatus } from '../enums'

const { Option } = Select

export default function ScheduleHeader() {
  const {
    screenConfig,
    setTags,
    tags,
    startSearch,
    selectedDate,
    setSelectedDate,
    selectedPeriod,
    setSelectedPeriod,
    viewType,
    setViewType,
    setVisibleTaskModal,
    setTaskType,
    collaborators,
    loadingCollaborators,
    franchises,
    loadingFranchises,
    selectedCollaborator,
    setSelectedCollaborator,
    tableData,
    franchisee,
    selectedFranchise,
    setSelectedFranchise,
    loadingTable,
  } = useScheduleContext()
  const [searchOptions, loadingSearchOptions] = useSearchOptions(screenConfig)
  const [loadingExportData, setLoadingExportData] = useState(false)

  function renderDateDisplay() {
    let content = <div />
    if (selectedPeriod === 'day' || selectedPeriod === 'daily') {
      content = <span>{selectedDate[0].format('dddd, MMMM DD')}</span>
    } else if (selectedPeriod === 'week' || selectedPeriod === 'weekly') {
      const weekStart = selectedDate[0].clone().startOf('week')
      const weekEnd = selectedDate[0].clone().endOf('week')
      content = (
        <span>
          {selectedDate[0].format('MMMM')} {weekStart.format('DD')} -{' '}
          {weekEnd.format('DD')}
        </span>
      )
    } else if (selectedPeriod === 'month') {
      content = <span>{selectedDate[0].format('MMMM YYYY')}</span>
    }
    return content
  }
  const findStatus = (idToFind, type) =>
    scheduleStatus.find(status => status?.id === idToFind)

  const exportTableData = async (isExcel = false) => {
    const exportData = tableData
    if (isExcel) {
      exportData.forEach(d => {
        // eslint-disable-next-line no-param-reassign
        d.statusDescricao = findStatus(d.status, d.tipo)?.name
        // eslint-disable-next-line no-param-reassign
        d.horaString = moment(d.hora).format('HH:mm')
      })
      const nome = 'agendamento'
      const filtros = tags
        .map(tag => `${tag.fieldName}: ${tag.searchField}`)
        .join(', ')
      const colunas = [
        {
          label: 'Assunto',
          value: 'assunto',
        },
        {
          label: 'Responsável',
          value: 'responsavel',
        },
        {
          label: 'Data',
          value: 'dia',
        },
        {
          label: 'Hora',
          value: 'horaString',
        },
        {
          label: 'Tipo',
          value: 'tipoAgendamento',
        },
        {
          label: 'Status',
          value: 'statusDescricao',
        },
      ]

      if (franchisee) {
        colunas.splice(1, 0, { label: 'Empresa', value: 'franquia' })
      }

      const nomeArquivo = 'agendamento'
      exportExcel(
        nome,
        filtros,
        colunas,
        exportData,
        nomeArquivo,
        setLoadingExportData,
      )
    }
    return exportData
  }

  const exportMenu = () => (
    <Menu>
      <Menu.Item key={1} onClick={() => exportTableData(true)}>
        Excel
      </Menu.Item>
      {/* {loginData && (
        <Menu.Item key={2}>
          {ExportPDF(exportTableData, loginData, tags)}
        </Menu.Item>
      )} */}
    </Menu>
  )
  const navigate = action => {
    const period =
      selectedPeriod === 'daily'
        ? 'days'
        : selectedPeriod === 'weekly'
        ? 'weeks'
        : `${selectedPeriod}s`
    switch (action) {
      case 'TODAY':
        setSelectedDate([moment(), moment()])
        break

      case 'PREVIOUS':
        setSelectedDate([
          moment(selectedDate[0]).subtract(1, period),
          moment(selectedDate[1]).subtract(1, period),
        ])
        break

      case 'NEXT':
        setSelectedDate([
          moment(selectedDate[0]).add(1, period),
          moment(selectedDate[1]).add(1, period),
        ])
        break

      default:
        break
    }
  }

  const handleMenuClick = e => {
    switch (e.key) {
      case 'tarefa':
        setTaskType('tarefa')
        setVisibleTaskModal(true)
        break

      case 'compromisso':
        setTaskType('compromisso')
        setVisibleTaskModal(true)
        break

      default:
        break
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {/* <Menu.Item key="atividade">
        <i
          className="fa fa-clipboard fa-lg mr-2"
          style={{ color: '#1976D2' }}
        />
        Atividade
      </Menu.Item>
      <Menu.Item key="compromisso">
        <i
          className="fa fa-check-square-o fa-lg mr-2"
          style={{ color: '#1976D2' }}
        />
        Compromisso
      </Menu.Item>
      <Menu.Item key="ordemServico">
        <i className="fa fa-wrench fa-lg mr-2" style={{ color: '#1976D2' }} />
        Ordem de serviço
      </Menu.Item> */}
      <Menu.Item key="tarefa">
        <i
          className="fa fa-calendar-check-o fa-lg mr-2"
          style={{ color: '#1976D2' }}
        />
        Tarefa
      </Menu.Item>
    </Menu>
  )

  const calendarSearchOptions = searchOptions.filter(o => o.value !== 'Periodo')

  const [visibleConfigurationModal, setVisibleConfigurationModal] = useState(
    false,
  )
  const extraMenu = (
    <Menu>
      <Menu.Item onClick={() => setVisibleConfigurationModal(true)}>
        Configurações
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <ConfigurationModal
        {...{
          visibleConfigurationModal,
          setVisibleConfigurationModal,
          // setUpdateColumnsKey,
        }}
        screenName="Agenda"
        tableName="Agenda"
        defaultColumns={[]}
        microserviceName="crm"
        microserviceOrigin={apiCRM}
        onlyInitialSearch
      />
      <div className="flex justify-end">
        <Spin spinning={loadingSearchOptions}>
          <NewSimpleSearch
            searchOptions={calendarSearchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            selectOptionsWidth={180}
            screenName="Agenda"
          />
        </Spin>
        {viewType === 'calendar' ? (
          <Tooltip title="Lista">
            <i
              role="button"
              className="fa fa-list fa-2x ml-2 mt-1 cursor-pointer"
              style={{ color: '#1975d2' }}
              onClick={() => setViewType('list')}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Calendário">
            <i
              role="button"
              className="fa fa-calendar fa-2x ml-2 cursor-pointer"
              style={{ color: '#1975d2' }}
              onClick={() => setViewType('calendar')}
            />
          </Tooltip>
        )}
      </div>
      <div className="flex mt-6 justify-between">
        <Dropdown overlay={menu}>
          <Button type="primary">
            Novo <i className="fa fa-angle-down fa-lg ml-2" />
          </Button>
        </Dropdown>
        {viewType === 'calendar' && (
          <div className="flex mx-auto">
            <Button onClick={() => navigate('TODAY')}>Hoje</Button>
            <div className="flex items-baseline ml-4">
              <i
                role="button"
                className="fa fa-chevron-left  cursor-pointer "
                onClick={() => navigate('PREVIOUS')}
              />
              <h2 className="mx-6">{renderDateDisplay()}</h2>
              <i
                role="button"
                className="fa fa-chevron-right cursor-pointer"
                onClick={() => navigate('NEXT')}
              />
            </div>
          </div>
        )}
        <Row type="flex" gutter={8}>
          {viewType === 'list' && (
            <Col>
              <Form.Item>
                <DatePicker.RangePicker
                  format="DD/MM/YYYY"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e)}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
          )}
          {franchisee && (
            <Col>
              <Form.Item>
                <Select
                  style={{ width: '200px' }}
                  maxTagTextLength={9}
                  maxTagCount={1}
                  loading={loadingFranchises}
                  value={selectedFranchise}
                  onChange={e => setSelectedFranchise(e)}
                  placeholder="Selecionar franquias"
                >
                  {franchises?.map(c => (
                    <Option value={c?.id}>{c?.nome}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col>
            <Form.Item>
              <Select
                style={{ width: '200px' }}
                maxTagTextLength={9}
                maxTagCount={1}
                loading={loadingCollaborators}
                value={selectedCollaborator}
                onChange={e => setSelectedCollaborator(e)}
                mode="multiple"
                placeholder="Selecionar responsável"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input?.toLowerCase()) >= 0
                }
              >
                {collaborators?.map(c => (
                  <Option value={c?.id}>{c?.nome}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {viewType === 'calendar' && (
            <Col>
              <Select
                value={selectedPeriod}
                style={{ width: '200px' }}
                onChange={e => setSelectedPeriod(e)}
              >
                <Option value="day">Diário</Option>
                <Option value="week">Semanal</Option>
                <Option value="month">Mensal</Option>
                <Option value="daily">Período (Diário)</Option>
                <Option value="weekly">Período (Semanal)</Option>
              </Select>
            </Col>
          )}
          {viewType === 'list' && (
            <React.Fragment>
              <Dropdown overlay={exportMenu} className="ml-1">
                <Button className="iconButton" loading={loadingExportData}>
                  <i className="fa fa-download fa-lg mr-3" />
                  Exportar
                </Button>
              </Dropdown>
              <Dropdown overlay={extraMenu} className="ml-1">
                <Button className="iconButton">
                  <i className="fa fa-ellipsis-v" aria-hidden="true" />
                </Button>
              </Dropdown>
            </React.Fragment>
          )}
          <Button className="iconButton hidden">
            <i className="fa fa-ellipsis-v fa-lg" />
          </Button>
        </Row>
      </div>
    </div>
  )
}
