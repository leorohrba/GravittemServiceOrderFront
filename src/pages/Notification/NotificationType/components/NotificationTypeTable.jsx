import DefaultTable from '@components/DefaultTable'
import { defaultStatus } from '@pages/financial/enums'
import { Badge, Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function NotificationTypeTable({
  tableData,
  rowSelection,
  handleEdit,
}) {
  const findStatus = idToFind =>
    defaultStatus.find(status => status.id === idToFind)

  const columns = [
    {
      title: 'Tipo',
      key: 'descricao',
      dataIndex: 'descricao',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: d => (
        <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <React.Fragment>
          <Tooltip placement="top" title="Editar">
            <Button
              className="iconButton"
              shape="circle"
              type="primary"
              ghost
              onClick={() => handleEdit(d)}
            >
              <i className="fa fa-pencil fa-lg" />
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Configurar">
            <Button className="iconButton ml-2">
              <i className="fa fa-ellipsis-v" aria-hidden="true" />
            </Button>
          </Tooltip>
        </React.Fragment>
      ),
    },
  ]
  return (
    <DefaultTable
      className="mt-5"
      dataSource={tableData}
      columns={columns}
      rowKey={record => record.id}
      rowSelection={rowSelection}
      locale={{
        emptyText: (
          <span>
            <i
              className="fa fa-exclamation-circle fa-3x m-5"
              style={{ color: 'darkgray' }}
            />
            <h3>
              Não há dados aqui. Para registrar clique em
              <b> Novo tipo. </b>
            </h3>
          </span>
        ),
      }}
    />
  )
}

NotificationTypeTable.propTypes = {
  handleEdit: PropTypes.func,
  rowSelection: PropTypes.func,
  tableData: PropTypes.array,
}
