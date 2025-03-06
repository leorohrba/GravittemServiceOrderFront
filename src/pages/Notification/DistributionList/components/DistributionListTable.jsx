import DefaultTable from '@components/DefaultTable'
import { Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function DistributionListTable({ tableData, rowSelection }) {
  const columns = [
    {
      title: 'Noma da lista',
      key: 'descricao',
      dataIndex: 'descricao',
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
              <b> Nova lista de distribuição. </b>
            </h3>
          </span>
        ),
      }}
    />
  )
}

DistributionListTable.propTypes = {
  rowSelection: PropTypes.func,
  tableData: PropTypes.array,
}
