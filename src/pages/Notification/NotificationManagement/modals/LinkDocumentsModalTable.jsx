import DefaultTable from '@components/DefaultTable'
import PropTypes from 'prop-types'
import React from 'react'

export default function LinkDocumentsModalTable({ rowSelection, data }) {
  const columns = [
    {
      title: 'Ordem de serviço',
      key: 'ordemServico',
      dataIndex: 'ordemServico',
    },
    {
      title: 'Cliente',
      key: 'cliente',
      dataIndex: 'cliente',
    },
  ]

  return (
    <DefaultTable
      className="mt-5"
      rowKey={record => record.key}
      columns={columns}
      rowSelection={rowSelection}
      dataSource={data}
      pagination={false}
    />
  )
}

LinkDocumentsModalTable.propTypes = {
  data: PropTypes.any,
  rowSelection: PropTypes.any,
}
