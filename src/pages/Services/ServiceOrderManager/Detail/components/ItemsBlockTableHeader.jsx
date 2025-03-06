import { Button, Divider, Row } from 'antd'
import React from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import ConfirmOrderModal from '../modals/ConfirmOrderModal'
import NewItemModal from '../modals/NewItemModal'

export default function ItemsBlockTableHeader({ selectedRows }) {
  const {
    setVisibleConfirmOrderModal,
    setVisibleItemModal,
  } = useNewServiceOrderContext()
  // status
  const canExclude = selectedRows.filter(s => s.status === 1)
  const canCancel = selectedRows.filter(
    s => s.status === 1 || s.status === 2 || s.status === 3 || s.status === 5,
  )
  const canOrder = selectedRows.filter(s => s.status !== 6)
  const canUse = selectedRows.filter(
    s => s.status === 1 || s.status === 2 || s.status === 3,
  )
  const canCancelRequest = selectedRows.filter(s => s.status === 2)
  const canReverse = selectedRows.filter(s => s.status === 4)
  const canRequest = selectedRows.filter(s => s.status === 2)
  const canReserve = selectedRows.filter(s => s.status === 1 || s.status === 5)

  // orçamento
  const newBudgetStatus = selectedRows.filter(
    s => s.orcamento === null || s.orcamento === undefined,
  )
  const aprovedBudgetStatus = selectedRows.filter(s => s.orcamento === 1)

  return (
    <Row type="flex">
      <NewItemModal />
      <ConfirmOrderModal />
      {selectedRows.length === 0 ? (
        <Button
          type="primary"
          className="my-2"
          onClick={() => setVisibleItemModal(true)}
        >
          Novo item
        </Button>
      ) : (
        <div className="my-2">
          {canReverse.length === selectedRows.length && (
            <Button
              style={{
                color: '#e6c200',
                borderColor: '#e6c200',
              }}
              className="mr-2"
            >
              <i className="fa fa-exchange fa-lg mr-3" />
              Estornar
            </Button>
          )}
          {canRequest.length === selectedRows.length && (
            <Button
              style={{
                color: '#20B2AA',
                borderColor: '#20B2AA',
              }}
              className="mr-2"
            >
              <i className="fa fa-handshake-o fa-lg mr-3" />
              Requisitar
            </Button>
          )}
          {canReserve.length === selectedRows.length && (
            <Button
              style={{
                color: '#2d73d0',
                borderColor: '#2d73d0',
              }}
              className="mr-2"
            >
              <i className="fa fa-calendar-plus-o fa-lg mr-3" />
              Reservar
            </Button>
          )}
          {canUse.length === selectedRows.length && (
            <Button
              style={{
                color: '#57b600',
                borderColor: '#57b600',
              }}
              className="mr-2"
            >
              <i className="fa fa-thumbs-o-up fa-lg mr-3" />
              Utilizar
            </Button>
          )}
          {canOrder.length === selectedRows.length && (
            <Button
              style={{
                color: '#bccc2d',
                borderColor: '#bccc2d',
              }}
              className="mr-2"
              onClick={() => setVisibleConfirmOrderModal(true)}
            >
              <i className="fa fa-usd fa-lg mr-3" />
              Fazer pedido
            </Button>
          )}
          {canCancelRequest.length === selectedRows.length && (
            <Button
              style={{
                color: '#FF8C00',
                borderColor: '#FF8C00',
              }}
              className="mr-2"
            >
              <i className="fa fa-undo fa-lg mr-3" />
              Cancelar reserva
            </Button>
          )}
          {canCancel.length === selectedRows.length && (
            <Button
              style={{
                color: 'gray',
                borderColor: 'gray',
              }}
              className="mr-2"
            >
              <i className="fa fa-ban fa-lg mr-3" />
              Cancelar
            </Button>
          )}
          {canExclude.length === selectedRows.length && (
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
              }}
            >
              <i className="fa fa-trash fa-lg mr-3" />
              Excluir
            </Button>
          )}
          {aprovedBudgetStatus.length === selectedRows.length ||
            (newBudgetStatus.length === selectedRows.length && (
              <Divider type="vertical" />
            ))}
          {newBudgetStatus.length === selectedRows.length && (
            <Button
              style={{
                color: '#57b600',
                borderColor: '#57b600',
              }}
              className="mr-2"
            >
              <i className="fa fa-thumbs-o-up fa-lg mr-3" />
              Aprovar orçamento
            </Button>
          )}
          {aprovedBudgetStatus.length === selectedRows.length ||
            (newBudgetStatus.length === selectedRows.length && (
              <Button
                style={{
                  color: 'red',
                  borderColor: 'red',
                }}
              >
                <i className="fa fa-thumbs-o-down fa-lg mr-3" />
                Reprovar orçamento
              </Button>
            ))}
        </div>
      )}
      <Button className="ml-auto my-2">
        <i className="fa fa-ellipsis-v" />
      </Button>
    </Row>
  )
}
