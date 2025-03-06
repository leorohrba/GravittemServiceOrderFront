import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { servicesStatus } from '@pages/Services/enums'
import { getLocaleCurrency } from '@utils'
import { Badge, Button, Form, Tooltip } from 'antd'
import React, { useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import AddServiceModal from '../modals/AddServiceModal'
import ServicesBlockTableFooter from './ServicesBlockTableFooter'
import ServicesBlockTableHeader from './ServicesBlockTableHeader'

export default function ServicesBlock() {
  const { servicesTableData } = useNewServiceOrderContext()

  const findServiceStatus = idToFind =>
    servicesStatus.find(status => status.id === idToFind)

  const [selectedRows, setSelectedRows] = useState([])
  const [selectedService, setSelectedService] = useState()

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
      title: 'Servico',
      dataIndex: 'servico',
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
      title: 'Desconto',
      render: d => (
        <span>
          <p className="mb-0">
            {formatNumber(d.desconto, {
              style: 'currency',
              currency: getLocaleCurrency(),
            })}
          </p>
          <SmallTableFieldDescription
            label={`${d.porcDesconto}%`}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
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
            color={findServiceStatus(d)?.color}
            text={findServiceStatus(d)?.name}
          />
        ),
    },
    {
      title: 'Orçamento',
      dataIndex: 'orcamento',
      align: 'center',
      render: d => (
        <i
          className="fa fa-check-circle fa-lg"
          style={{ color: d ? 'hsl(210, 79%, 46%)' : 'lightgray' }}
        />
      ),
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

  return (
    <div>
      <AddServiceModal {...{ selectedService }} />
      <Form layout="vertical">
        <ServicesBlockTableHeader {...{ selectedRows, setSelectedService }} />
      </Form>
      <DefaultTable
        rowSelection={rowSelection}
        columns={columns}
        dataSource={servicesTableData}
        rowKey={row => row.id}
      />
      <ServicesBlockTableFooter />
    </div>
  )
}
