import { hasPermission } from '@utils'
import { Col, Popover, Row, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ReactExport from 'react-data-export'
import MapTable from './MapTable'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

const MapTablePopover = props => {
  const {
    data,
    userPermissions,
    onSelectAttendance,
    editAttendance,
    dataExport,
    children,
    setAttendanceStatisticsModalVisible,
  } = props

  const [visible, setVisible] = useState(false)

  const content = (
    <div className="mb-2" style={{ maxHeight: '430px', overflowY: 'auto' }}>
      <div style={{ paddingRight: '5px' }}>
        <MapTable
          data={data}
          editAttendance={id => {
            setVisible(false)
            editAttendance(id)
          }}
          userPermissions={userPermissions}
          onSelectAttendance={id => {
            setVisible(false)
            onSelectAttendance(id)
          }}
        />
      </div>
    </div>
  )

  const handleShowStatistics = () => {
    setAttendanceStatisticsModalVisible(true)
    setVisible(false)
  }

  return (
    <Popover
      content={content}
      placement="bottomLeft"
      visible={visible}
      onVisibleChange={visible => setVisible(visible)}
      trigger="click"
      title={
        <Row type="flex" className="w-full" align="middle">
          <Col>
            <span className="align-middle">
              <h3>
                <b>Atendimentos</b>
              </h3>
            </span>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Row type="flex" className="w-full">
              <Col>
                <i
                  className="fa fa-bar-chart fa-lg mr-4 cursor-pointer"
                  style={{ color: 'gray' }}
                  role="button"
                  onClick={() => handleShowStatistics()}
                />
              </Col>
              {hasPermission(userPermissions, 'ExportExcel') && (
                <Col>
                  <ExcelFile
                    filename={`Atendimentos_${moment().format(
                      'DD_MM_YYYY_HH_mm',
                    )}`}
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
                  onClick={() => setVisible(false)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      }
    >
      {children}
    </Popover>
  )
}

MapTablePopover.propTypes = {
  onSelectAttendance: PropTypes.func,
  data: PropTypes.array,
  editAttendance: PropTypes.func,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
  children: PropTypes.object,
  setAttendanceStatisticsModalVisible: PropTypes.func,
}

export default MapTablePopover
