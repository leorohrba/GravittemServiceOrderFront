import DefaultTable from '@components/DefaultTable'
import { Card, Input } from 'antd'
import React from 'react'
import { useNewDistributionListDataContext } from '../context/NewDistributionList'

export default function NewDistributionListRightCard() {
  const {
    rightTableData,
    rightSelection,
    columns,
  } = useNewDistributionListDataContext()
  return (
    <Card
      title={<b>Nova lista</b>}
      extra={<span>{`${rightTableData.length} contatos`}</span>}
      size="small"
      className="w-1/2"
    >
      <Input.Search placeholder="Pesquise um usuário" />
      <DefaultTable
        className="mt-5"
        dataSource={rightTableData}
        columns={columns}
        rowKey={record => record.id}
        rowSelection={rightSelection}
        locale={{
          emptyText: <span />,
        }}
      />
    </Card>
  )
}
