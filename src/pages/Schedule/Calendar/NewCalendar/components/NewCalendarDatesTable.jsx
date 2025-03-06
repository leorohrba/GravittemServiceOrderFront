import { Button, Table, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'
import { useNewCalendarContext } from '../context/NewCalendarContext'
import AddSpecialDateModal from '../modals/AddSpecialDateModal'
import { customSort } from '@utils'

export default function NewCalendarDatesTable() {
  const {
    datesTable,
    setDatesTable,
    rowSelection,
    setVisibleAddDateModal,
    setEditSpecialDate,
    canBeUpdated,
    setSelectedRows,
    selectedRows,
  } = useNewCalendarContext()

  function handleEdit(data) {
    setEditSpecialDate(data)
    setVisibleAddDateModal(true)
  }

  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
    },
    {
      title: 'Dia',
      dataIndex: 'data',
      sorter: (a, b) => customSort(a.data, b.data),
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoDescricao',
      sorter: (a, b) => customSort(a.tipoDescricao, b.tipoDescricao),
    },
    !canBeUpdated ?
    {} :
    {
      align: 'right',
      title: '',
      render: d => (
        <Tooltip placement="top" title="Editar">
          <Button
            shape="circle"
            size="default"
            type="primary"
            ghost
            className="iconButton"
            onClick={() => handleEdit(d)}
          >
            <i className="fa fa-pencil fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
  ]

  const handleDelete = () => {
    setDatesTable(datesTable.filter(x => !selectedRows.map(d => d.key).includes(x.key)))
    setSelectedRows([])
  }

  return (
    <div>
      <AddSpecialDateModal />
      {canBeUpdated && selectedRows.length === 0 && (
        <Button
          type="primary"
          className="my-2"
          onClick={() => setVisibleAddDateModal(true)}
        >
          Adicionar data especial
        </Button>
      )}
      {canBeUpdated && selectedRows.length > 0 && (
		    <Button onClick={() => handleDelete()} style={{ color: 'red', borderColor: 'red' }}>
  		  	<i className="fa fa-trash fa-lg mr-3" />
	  		  Excluir ({selectedRows.length})
		    </Button>
      )}
      <Table
        dataSource={datesTable}
        columns={columns}
        pagination={false}
        rowKey={row => row.key}
        rowSelection={rowSelection}
        locale={{
          emptyText: (
            <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
              <i
                className="fa fa-exclamation-circle fa-3x m-5"
                aria-hidden="true"
              />
              <h3>
                Não há dados aqui. Para cadastrar clique em{' '}
                <b>Adicionar data especial.</b>
              </h3>
            </div>
          ),
        }}
      />
    </div>
  )
}
