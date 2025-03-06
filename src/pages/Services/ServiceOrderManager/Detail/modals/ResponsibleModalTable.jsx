import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Table } from 'antd'
import React, { useState } from 'react'

export default function ResponsibleModalTable() {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      responsavel: 'Resolve Tudo',
      endereco: 'Rua Iririú, 847 - Saguaçu',
      complemento: 'Joinville - SC',
      distancia: '1 km',
      telefone: '(47) 98675-3782',
    },
  ])
  const rowSelection = {
    type: 'radio',
  }

  const columns = [
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
    },
    {
      title: 'Endereço',
      render: d => (
        <span>
          <p className="mb-0">{d.endereco}</p>
          <SmallTableFieldDescription
            label={d.complemento}
            color="gray"
            fontStyle="italic"
          />
        </span>
      ),
    },
    {
      title: 'Distância',
      dataIndex: 'distancia',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone',
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey={row => row.id}
      rowSelection={rowSelection}
      pagination={false}
    />
  )
}
