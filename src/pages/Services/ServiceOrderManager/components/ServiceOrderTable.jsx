import DefaultTable from '@components/DefaultTable'
import { soStatus } from '@pages/Services/enums'
import { Badge, Button, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'
import { useServiceOrderContext } from '../context/ServiceOrderContext'

function ServiceOrderTable() {
  const {
    data,
    rowSelection,
    setEditData,
    setVisibleServiceOrderModal,
  } = useServiceOrderContext()

  const findStatus = idToFind => soStatus.find(status => status.id === idToFind)

  function handleClick(record) {
    setEditData(record)
    setVisibleServiceOrderModal(true)
  }

  const columns = [
    {
      title: 'Ordem de serviço',
      dataIndex: 'OS',
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
    },
    {
      title: 'Abertura',
      dataIndex: 'dataAbertura',
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Prioridade',
      dataIndex: 'prioridade',
    },
    {
      title: 'Conclusão',
      dataIndex: 'dataConclusao',
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Idade',
      dataIndex: 'idade',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: d => (
        <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
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
                <b>Nova ordem de serviço </b>ou em <b>Importar</b>.
              </h3>
            </div>
          ),
        }}
      />
    </div>
  )
}

export default ServiceOrderTable
