import React from 'react'
import DefaultTable from '@components/DefaultTable'
import PropTypes from 'prop-types'
import { Tooltip, Badge, Button } from 'antd'
import NewCompaniesGroupModal from '../modals/NewCompaniesGroupModal'

function PermissionsCompaniesGroupsTable({
  data,
  setData,
  setEditData,
  editData,
  companies,
  newCompaniesGroupModalVisible,
  supports,
  setNewCompaniesGroupModalVisible,
}) {
  function handleClick(record) {
    setEditData(record)
    setNewCompaniesGroupModalVisible(true)
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
      <NewCompaniesGroupModal
        {...{
          supports,
          companies,
          data,
          setData,
          editData,
          setEditData,
          newCompaniesGroupModalVisible,
          setNewCompaniesGroupModalVisible,
        }}
      />
      <DefaultTable dataSource={data} columns={columns} />
    </div>
  )
}
PermissionsCompaniesGroupsTable.propTypes = {
  data: PropTypes.array,
  setData: PropTypes.func,
  editData: PropTypes.any,
  companies: PropTypes.any,
  setEditData: PropTypes.func,
  newCompaniesGroupModalVisible: PropTypes.bool,
  supports: PropTypes.any,
  setNewCompaniesGroupModalVisible: PropTypes.func,
}
export default PermissionsCompaniesGroupsTable
