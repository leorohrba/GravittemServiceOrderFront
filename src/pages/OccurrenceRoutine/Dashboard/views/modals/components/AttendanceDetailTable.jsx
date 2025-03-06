import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { getLocaleDateFormat, customSort, minuteToHourMinute } from '@utils'
import { Badge, Tooltip, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import AttendancePopover from '../../../../AttendanceAndOccurrence/components/AttendancePopover'
import PersonGroupPopover from '../../../../PersonGroup/components/PersonGroupPopover'
import moment from 'moment'

export default function AttendanceDetailTable({ data, userPermissions, editAttendance }) {

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
      title: 'Número',
      key: 'number',
      dataIndex: 'numero',
      sorter: (a, b) => customSort(a.numeroOrdenacao, b.numeroOrdenacao),
      render: (text,record) => (
              <AttendancePopover 
                attendance={record}
                showEditAttendance
                showPlaceMap
                userPermissions={userPermissions}
                editAttendance={(id) => editAttendance(id)}
              >
              {record.numero}
             </AttendancePopover>)               
    },
    {
      title: 'Solicitante',
      key: 'description',
      dataIndex: 'nomeSolicitante',
      sorter: (a, b) => customSort((a.nomeCliente || a.nomeSolicitante), (b.nomeCliente || b.nomeSolicitante)),
      render: (text, d) => !d.idSolicitante ? (
        <span>
          <p className="mb-0">
            {d.nomeSolicitante}
          </p>
        </span>
      ) : (
        <span>
          <p className="mb-0">
            {d.nomeCliente}
          </p>
          {d.nomeSolicitante && (
            <SmallTableFieldDescription
              color="gray"
              label={d.nomeSolicitante}
              fontStyle="italic"
            />
          )}
        </span>
      ),      
    },
    {
      title: 'Agendamento',
      dataIndex: 'dataAgendamento',
      sorter: (a, b) => customSort(a.dataAgendamento, b.dataAgendamento),
      render: (text, d) => (
        <span>
          <p className="mb-0">
            {d.dataAgendamento && (
              <span>
                {moment(d.dataAgendamento).format(d.horarioAgendamento ? `${getLocaleDateFormat()} HH:mm` : getLocaleDateFormat())}
              </span>
            )}              
          </p>
          {!!d.duracao && (
            <SmallTableFieldDescription
              color="gray"
              label={
                `${minuteToHourMinute(d.duracao)} duração`
              }
              fontStyle="italic"
            />
          )}  
        </span>
      ),
    },
    {
      title: 'Responsável',
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
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'idStatus',
      sorter: (a, b) => customSort(a.descricaoStatus, b.descricaoStatus), 
      render: (text, d) => (
        <span>
          <p className="mb-0">
            <Badge
              color={d.corStatus}
              text={d.descricaoStatus}
            />
          </p>
          {d.descricaoMotivo && (
            <SmallTableFieldDescription
              color="gray"
              label={d.descricaoMotivo}
              fontStyle="italic"
            />
          )}
        </span>
      ),
    },
  ]

  return (
    <React.Fragment>
      <DefaultTable
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
      />
    </React.Fragment>
  )
}

AttendanceDetailTable.propTypes = {
  data: PropTypes.array,
  userPermissions: PropTypes.array,
  editAttendance: PropTypes.func,
}
