import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Form, Select, Table, Tag, Tooltip } from 'antd'
import React from 'react'
import { usePurchaseRequestContext } from '../context/PurchaseRequestContext'

const { Option } = Select

export default function QuotationRequestModalForm({
  form,
  selectedProvider,
  setSelectedProvider,
}) {
  const { selectedRows, provider } = usePurchaseRequestContext()

  function handleSelection(key) {
    const selected = provider.find(p => p.id === key)
    setSelectedProvider(selected)
  }

  const columns = [
    {
      title: 'Item',
      render: d =>
        d && (
          <span>
            <p className="mb-0">{d.descricao}</p>
            <SmallTableFieldDescription label={d.codigo} fontStyle="italic" />
          </span>
        ),
    },
    {
      title: 'Quantidade',
      dataIndex: 'solicitado',
    },
  ]
  return (
    <React.Fragment>
      <div>
        <i className="fa fa-file-text-o fa-lg mr-1" /> Cotação
      </div>
      <Table dataSource={selectedRows} columns={columns} pagination={false} />
      <Form layout="vertical" form={form}>
        <Form.Item label="Fornecedor (e-mail)" className="mb-0">
          <Select onSelect={e => handleSelection(e)} showSearch>
            {provider.map(p => (
              <Option value={p.id}>{p.nome}</Option>
            ))}
          </Select>
        </Form.Item>
        {selectedProvider.nome && (
          <Tooltip title={selectedProvider.email}>
            <Tag color="blue" closable onClose={() => setSelectedProvider({})}>
              {selectedProvider.nome}
            </Tag>
          </Tooltip>
        )}
      </Form>
    </React.Fragment>
  )
}
