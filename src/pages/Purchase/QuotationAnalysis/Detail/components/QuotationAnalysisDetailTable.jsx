import DefaultTable from '@components/DefaultTable'
import { getLocaleCurrency } from '@utils'
import { Divider, List, Select, Tag } from 'antd'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useQuotationAnalysisDetailContext } from '../context/QuotationAnalysisDetailContext'

const { Option } = Select

export default function QuotationAnalysisDetailTable() {
  const {
    itemsData,
    providers,
    rowSelection,
    selectedRows,
    optionsList,
    total,
  } = useQuotationAnalysisDetailContext()

  const columns = [
    {
      title: 'Item',
      render: d => <div>{`${d.codigo} - ${d.item}`}</div>,
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
    },
    {
      title: 'Fornecedor',
      render: d => (
        <Select value={d.fornecedor} style={{ width: '70%' }}>
          {providers.map(p => (
            <Option value={p.id}>
              <div className="flex justify-between">
                <span>{p.nome}</span>
                {d.melhorValor === p.id && (
                  <Tag
                    className="my-auto"
                    style={{
                      color: '#4CAF50',
                      border: '1px solid #4CAF50',
                    }}
                  >
                    Melhor preço
                  </Tag>
                )}
              </div>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      render: d =>
        formatNumber(d || 0, {
          style: 'currency',
          currency: getLocaleCurrency(),
        }),
    },
  ]
  return (
    <DefaultTable
      dataSource={itemsData}
      columns={columns}
      rowSelection={rowSelection}
      rowKey={row => row.id}
      pagination={false}
      footer={() => (
        <div>
          <List.Item>
            <div>Frete</div>
            <div>
              {selectedRows.length > 0 &&
                selectedRows.map(s => (
                  <React.Fragment>
                    <b>{optionsList.find(p => p.id === s.fornecedor).nome}</b>
                    <div>
                      {formatNumber(
                        optionsList.find(p => p.id === s.fornecedor).frete || 0,
                        {
                          style: 'currency',
                          currency: getLocaleCurrency(),
                        },
                      )}
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </List.Item>
          <Divider className="my-1" />
          <List.Item>
            <div>Condições de pagamento</div>
            <div>
              {selectedRows.length > 0 &&
                selectedRows.map(s => (
                  <React.Fragment>
                    <b>{optionsList.find(p => p.id === s.fornecedor).nome}</b>
                    <div>
                      {
                        optionsList.find(p => p.id === s.fornecedor)
                          .condicaoPagamento
                      }
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </List.Item>
          <Divider className="my-1" />
          <List.Item className="pb-0">
            <h2 className="font-bold">Total</h2>
            <div className="font-bold">
              {formatNumber(total || 0, {
                style: 'currency',
                currency: getLocaleCurrency(),
              })}
            </div>
          </List.Item>
        </div>
      )}
    />
  )
}
