import DefaultTable from '@components/DefaultTable'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { useNewFieldTypeContext } from '../context/DocumentGeneratorContext'

function NewFieldTypeTable() {
  const { data, setEditData, rowSelection, loading } = useNewFieldTypeContext()

  function handleClick(record) {
    setEditData(record)
  }

  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
    },
    {
      title: 'Nome do ícone',
      dataIndex: 'icone',
    },
    {
      title: 'Status',
      key: 'status',
      render: record => (record.status === 1 ? 'Ativo' : 'Desativo'),
    },
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
        loading={loading}
        rowKey={row => row.categoriaObjetoId}
        dataSource={data}
        locale={{
          emptyText: (
            <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
              <i
                className="fa fa-exclamation-circle fa-3x m-5"
                aria-hidden="true"
              />
              <h3>
                Não há dados aqui. Para cadastrar clique em{' '}
                <b>novo tipo de campo.</b>
              </h3>
            </div>
          ),
        }}
      />
    </div>
  )
}

export default NewFieldTypeTable
