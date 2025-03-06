import DefaultTable from '@components/DefaultTable'
import { customSort, hasPermission } from '@utils'
import { Badge, Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function PriorityTable({
  data,
  keyTable,
  rowSelection,
  editPriority,
  userPermissions,
}) {
  const columns = [
    {
      title: formatMessage({
        id: 'occurrenceRoutine.priority.description',
      }),
      key: 'description',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
      render: (text, d) => (
        <div>
          <i
            className="fa fa-exclamation-circle fa-lg mr-3"
            style={{
              color: `${d.cor}`,
            }}
          />
          <span>{d.descricao}</span>
        </div>
      ),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.priority.status',
      }),
      key: 'status',
      dataIndex: 'ativo',
      sorter: (a, b) => a.ativo - b.ativo,
      render: (text, record) => (
        <Badge
          style={{ color: record.ativo ? 'green' : 'red' }}
          color={record.ativo ? 'green' : 'red'}
          text={record.ativo ? 'Ativo' : 'Inativo'}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip
          placement="top"
          title={formatMessage({
            id: hasPermission(userPermissions, 'Alter') ? 'edit' : 'query',
          })}
        >
          <Button
            className="iconButton"
            shape="circle"
            type="primary"
            ghost
            onClick={() => {
              editPriority(d.id)
            }}
          >
            <i
              className={`fa fa-${
                hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'
              } fa-lg`}
            />
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
      rowSelection={
        hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined
      }
    />
  )
}

PriorityTable.propTypes = {
  data: PropTypes.any,
  rowSelection: PropTypes.any,
  keyTable: PropTypes.number,
  editPriority: PropTypes.func,
  userPermissions: PropTypes.array,
}
