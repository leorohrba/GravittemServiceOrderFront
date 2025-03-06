/**
 * breadcrumb: Lista de distribuição
 */
import { Button } from 'antd'
import React, { useState } from 'react'
import Link from 'umi/link'
import DistributionListTable from './components/DistributionListTable'

export default function DistributionList() {
  // eslint-disable-next-line no-unused-vars
  const [selectedRows, setSelectedRows] = useState([])
  const tableData = [{ id: 1, descricao: 'Todas as franquias' }]

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  return (
    <div className="container">
      <Link to="/Notification/DistributionList/NewDistributionList">
        <Button type="primary">
          <i className="fa fa-plus fa-lg mr-3" />
          Nova lista de distribuição
        </Button>
      </Link>
      <DistributionListTable {...{ tableData, rowSelection }} />
    </div>
  )
}
