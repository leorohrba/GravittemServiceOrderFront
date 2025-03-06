import DefaultTable from '@components/DefaultTable'
import { getLocaleDateFormat } from '@utils'
import { Button, Tooltip } from 'antd'
import React from 'react'

export default function AdditionalWarrantyModalTable({ data, setEditData }) {
  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'tipo',
    },
    {
      title: 'Término',
      dataIndex: 'terminoGarantia',
      render: d => d && d.format(getLocaleDateFormat()),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title="Editar">
          <Button
            className="iconButton"
            shape="circle"
            size="default"
            type="primary"
            ghost
            onClick={() => setEditData(d)}
          >
            <i className="fa fa-pencil fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
    <DefaultTable
      className="mt-3"
      dataSource={data}
      columns={columns}
      rowKey={record => record.key}
      locale={{
        emptyText: (
          <span>
            <i
              className="fa fa-exclamation-circle fa-3x m-2"
              aria-hidden="true"
            />
            <h3>
              Não há dados aqui. Preencha os campos e clique em
              <b> Adicionar garantia.</b>
            </h3>
          </span>
        ),
      }}
    />
  )
}
