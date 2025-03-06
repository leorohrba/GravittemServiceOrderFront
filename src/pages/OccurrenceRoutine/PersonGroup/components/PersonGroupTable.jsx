import DefaultTable from '@components/DefaultTable'
import { Badge, Button, Tooltip } from 'antd'
import { customSort, hasPermission } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import PersonGroupPopover from './PersonGroupPopover'

export default function PersonGroupTable(  
  { data, 
    rowSelection,
    editPersonGroup,  
    keyTable,    
    userPermissions,
  }) 
  {
  const columns = [
    {
      title: 'Nome do grupo',
      key: 'descricao',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
      render: (text, d) => (<PersonGroupPopover personGroupId={d.id}>{text}</PersonGroupPopover>),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'ativo',
      sorter: (a, b) => a.status - b.status, 
      render: (text, d) => (
        <Badge
          style={{ color: d.ativo ? 'green' : 'red'}}
          color={
              d.status === 1
              ? 'green'
              : 'red'
          }
          text={d.status === 1 ? 'Ativo' : 'Inativo'}
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
              editPersonGroup(d.id)
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
      className="mt-4"
      dataSource={data}
      columns={columns}
      rowKey={record => record.id}
      rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
      key={keyTable}
    />
  )
}

PersonGroupTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  editPersonGroup: PropTypes.func,
  keyTable: PropTypes.number,
  userPermissions: PropTypes.array,
}
