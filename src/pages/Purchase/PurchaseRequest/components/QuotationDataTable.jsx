import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { getLocaleCurrency } from '@utils'
import { InputNumber, Table } from 'antd'
import update from 'immutability-helper'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useQuotationDataContext } from '../context/QuotationDataContext'

export default function QuotationDataTable() {
  const { data, setData, fornecedor } = useQuotationDataContext()

  function handleSave(id, value) {
    const newData = [...data]
    const index = newData.findIndex(item => id === item.id)
    const newTotal = data[index].quantidade * value
    setData(
      update(newData, {
        [index]: {
          valorUnitario: { $set: value },
          valorTotal: { $set: newTotal },
        },
      }),
    )
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Item',
      render: d => (
        <span>
          <p className="mb-0">{d.item}</p>
          <SmallTableFieldDescription label={d.codigo} fontStyle="italic" />
        </span>
      ),
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
    },
    {
      title: 'Unidade',
      dataIndex: 'unidade',
    },
    {
      title: 'Valor unitário',
      render: d => (
        <InputNumber
          className="table-input-number"
          defaultValue={d.valorUnitario}
          decimalSeparator=","
          formatter={value => value && `R$ ${value}`}
          parser={value => value.replace('R$ ', '')}
          precision={2}
          onChange={e => handleSave(d.id, e)}
          style={{ width: '130px' }}
        />
      ),
    },
    {
      title: 'Valor total',
      dataIndex: 'valorTotal',
      render: d =>
        formatNumber(d || 0, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
  ]
  return (
    <div>
      <h1>Cotação</h1>
      <h3>
        A <b>{fornecedor.nome}</b>, solicito a sua melhor cotação para os itens
        abaixo. Preencha o valor unitário dos itens que possui em estoque. Os
        itens sem valor unitário serão desconsiderados.
      </h3>
      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  )
}
