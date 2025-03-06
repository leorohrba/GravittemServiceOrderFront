import DefaultTable from '@components/DefaultTable'
import { Badge, Button, List, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { customSort, hasPermission } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'

export default function StatusAndReasonTable({
  data,
  keyTable,
  rowSelection,
  editStatus, 
  userPermissions, 
}) {
  const columns = [
    {
      title: formatMessage({
        id: 'occurrenceRoutine.statusAndReason.description',
      }),
      key: 'description',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
      render: (text, d) => (
        <span>
          {d.status && (
            <i
              className="fa fa-circle mx-3"
              style={{ color: d.cor }}
              aria-hidden="true"
            />
          )}
          <span>{d.descricao}</span>
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.statusAndReason.status',
      }),
      key: 'status',
      dataIndex: 'descricaoStatus',
      sorter: (a, b) => customSort(a.descricaoStatus, b.descricaoStatus),
      render: (text, record) => (
        <Badge
          style={{color: record.status === 1 ? 'green' : 'red'}}
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
              editStatus(d.id)
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
      dataSource={data}
      columns={columns}
      rowKey={record => record.id}
      key={keyTable}
      rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
      defaultExpandAllRows
      expandedRowRender={record => (
        <List>
          {record.motivos.map(r => (
            <List.Item key={r.key}>
              <p style={{ margin: 0, marginLeft: '70px' }}>{r.descricao}</p>
            </List.Item>
          ))}
        </List>
      )}
    />
  )
}

StatusAndReasonTable.propTypes = {
  data: PropTypes.any,
  rowSelection: PropTypes.any,
  keyTable: PropTypes.number,
  editStatus: PropTypes.func,
  userPermissions: PropTypes.array,
}
