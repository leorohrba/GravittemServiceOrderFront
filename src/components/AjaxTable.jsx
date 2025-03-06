import DefaultTable from '@components/DefaultTable'
import { updateQueryStringTable } from '@utils/index'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import React, { useEffect, useState } from 'react'

export default function AjaxTable({
  tableData,
  loadingTable,
  tableSearchQuery,
  setTableSearchQuery,
  columns,
  ...rest
}) {
  const [pagination, setPagination] = useState({
    showSizeChanger: true,
    locale: {
      items_per_page: '',
    },
    pageSize: 30,
    total: 30,
    current: 1,
    pageSizeOptions: ['30', '50', '100'],
    defaultCurrent: 1,
    showTotal: (total, range) => `${range[0]} - ${range[1]} de ${total} itens`,
  })

  useEffect(() => {
    const parsedSearchQuery = queryString.parse(tableSearchQuery)
    if (
      tableData?.itens?.length === 0 &&
      Number(parsedSearchQuery?.paginaAtual) > 1
    ) {
      parsedSearchQuery.paginaAtual = '1'
      const stringifiedSearchQuery = queryString.stringify(parsedSearchQuery)
      setTableSearchQuery(stringifiedSearchQuery)
    }
    if (tableData?.itens) {
      const pager = { ...pagination }
      pager.current = tableData?.paginaAtual
      pager.total = tableData?.quantidadeTotalItens
      pager.pageSize = tableData?.tamanhoPagina
      setPagination(pager)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData])

  const handleTableChange = (pagination, filters, sorter) => {
    // eslint-disable-next-line prefer-const
    const newQueryString = updateQueryStringTable(
      tableSearchQuery,
      pagination,
      sorter,
    )
    const pager = { ...pagination }
    pager.current = pagination.current
    pager.showTotal = (total, range) =>
      `${range[0]} - ${range[1]} de ${total} itens`
    setPagination(pager)
    const orderBy =
      queryString.parse(newQueryString).ordenarPor === ''
        ? queryString.parse(tableSearchQuery).ordenarPor ?? ''
        : ''
    setTableSearchQuery(`${newQueryString}${orderBy}`)
  }

  return (
    <DefaultTable
      columns={columns}
      loading={loadingTable}
      pagination={pagination}
      dataSource={tableData ? tableData.itens : []}
      onChange={handleTableChange}
      {...rest}
    />
  )
}

AjaxTable.propTypes = {
  columns: PropTypes.array,
  loadingTable: PropTypes.bool,
  setTableSearchQuery: PropTypes.func,
  tableData: PropTypes.object,
  tableSearchQuery: PropTypes.string,
}
