import DefaultTable from '@components/DefaultTable'
import { Badge, Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { customSort, hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'

export default function AttendanceClassificationTable({
  data,
  keyTable,
  rowSelection,
  editAttendanceClassification, 
  userPermissions, 
}) {
  const columns = [
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceClassification.description',
      }),
      key: 'description',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceClassification.status',
      }),
      key: 'status',
      dataIndex: 'descricaoStatus',
      sorter: (a, b) => customSort(a.descricaoStatus, b.descricaoStatus),
      render: (text, record) => (
        <Badge
          style={{ color: record.status === 1 ? 'green' : 'red' }}
          color={
            record.status === 1
              ? 'green'
              : 'red'
          }
          text={record.descricaoStatus}
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
              editAttendanceClassification(d.id)
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

AttendanceClassificationTable.propTypes = {
  data: PropTypes.any,
  rowSelection: PropTypes.any,
  keyTable: PropTypes.number,
  editAttendanceClassification: PropTypes.func,
  userPermissions: PropTypes.array,
}
