import { Table } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function DefaultTable({
  id,
  columns,
  dataSource,
  rowSelection,
  loading,
  size,
  defaultPageSize,
  ...rest
}) {
  const pageSizeOptions = ['30', '50', '100']
  if (defaultPageSize && !pageSizeOptions.find(x => x === defaultPageSize)) {
    pageSizeOptions.push(defaultPageSize)
    pageSizeOptions.sort((a,b) =>  a - b)
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

DefaultTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  dataSource: PropTypes.array,
  id: PropTypes.string,
  isDesktop: PropTypes.bool,
  loading: PropTypes.bool,
  pageSize: PropTypes.number,
  rowSelection: PropTypes.object,
  size: PropTypes.string,
  defaultPageSize: PropTypes.number,
}
