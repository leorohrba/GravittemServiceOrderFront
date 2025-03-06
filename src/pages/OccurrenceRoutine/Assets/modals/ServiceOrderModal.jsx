import { Button, Modal } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import ServiceOrderModalTable from './ServiceOrderModalTable'

function ServiceOrderModal() {
  // eslint-disable-next-line no-unused-vars
  const [selectedRows, setSelectedRows] = useState([])

  const data = [
    {
      key: 1,
      number: 123,
      classification: 'Avulso',
      status: 'Liquidada',
      date: moment(),
    },
    {
      key: 2,
      number: 345,
      classification: 'Contrato',
      status: 'Em andamento',
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }
  return (
    <Modal
      title="Ordem de serviço"
      width="60%"
      visible={false}
      footer={<Button type="secondary">Voltar</Button>}
    >
      <Button className="iconButton">
        <i className="fa fa-download fa-lg mr-3" />
        Exportar
      </Button>
      <ServiceOrderModalTable data={data} rowSelection={rowSelection} />
    </Modal>
  )
}

export default ServiceOrderModal
