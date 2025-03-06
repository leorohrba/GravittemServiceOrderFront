import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { purchaseStatus } from '@pages/Purchase/enums'
import { Badge, Button, InputNumber, Popover, Tooltip } from 'antd'
import update from 'immutability-helper'
import moment from 'moment'
import React from 'react'
import { usePurchaseRequestContext } from '../context/PurchaseRequestContext'

export default function PurchaseRequestTable() {
  const {
    data,
    setData,
    setEditData,
    rowSelection,
    setVisiblePurchaseRequestModal,
  } = usePurchaseRequestContext()

  const findStatus = idToFind =>
    purchaseStatus.find(status => status.id === idToFind)

  function handleSave(id, value) {
    const newData = [...data]
    const index = newData.findIndex(item => id === item.id)
    update(newData, {
      [index]: {
        aComprar: { $set: value },
      },
    })
    setData(newData)
  }

  function handleClick(record) {
    setEditData(record)
    setVisiblePurchaseRequestModal(true)
  }

  const columns = [
    {
      title: 'Item',
      render: d => (
        <span>
          <Popover content={d.tipo}>
            <p className="mb-0">{d.descricao}</p>
          </Popover>
          <SmallTableFieldDescription label={d.codigo} fontStyle="italic" />
        </span>
      ),
    },
    {
      title: 'Data de solicitação',
      dataIndex: 'dataSolicitacao',
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Quantidade solicitado',
      dataIndex: 'solicitado',
    },
    {
      title: 'Quantidade a comprar',
      render: d => (
        <InputNumber
          className="table-input-number"
          defaultValue={d.aComprar}
          min={0}
          max={d.solicitado}
          onChange={e => handleSave(d.id, e)}
        />
      ),
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
      render: record => (
        <Tooltip placement="top" title="Editar">
          <Button
            onClick={() => {
              handleClick(record)
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
              <b>Nova solicitação de compra.</b>
            </h3>
          </div>
        ),
      }}
    />
  )
}
