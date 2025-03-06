import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { purchaseOrderStatus } from '@pages/Purchase/enums'
import { getLocaleCurrency } from '@utils'
import { Badge, Button, Popover, Tooltip } from 'antd'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewPurchaseOrderContext } from '../context/NewPurchaseOrderContext'
import NewPurchaseOrderTableFooter from './NewPurchaseOrderTableFooter'

export default function NewPurchaseOrderTable() {
  const { itemsData, rowSelection } = useNewPurchaseOrderContext()

  const findStatus = idToFind =>
    purchaseOrderStatus.find(status => status.id === idToFind)

  const columns = [
    {
      title: 'Item',
      render: d => (
        <span>
          <p className="mb-0">{d.descricao}</p>
          <SmallTableFieldDescription label={d.codigo} fontStyle="italic" />
        </span>
      ),
    },
    {
      title: 'Quantidade solicitada',
      dataIndex: 'solicitado',
      align: 'center',
    },
    {
      title: 'Quantidade recebida',
      dataIndex: 'recebido',
      align: 'center',
    },
    {
      title: 'Saldo',
      dataIndex: 'saldo',
      align: 'center',
    },
    {
      title: 'Valor unitário',
      dataIndex: 'valorUnitario',
      render: d =>
        d &&
        formatNumber(d, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: d =>
        d &&
        formatNumber(d, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Status',
      render: d =>
        d && (
          <Popover content={d.motivo}>
            <Badge
              color={findStatus(d.status)?.color}
              text={findStatus(d.status)?.name}
            />
          </Popover>
        ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <React.Fragment>
          <Tooltip placement="top" title="Detalhes">
            <Button
              shape="circle"
              type="primary"
              className="iconButton mr-1"
              ghost
              size="default"
            >
              <i className="fa fa-eye fa-lg" />
            </Button>
          </Tooltip>
          {d.status === 1 && (
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
          )}
        </React.Fragment>
      ),
    },
  ]
  return (
    <DefaultTable
      rowSelection={rowSelection}
      columns={columns}
      dataSource={itemsData}
      rowKey={row => row.id}
      pagination={false}
      locale={{
        emptyText: (
          <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
            <i
              className="fa fa-exclamation-circle fa-3x m-5"
              aria-hidden="true"
            />
            <h3>
              Não há dados aqui. Para incluir clique em <b>Novo item.</b>
            </h3>
          </div>
        ),
      }}
      footer={() => NewPurchaseOrderTableFooter()}
    />
  )
}
