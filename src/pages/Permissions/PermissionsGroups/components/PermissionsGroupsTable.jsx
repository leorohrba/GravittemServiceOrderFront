import React from 'react'
import DefaultTable from '@components/DefaultTable'
import PropTypes from 'prop-types'
import { Badge, Button, Tooltip } from 'antd'
import Link from 'umi/link'

function PermissionsGroupsTable({ data }) {
  const columns = [
    { title: 'Descrição', render: d => d.grupoPermissao },
    { title: 'Empresa', render: d => d.empresa },
    { descricao: 'Faturamento', empresa: 'Softin Sistemas', status: 'Inativo' },
    {
      title: 'Status',
      render: d => (
        <React.Fragment>
          <Badge
            color={d.status === 'Ativo' ? 'green' : 'gray'}
            text={d.status}
          />
        </React.Fragment>
      ),
    },
    {
      key: 'action',
      render: record => (
        <Tooltip placement="top" title="Editar">
          <Link to={`PermissionsGroups/NewPermissionGroup?id=${record.id}`}>
            <Button
              shape="circle"
              type="primary"
              className="iconButton"
              ghost
              size="default"
            >
              <i className="fa fa-pencil fa-lg" />
            </Button>
          </Link>
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
PermissionsGroupsTable.propTypes = { data: PropTypes.any }
export default PermissionsGroupsTable
