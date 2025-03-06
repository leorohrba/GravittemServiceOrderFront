import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { customSort, minuteToHourMinute } from '@utils'
import { Tooltip, Row, Col } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import { formatMessage } from 'umi-plugin-react/locale'
import AttendancePopover from '../../AttendanceAndOccurrence/components/AttendancePopover'
import PersonGroupPopover from '../../PersonGroup/components/PersonGroupPopover'
import moment from 'moment'

export default function MapTable({ data, userPermissions, onSelectAttendance, editAttendance }) {

  const columns = [
    {
      title: '',
      key: 'priority',
      dataIndex: 'idPrioridade',
      width: 30,
      render: (text, d) =>
        d.idPrioridade && (
          <Tooltip title={d.descricaoPrioridade}>
            <i
              className="ml-2 fa fa-exclamation-circle"
              style={{ color: d.corPrioridade }}
            />
          </Tooltip>  
        ),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceAndOccurrence.number',
      }),
      key: 'number',
      dataIndex: 'numero',
      sorter: (a, b) => customSort(a.numeroOrdenacao, b.numeroOrdenacao),
      render: (text,record) => (
              <AttendancePopover 
                attendance={record}
                showEditAttendance
                showPlaceMap
                readOnly
                editAttendance={editAttendance}
                userPermissions={userPermissions}
              >
              {record.latitude ? (
                <span
                  role="button"
                  className="primary-color cursor-pointer"
                  onClick={() => onSelectAttendance(record.id)}
                >
                  {record.numero}
                </span>
               ) : (                
                 <span>{record.numero}</span>
              )}
             </AttendancePopover>)               
    },
    {
      title: 'Local de atendimento',
      key: 'place',
      dataIndex: 'localAtendimento',
      sorter: (a, b) => customSort(a.localAtendimento, b.localAtendimento),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceAndOccurrence.schedulling',
      }),
      key: 'name',
      dataIndex: 'dataAgendamento',
      sorter: (a, b) => customSort(a.dataAgendamento, b.dataAgendamento),
      render: (text, d) => (
        <span>
          <p className="mb-0">
            {d.dataAgendamento && (
              <span>
                {moment(d.dataAgendamento).format(d.horarioAgendamento ? 'DD/MM/YY HH:mm' : 'DD/MM/YY')}
              </span>
            )}              
          </p>
          {!!d.duracao && (
            <SmallTableFieldDescription
              color="gray"
              label={
                minuteToHourMinute(d.duracao) +
                formatMessage({
                  id: 'occurrenceRoutine.attendanceAndOccurrence.duration',
                })
              }
              fontStyle="italic"
            />
          )}  
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceAndOccurrence.responsible',
      }),
      key: 'responsible',
      dataIndex: 'nomeResponsavelAtendimento',
      sorter: (a, b) => customSort(a.nomeResponsavelAtendimento, b.nomeResponsavelAtendimento),
      render: (text, d) => (
        <Row type="flex" align="middle">
          <Col>{d.nomeResponsavelAtendimento}</Col>
          {d.idGrupoColaborador && (
             <Col className="ml-2">
               <PersonGroupPopover personGroupId={d.idGrupoColaborador} />
             </Col>
          )}   
        </Row>
      ),
      
    },
  ]

  return (
    <React.Fragment>
      <DefaultTable
        className="mt-2"
        size="small"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
      />
    </React.Fragment>
  )
}

MapTable.propTypes = {
  data: PropTypes.array,
  userPermissions: PropTypes.array,
  onSelectAttendance: PropTypes.func,
  editAttendance: PropTypes.func,
}
