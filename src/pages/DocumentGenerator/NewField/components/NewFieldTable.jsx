import DefaultTable from '@components/DefaultTable'
import { Button, Tooltip } from 'antd'
import React from 'react'
import Link from 'umi/link'
import { useNewFieldContext } from '../context/DocumentGeneratorContext'

function NewFieldTable() {
  const { data, setEditData, rowSelection } = useNewFieldContext()

  function handleClick(record) {
    setEditData(record)
  }

  const columns = [
    {
      title: 'Nome do campo',
      dataIndex: 'nomeCampo',
    },
    {
      title: 'Tipo de campo',
      dataIndex: 'tipoCampo',
    },
    {
      title: 'Caminho de acesso a api',
      dataIndex: 'caminhoAcessoApi',
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: '20%',
      render: record => (
        <Tooltip placement="top" title="Editar">
          <Link
            to={`/InvoiceManagement/InvoiceProfile/NewInvoiceProfile?id=${record.id}`}
          >
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
          </Link>
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
        locale={{
          emptyText: (
            <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
              <i
                className="fa fa-exclamation-circle fa-3x m-5"
                aria-hidden="true"
              />
              <h3>
                Não há dados aqui. Para cadastrar clique em <b>novo campo.</b>
              </h3>
            </div>
          ),
        }}
      />
    </div>
  )
}

export default NewFieldTable
