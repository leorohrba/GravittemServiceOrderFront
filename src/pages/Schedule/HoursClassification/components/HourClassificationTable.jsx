import DefaultTable from '@components/DefaultTable'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useHourClassificationContext } from '../context/HourClassificationContext'
import { customSort, hasPermission } from '@utils'

function HourClassificationTable() {
  const {
    data,
    setEditData,
    rowSelection,
    userPermissions,
    setVisibleHourClassificationModal,
  } = useHourClassificationContext()

  function handleClick(record) {
    setEditData(record)
    setVisibleHourClassificationModal(true)
  }

  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
    },
    {
      title: 'Dia',
      render: d =>
        d.dias?.length > 0 &&
        d.dias
          .map(info => info.diaAbreviacao)
          .join(', '),
    },
    {
      title: 'Horário',
      dataIndex: 'horario',
    },
    !hasPermission(userPermissions, 'Alter') ?
    {} :
    {
      title: '',
      key: 'action',
      align: 'right',
      width: '20%',
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
    <div>
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
                <b>Nova classificação.</b>
              </h3>
            </div>
          ),
        }}
      />
    </div>
  )
}

export default HourClassificationTable
