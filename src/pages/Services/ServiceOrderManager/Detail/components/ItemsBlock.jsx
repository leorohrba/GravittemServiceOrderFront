import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { itemBudgetStatus, itemStatus } from '@pages/Services/enums'
import { getLocaleCurrency } from '@utils'
import { Badge, Button, Form, Tooltip } from 'antd'
import React, { useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import ItemsBlockTableFooter from './ItemsBlockTableFooter'
import ItemsBlockTableHeader from './ItemsBlockTableHeader'

export default function ItemsBlock() {
  const { itemsTableData } = useNewServiceOrderContext()

  const findItemStatus = idToFind =>
    itemStatus.find(status => status.id === idToFind)

  const findBudgetStatus = idToFind =>
    itemBudgetStatus.find(status => status.id === idToFind)

  const [selectedRows, setSelectedRows] = useState([])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
    },
    {
      title: 'Valor unitário',
      dataIndex: 'valorUnitario',
      render: value =>
        formatNumber(value, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Desconto unitário',
      render: d => (
        <span>
          <p className="mb-0">
            {formatNumber(d.descontoUnitario, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </p>
          <SmallTableFieldDescription
            label={`${d.porcDesconto}%`}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: value =>
        formatNumber(value, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: d =>
        d && (
          <Badge
            color={findItemStatus(d)?.color}
            text={findItemStatus(d)?.name}
          />
        ),
    },
    {
      title: 'Orçamento',
      dataIndex: 'orcamento',
      render: d =>
        d && (
          <Badge
            color={findBudgetStatus(d)?.color}
            text={findBudgetStatus(d)?.name}
          />
        ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: record => (
        <Tooltip placement="top" title="Editar">
          <Button
            shape="circle"
            type="primary"
            className="iconButton"
            ghost
            size="default"
          >
            <i className="fa fa-pencil fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
    <div>
      <Form layout="vertical">
        <ItemsBlockTableHeader {...{ selectedRows }} />
      </Form>
      <DefaultTable
        rowSelection={rowSelection}
        columns={columns}
        dataSource={itemsTableData}
        rowKey={row => row.id}
      />
      <ItemsBlockTableFooter />
    </div>
  )
}
