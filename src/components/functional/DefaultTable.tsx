import React from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'
import { useAtom } from 'jotai'
import { columnsAtom, rowAtom, rowKeyAtom } from '@atoms/tableAtoms'

export default function DefaultTable({
  id,
  dataSource,
  loading,
  size,
  defaultPageSize,
  ...rest
}) {

  const pageSizeOptions = ['30', '50', '100']
  if (defaultPageSize && !pageSizeOptions.find(x => x === defaultPageSize)) {
    pageSizeOptions.push(defaultPageSize)
    pageSizeOptions.sort((a, b) => a - b)
  }

  const [columns] = useAtom(columnsAtom)

  const [selectedRows, setSelectedRows] = useAtom(rowAtom)

  const [selectedRowKeys, setSelectedRowKeys] = useAtom(rowKeyAtom)

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  return (
    <Table
      size={size || 'middle'}
      id={id}
      rowSelection={rowSelection}
      columns={columns}
      loading={loading}
      dataSource={dataSource}
      pagination={{
        showSizeChanger: true,
        locale: {
          items_per_page: '',
        },
        defaultPageSize: defaultPageSize || 30,
        pageSizeOptions,
        defaultCurrent: 1,
        showTotal: (total, range) =>
          `${range[0]} - ${range[1]} de ${total} itens`,
      }}
      expandable={{ ...rest }}
      {...rest}
    />
  )
}
