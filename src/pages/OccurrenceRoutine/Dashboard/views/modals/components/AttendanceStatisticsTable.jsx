import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { customSort } from '@utils'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import AttendancePopover from '../../../../AttendanceAndOccurrence/components/AttendancePopover'

export default function AttendanceStatisticsTable({ data, userPermissions, editAttendance }) {

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
  ]

  return (
    <React.Fragment>
      <DefaultTable
        size="small"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
      />
    </React.Fragment>
  )
}

AttendanceStatisticsTable.propTypes = {
  data: PropTypes.array,
  userPermissions: PropTypes.array,
  editAttendance: PropTypes.func,
}
