import DefaultTable from '@components/DefaultTable'
import { Badge, Button, Tooltip } from 'antd'
import React from 'react'
import { useCalendarContext } from '../context/CalendarContext'
import { customSort, hasPermission } from '@utils'

function CalendarTable() {
  const { data, setCalendarId, setScreen, rowSelection, userPermissions } = useCalendarContext()

  function handleClick(e, record) {
    e && e.preventDefault()
    setCalendarId(record.id)
    setScreen('Edit')
  }

  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
    },
    {
      title: 'Fuso horário',
      dataIndex: 'fusoHorarioDescricao',
      sorter: (a, b) => customSort(a.fusoHorarioDescricao, b.fusoHorarioDescricao),
    },
    {
      title: 'Status',
      sorter: (a, b) => customSort(a.statusDescricao, b.statusDescricao),
      render: d => (
        <React.Fragment>
          <Badge
            color={d.statusCor}
            text={d.statusDescricao}
          />
        </React.Fragment>
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: 90,
      render: record => (
        <Tooltip placement="top" title={hasPermission(userPermissions, 'Alter') ? 'Editar' : 'Consultar'}>
          <Button
            onClick={(e) => {
              handleClick(e, record)
            }}
            shape="circle"
            type="primary"
            className="iconButton"
            ghost
            size="default"
          >
            <i className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'} fa-lg`} />
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
                <b>Novo calendário.</b>
              </h3>
            </div>
          ),
        }}
      />
    </div>
  )
}

export default CalendarTable
