import DefaultTable from '@components/DefaultTable'
import { getLocaleDateFormat } from '@utils'
import { Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function AdditionalWarrantyModalTable({ data, setEditData }) {
  const columns = [
    {
      title: 'Tipo',
      key: 'type',
      dataIndex: 'type',
      render: d =>
        d === '1' ? 'Extensão de garantia' : 'Garantia complementar',
    },
    {
      title: 'Término',
      key: 'endDate',
      dataIndex: 'endDate',
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

AdditionalWarrantyModalTable.propTypes = {
  data: PropTypes.array,
  setEditData: PropTypes.any,
}
