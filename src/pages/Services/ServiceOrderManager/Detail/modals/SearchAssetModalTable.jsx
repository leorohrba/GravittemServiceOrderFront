import DefaulTable from '@components/DefaultTable'
import React from 'react'

export default function SearchAssetModalTable({ searchData, setSelectedRows }) {
  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
    },
    {
      title: 'Ativo',
      dataIndex: 'ativo',
    },
    {
      title: 'Número de série',
      dataIndex: 'numeroSerie',
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }
  return (
    <DefaulTable
      dataSource={searchData}
      columns={columns}
      rowSelection={rowSelection}
      rowKey={row => row.id}
      locale={{
        emptyText: (
          <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
            <i className="fa fa-exclamation-circle fa-3x m-5" />
            <h3>
              Não há dados aqui. Realize uma busca para encontrar registros.
            </h3>
          </div>
        ),
      }}
    />
  )
}
