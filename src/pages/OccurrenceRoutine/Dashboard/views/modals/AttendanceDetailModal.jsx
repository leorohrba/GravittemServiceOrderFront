import { Modal, Spin, Row, Button } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { hasPermission } from '@utils'
import ReactExport from 'react-data-export'
import moment from 'moment'
import AttendanceDetailTable from './components/AttendanceDetailTable'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

function AttendanceDetailModal(props) {
  const {
    data,
    editAttendance,
    userPermissions,
    attendanceDetailModalVisible,
    setAttendanceDetailModalVisible,
    loading,
    dataExport,
  } = props
  
  return (
    <Modal
      title="Atendimentos"
      visible={attendanceDetailModalVisible}
      centered
      width={1000}
      destroyOnClose
      onCancel={() => setAttendanceDetailModalVisible(false)}
      footer={
        <Row type="flex">
          {hasPermission(userPermissions, 'ExportExcel') && (
           <ExcelFile
             filename={`Atendimentos_${moment().format('DD_MM_YYYY_HH_mm')}`}
             element={
                <Button
                  size="default"
                  style={{
                    marginLeft: 'auto',
                  }}
                  className="iconButton"
                >
                  <i className="fa fa-download fa-lg mr-3" />
                  Exportar
                </Button>
             }
           >
              <ExcelSheet dataSet={dataExport} name="Atendimentos" />
           </ExcelFile>
          )}
          <Button
            onClick={() => setAttendanceDetailModalVisible(false)}
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
      <Spin spinning={loading} size="large">
        <AttendanceDetailTable
          data={data}
          editAttendance={editAttendance}
          userPermissions={userPermissions}
        />  
      </Spin>
    </Modal>
  )
}

AttendanceDetailModal.propTypes = {
  data: PropTypes.array,
  editAttendance: PropTypes.func,
  userPermissions: PropTypes.array,
  attendanceDetailModalVisible: PropTypes.bool,
  setAttendanceDetailModalVisible: PropTypes.func,
  loading: PropTypes.bool,
  dataExport: PropTypes.array,
}

export default AttendanceDetailModal
