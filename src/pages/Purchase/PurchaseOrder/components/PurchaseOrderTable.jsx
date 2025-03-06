import DefaultTable from '@components/DefaultTable'
import { purchaseOrderStatus } from '@pages/Purchase/enums'
import { getLocaleCurrency } from '@utils'
import { Badge, Button, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { usePurchaseOrderContext } from '../context/PurchaseOrderContext'

export default function PurchaseOrderTable() {
  const { data, setEditData, rowSelection } = usePurchaseOrderContext()

  const findStatus = idToFind =>
    purchaseOrderStatus.find(status => status.id === idToFind)

  function handleClick(record) {
    setEditData(record)
  }

  const columns = [
    {
      title: 'Pedido',
      dataIndex: 'pedido',
    },
    {
      title: 'Fornecedor',
      dataIndex: 'fornecedor',
    },
    {
      title: 'Data do pedido',
      dataIndex: 'dataPedido',
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Solicitante',
      dataIndex: 'solicitante',
    },
    {
      title: 'Cotação',
      dataIndex: 'cotacao',
    },
    {
      title: 'Valor pedido',
      dataIndex: 'valorPedido',
      render: d =>
        d &&
        formatNumber(d, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Origem do pedido',
      dataIndex: 'origem',
    },
    {
      title: 'Status',
      render: d =>
        d && (
          <Badge
            color={findStatus(d.status)?.color}
            text={findStatus(d.status)?.name}
          />
        ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d =>
        d.status === 1 && (
          <Tooltip placement="top" title="Editar">
            <Button
              onClick={() => {
                handleClick(d)
              }}
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
    <DefaultTable
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      rowKey={row => row.id}
      locale={{
        emptyText: (
          <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
            <i
              className="fa fa-exclamation-circle fa-3x m-5"
              aria-hidden="true"
            />
            <h3>
              Não há dados aqui. Para cadastrar clique em{' '}
              <b>Novo pedido de compra.</b>
            </h3>
          </div>
        ),
      }}
    />
  )
}
