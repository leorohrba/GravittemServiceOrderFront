import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { schedulingStatus } from '@pages/Services/enums'
import { confirmDelete } from '@utils'
import { Badge, Button, Form, Row, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import AddSchedulingModal from '../modals/AddSchedulingModal'

export default function SchedulingBlock() {
  const {
    schedulingTableData,
    setSchedulingTableData,
    setVisibleSchedulingModal,
  } = useNewServiceOrderContext()

  const findStatus = idToFind =>
    schedulingStatus.find(status => status.id === idToFind)

  const [selectedRows, setSelectedRows] = useState([])

  function deleteServices() {
    const keysToRemove = selectedRows.map(selectedRow => selectedRow.key)
    const filteredArray = schedulingTableData.filter(
      i => !keysToRemove.includes(i.key),
    )
    setSchedulingTableData(filteredArray)
    setSelectedRows([])
  }

  const columns = [
    {
      title: 'Serviço',
      dataIndex: 'servico',
    },
    {
      title: 'Técnico',
      dataIndex: 'tecnico',
    },
    {
      title: 'Data',
      render: d => (
        <span>
          <p className="mb-0">{d.data.format('DD/MM/YYYY')}</p>
          <SmallTableFieldDescription
            label={d.periodo}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: d => (
        <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
      ),
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: record => (
        <Tooltip placement="top" title="Editar">
          <Button
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

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  return (
    <div>
      <AddSchedulingModal />
      <Form layout="vertical">
        <Row type="flex" justify="space-between">
          {selectedRows.length === 0 ? (
            <Button
              type="primary"
              className="my-2"
              onClick={() => setVisibleSchedulingModal(true)}
            >
              Novo agendamento
            </Button>
          ) : (
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
              }}
              className="my-2"
              onClick={() =>
                confirmDelete(
                  selectedRows.length,
                  deleteServices,
                  ['Excluir agendamento'],
                  [`Deseja excluir o agendamento da ordem de serviço?`],
                  'Excluir',
                  'Cancelar',
                )
              }
            >
              <i className="fa fa-trash fa-lg mr-3" />
              Excluir ({selectedRows.length})
            </Button>
          )}
          <Button>
            <i className="fa fa-ellipsis-v" />
          </Button>
        </Row>
      </Form>
      <DefaultTable
        rowSelection={rowSelection}
        columns={columns}
        dataSource={schedulingTableData}
        rowKey={row => row.id}
      />
    </div>
  )
}
