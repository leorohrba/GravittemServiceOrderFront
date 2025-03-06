import DefaultTable from '@components/DefaultTable'
import { Card, Input } from 'antd'
import React from 'react'
import { useNewDistributionListDataContext } from '../context/NewDistributionList'

export default function NewDistributionListLeftCard() {
  const {
    leftTableData,
    leftSelection,
    columns,
  } = useNewDistributionListDataContext()
  return (
    <Card
      title={<b>Todos os contatos</b>}
      extra={<span>{`${leftTableData.length} contatos`}</span>}
      size="small"
      className="w-1/2"
    >
      <Input.Search placeholder="Pesquise um usuário" />
      <DefaultTable
        className="mt-5"
        dataSource={leftTableData}
        columns={columns}
        rowKey={record => record.id}
        rowSelection={leftSelection}
        locale={{
          emptyText: <span />,
        }}
      />
    </Card>
  )
}
