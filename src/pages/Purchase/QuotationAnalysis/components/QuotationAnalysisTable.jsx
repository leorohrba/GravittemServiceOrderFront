import DefaultTable from '@components/DefaultTable'
import { quotationAnalysisStatus } from '@pages/Purchase/enums'
import { Badge, Button, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'
import Link from 'umi/link'
import router from 'umi/router'
import { useQuotationAnalysisContext } from '../context/QuotationAnalysisContext'

export default function QuotationAnalysisTable() {
  const { data, setViewData, rowSelection } = useQuotationAnalysisContext()

  const findStatus = idToFind =>
    quotationAnalysisStatus.find(status => status.id === idToFind)

  function handleClick(record) {
    setViewData(record)
    router.push(`/Purchase/QuotationAnalysis/Detail?id=${record.id}`)
  }

  const columns = [
    {
      title: 'Cotação',
      dataIndex: 'cotacao',
    },
    {
      title: 'Solicitante da cotação',
      dataIndex: 'solicitante',
    },
    {
      title: 'Data de solicitação',
      dataIndex: 'dataSolicitacao',
      render: d => d && moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Status',
      render: d =>
        d && (
          <Badge
            color={findStatus(d.status)?.color}
            text={findStatus(d.status)?.name}
          />
        ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title="Visualizar">
          <Button
            onClick={() => {
              handleClick(d)
            }}
            shape="circle"
            type="primary"
            className="iconButton"
            ghost
            size="default"
          >
            <i className="fa fa-eye fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
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
              Não há dados aqui. Para visualizar faça uma nova{' '}
              <Link to="/Purchase/PurchaseRequest">
                Solicitação de compra <i className="fa fa-external-link" />
              </Link>
            </h3>
          </div>
        ),
      }}
    />
  )
}
