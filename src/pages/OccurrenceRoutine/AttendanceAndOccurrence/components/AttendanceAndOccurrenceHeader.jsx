import NewSimpleSearch from '@components/NewSimpleSearch'
import { hasPermission } from '@utils'
import { Button, Col, Dropdown, Menu, Row } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ReactExport from 'react-data-export'
import { formatMessage } from 'umi-plugin-react/locale'
import ImportExcelModal from '@components/modals/ImportExcelModal'
import LogImportModal from '@components/modals/LogImportModal'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

function AttendanceAndOccurrenceHeader({
  selectedRows,
  isScheduleView,
  setIsScheduleView,
  editAttendance,
  startSearch,
  userPermissions,
  tags,
  setTags,
  dataExport,
  confirmDeleteAttendances,
  searchOptions,
  data,
  setAttendanceStatisticsModalVisible,
  refreshData,
}) {
  const [visibleModal, setVisibleModal] = useState(false)
  const [visibleLogImportModal, setVisibleLogImportModal] = useState(false)
  const [keyModal, setKeyModal] = useState(0)

  const handleOpenImportExcel = () => {
    setVisibleModal(true)
    setKeyModal(keyModal + 1)
  }

  const handleOpenLogImport = () => {
    setVisibleLogImportModal(true)
  }

  const attendanceMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleOpenImportExcel()}>
        Importar cadastro
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleOpenLogImport()}>
        Histórico de importação
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <ImportExcelModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        refreshData={refreshData}
        key={keyModal}
        documentId={1}
      />
      <LogImportModal
        visibleModal={visibleLogImportModal}
        setVisibleModal={setVisibleLogImportModal}
        documentId={1}
      />
      <Row type="flex">
        <Col
          style={{
            marginLeft: 'auto',
          }}
        >
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            screenName="atendimentos_ocorrencias"
            selectOptionsWidth={200}
            hideSaveSearch
            getSelectLabel
          />
        </Col>
        <Col style={{ color: '#1976D2' }} className="mt-1">
          <i
            className={`fa fa-${
              isScheduleView ? 'list' : 'th'
            } fa-2x ml-5 cursor-pointer`}
            aria-hidden="true"
            onClick={() => setIsScheduleView(!isScheduleView)}
          />
        </Col>
      </Row>
      <Row type="flex" className="my-5">
        {selectedRows.length === 0 ? (
          <span>
            {hasPermission(userPermissions, 'Include') && (
              <span>
                <Button type="primary" onClick={() => editAttendance(null)}>
                  <i className="fa fa-plus fa-lg mr-3" />
                  {formatMessage({
                    id:
                      'occurrenceRoutine.attendanceAndOccurrence.newAttendance',
                  })}
                </Button>
                <Dropdown overlay={attendanceMenu} className="ml-1">
                  <Button type="primary">
                    <i className="fa fa-angle-down fa-lg" aria-hidden="true" />
                  </Button>
                </Dropdown>
              </span>
            )}
          </span>
        ) : (
          <span>
            {hasPermission(userPermissions, 'Exclude') && (
              <Button
                onClick={() => confirmDeleteAttendances()}
                style={{
                  color: 'red',
                  borderColor: 'red',
                }}
              >
                <i className="fa fa-trash fa-lg mr-3" />
                {formatMessage({
                  id: 'delete',
                })}{' '}
                ({selectedRows.length})
              </Button>
            )}
          </span>
        )}
        <Col className="ml-auto">
          <Button
            size="default"
            disabled={data.length === 0}
            onClick={() => setAttendanceStatisticsModalVisible(true)}
            style={{
              marginLeft: 'auto',
            }}
            className="ml-2 iconButton"
          >
            <i className="fa fa-bar-chart fa-lg mr-3" />
            Estatísticas
          </Button>
        </Col>
        <Col className="ml-2">
          {hasPermission(userPermissions, 'ExportExcel') && (
            <ExcelFile
              filename={`Atendimentos_${moment().format('DD_MM_YYYY_HH_mm')}`}
              element={
                <Button
                  size="default"
                  style={{
                    marginLeft: 'auto',
                  }}
                  className="ml-2 iconButton"
                >
                  <i className="fa fa-download fa-lg mr-3" />
                  {formatMessage({
                    id: 'export',
                  })}
                </Button>
              }
            >
              <ExcelSheet dataSet={dataExport} name="Atendimentos" />
            </ExcelFile>
          )}
        </Col>
      </Row>
    </div>
  )
}

AttendanceAndOccurrenceHeader.propTypes = {
  isScheduleView: PropTypes.bool,
  selectedRows: PropTypes.array,
  setIsScheduleView: PropTypes.func,
  editAttendance: PropTypes.func,
  startSearch: PropTypes.func,
  userPermissions: PropTypes.array,
  tags: PropTypes.array,
  setTags: PropTypes.func,
  dataExport: PropTypes.array,
  confirmDeleteAttendances: PropTypes.func,
  searchOptions: PropTypes.array,
  data: PropTypes.array,
  setAttendanceStatisticsModalVisible: PropTypes.func,
  refreshData: PropTypes.func,
}
export default AttendanceAndOccurrenceHeader
