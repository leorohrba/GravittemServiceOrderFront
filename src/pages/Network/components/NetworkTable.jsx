import DefaultTable from '@components/DefaultTable'
import { defaultStatus } from '@pages/financial/enums'
import { Badge, Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function NetworkTable({ data }) {
  const findStatus = idToFind =>
    defaultStatus.find(status => status.id === idToFind)

  const columns = [
    {
      title: 'Rede',
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
        <Tooltip placement="top" title="Editar">
          <Button className="iconButton" shape="circle" type="primary" ghost>
            <i className="fa fa-pencil fa-lg" />
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
      locale={{
        emptyText: (
          <span>
            <i
              className="fa fa-exclamation-circle fa-3x m-5"
              aria-hidden="true"
            />
            <h3>
              Não há dados aqui. Para registrar clique em
              <b> Nova rede. </b>
            </h3>
          </span>
        ),
      }}
    />
  )
}

NetworkTable.propTypes = {
  data: PropTypes.array,
}
