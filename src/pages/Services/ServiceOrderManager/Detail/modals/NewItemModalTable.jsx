import DefaulTable from '@components/DefaultTable'
import React from 'react'

export default function NewItemModalTable({
  tableData,
  selectedRows,
  setSelectedRows,
}) {
  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }
  return (
    <DefaulTable
      dataSource={tableData}
      columns={columns}
      rowSelection={rowSelection}
      locale={{
        emptyText: (
          <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
            <i className="fa fa-exclamation-circle fa-3x m-5" />
            <h3>
              Nenhum registro encontrado. Realize sua busca no campo acima.
            </h3>
          </div>
        ),
      }}
    />
  )
}
