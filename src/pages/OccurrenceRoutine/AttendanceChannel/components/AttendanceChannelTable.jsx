import DefaultTable from '@components/DefaultTable'
import { Badge, Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { customSort, hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'

export default function AttendanceChannelTable({
  data,
  keyTable,
  rowSelection,
  editAttendanceChannel, 
  userPermissions, 
}) {
  const columns = [
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceChannel.description',
      }),
      key: 'description',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceChannel.status',
      }),
      key: 'status',
      sorter: (a, b) => a.ativo - b.ativo,
      render: (text, record) => (
        <Badge
          style={{ color: record.ativo ? 'green' : 'red' }}
          color={
            record.ativo
              ? 'green'
              : 'red'
          }
          text={record.ativo ? 'Ativo' : 'Inativo'}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title={formatMessage({ id: hasPermission(userPermissions, 'Alter') ? 'edit' : 'query' })}>
          <Button
            className="iconButton"
            shape="circle"
            type="primary"
            ghost
            onClick={() => {
              editAttendanceChannel(d.id)
            }}
          >
            <i className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'} fa-lg`} />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
    <DefaultTable
      className="mt-5"
      rowKey={record => record.id}
      dataSource={data}
      columns={columns}
      key={keyTable}
      rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
    />
  )
}

AttendanceChannelTable.propTypes = {
  data: PropTypes.any,
  rowSelection: PropTypes.any,
  keyTable: PropTypes.number,
  editAttendanceChannel: PropTypes.func,
  userPermissions: PropTypes.array,
}
