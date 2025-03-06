import DefaultTable from '@components/DefaultTable'
import { warrantyStatus } from '@pages/Services/enums'
import { getLocaleCurrency } from '@utils'
import { Badge, Form } from 'antd'
import React, { useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import AuditHistoryModal from '../modals/AuditHistoryModal'
import WarrantyBlockForm from './WarrantyBlockForm'
import WarrantyBlockTableHeader from './WarrantyBlockTableHeader'

export default function WarrantyBlock() {
  const { warrantyData } = useNewServiceOrderContext()
  const [form] = Form.useForm()

  const findWarrantyStatus = idToFind =>
    warrantyStatus.find(status => status.id === idToFind)

  const [selectedRows, setSelectedRows] = useState([])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
    },
    {
      title: 'Valor unitário',
      dataIndex: 'valorUnitario',
      render: value =>
        formatNumber(value, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: value =>
        formatNumber(value, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: d =>
        d && (
          <Badge
            color={findWarrantyStatus(d)?.color}
            text={findWarrantyStatus(d)?.name}
          />
        ),
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
    },
    {
      title: 'Pedido',
      dataIndex: 'pedido',
    },
    {
      title: 'NF-e',
      dataIndex: 'nfe',
    },
  ]

  return (
    <div>
      <AuditHistoryModal />
      <WarrantyBlockForm {...{ form }} />
      <WarrantyBlockTableHeader {...{ selectedRows }} />
      <DefaultTable
        rowSelection={rowSelection}
        columns={columns}
        dataSource={warrantyData}
        rowKey={row => row.id}
      />
    </div>
  )
}
