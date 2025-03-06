import { Button } from 'antd'
import React from 'react'

export default function WarrantyBlockTableHeader({ selectedRows }) {
  const aprovedItens = selectedRows.filter(s => s.status === 1)
  const waitingItens = selectedRows.filter(s => s.status === 3)

  return (
    selectedRows.length > 0 && (
      <div className="mb-1">
        {waitingItens.length === selectedRows.length && (
          <React.Fragment>
            <Button
              style={{
                color: '#57b600',
                borderColor: '#57b600',
              }}
              className="mr-2"
            >
              <i className="fa fa-thumbs-o-up fa-lg mr-3" />
              Aprovar
            </Button>
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
              }}
              className="mr-2"
            >
              <i className="fa fa-thumbs-o-down fa-lg mr-3" />
              Reprovar
            </Button>
          </React.Fragment>
        )}
        {aprovedItens.length === selectedRows.length && (
          <Button
            style={{
              color: '#2d73d0',
              borderColor: '#2d73d0',
            }}
            className="mr-2"
          >
            <i className="fa fa-usd fa-lg mr-3" />
            Gerar pedido dos itens aprovados
          </Button>
        )}
      </div>
    )
  )
}
