import React from 'react'
import DefaultTable from '@components/DefaultTable'
import PropTypes from 'prop-types'
import { Tooltip, Button, Badge } from 'antd'
import NewSupportGroupModal from '../modals/NewSupportGroupModal'

function PermissionsSupportGroupsTable({
  data,
  setData,
  editData,
  setEditData,
  newSupportGroupModalVisible,
  setNewSupportGroupModalVisible,
  users,
}) {
  function handleClick(record) {
    setEditData(record)
    setNewSupportGroupModalVisible(true)
  }

  const columns = [
    {
      title: 'Grupo',
      key: 'group',
      width: '35%',
      render: d => <p className="mb-0">{d.grupo}</p>,
    },
    {
      title: 'Status',
      key: 'status',
      width: '40%',
      align: 'left',
      render: d => (
        <span>
          <Badge
            color={d.status === 'Ativo' ? 'green' : 'gray'}
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
      <NewSupportGroupModal
        {...{
          data,
          setData,
          editData,
          setEditData,
          newSupportGroupModalVisible,
          setNewSupportGroupModalVisible,
          users,
        }}
      />
      <DefaultTable columns={columns} dataSource={data} />
    </div>
  )
}
PermissionsSupportGroupsTable.propTypes = {
  data: PropTypes.array,
  setData: PropTypes.func,
  editData: PropTypes.any,
  setEditData: PropTypes.func,
  newSupportGroupModalVisible: PropTypes.bool,
  setNewSupportGroupModalVisible: PropTypes.func,
  users: PropTypes.any,
}
export default PermissionsSupportGroupsTable
