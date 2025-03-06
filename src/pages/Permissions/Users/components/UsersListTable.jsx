import DefaultTable from '@components/DefaultTable'
import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Tooltip, Button } from 'antd'

function UsersListTable({ data, setEditData, setNewUserModalVisible }) {
  function handleClick(record) {
    setEditData(record)
    setNewUserModalVisible(true)
  }
  const columns = [
    {
      title: 'Usuário',
      key: 'email',
      width: '35%',
      render: d => <p className="mb-0">{d.email}</p>,
    },
    {
      title: 'Status',
      key: 'status',
      width: '40%',
      render: d => (
        <span>
          <Badge
            color={
              d.status === 'Ativo'
                ? 'green'
                : d.status === 'Bloqueado'
                ? 'red'
                : 'gray'
            }
            text={d.status}
          />{' '}
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: record => (
        <Tooltip placement="top" title="Editar">
          <Button
            onClick={() => {
              handleClick(record)
            }}
            shape="circle"
            type="primary"
            className="iconButton"
            ghost
            size="default"
          >
            <i className="fa fa-pencil fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
  ]
  return (
    <div>
      <DefaultTable dataSource={data} columns={columns} />
    </div>
  )
}
UsersListTable.propTypes = {
  data: PropTypes.any,
  setEditData: PropTypes.any,
  setNewUserModalVisible: PropTypes.any,
}
export default UsersListTable
