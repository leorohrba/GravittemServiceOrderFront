import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { getLocaleDateFormat, hasPermission, customSort } from '@utils'
import { Badge, Button, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function AssetsTable(
  { data, 
    rowSelection,
    editAsset,  
    keyTable,    
    userPermissions,
  }) {
  const columns = [
    {
      title: formatMessage({
        id: 'occurrenceRoutine.assets.asset',
      }),
      key: 'asset',
      dataIndex: 'descricaoProduto',
      sorter: (a, b) => customSort(a.descricaoProduto, b.descricaoProduto),
      render: (text, d) => (
        <span>
          <p className="mb-0">
            {!!d.codigoProduto && (
               <span className="mr-2">{`${d.codigoProduto} -`}</span>
            )}
            <span>{d.descricaoProduto}</span>
          </p>
          {!!d.numeroSerie && (
            <SmallTableFieldDescription
              label={`${formatMessage({
                id: 'occurrenceRoutine.assets.serialNumber',
              })} ${d.numeroSerie}`}
              fontStyle="italic"
            />
          )}  
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.assets.purchase',
      }),
      key: 'purchase',
      dataIndex: 'numeroNotaFiscal',
      sorter: (a,b) => customSort(a.numeroNotaFiscal, b.numeroNotaFiscal),
      render: (text, d) => (
        <span>
          {d.numeroNotaFiscal && ( 
            <p className="mb-0">NF - {d.numeroNotaFiscal}</p>
          )}
          {d.dataCompra && (
            <SmallTableFieldDescription
              label={
                <span className="mb-0">
                  <i
                    className="fa fa-flag-o fa-lg mr-2"
                    style={{ color: 'rgba(0, 0, 0, 0.67)' }}
                  />
                  {d.dataCompra && moment(d.dataCompra).format(getLocaleDateFormat())}
                </span>
              }
              fontStyle="italic"
            />
          )}
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.assets.client',
      }),
      key: 'client',
      dataIndex: 'nomeCliente',
      sorter: (a, b) => customSort(a.nomeCliente, b.nomeCliente),
      render: (text, d) => (
        <span>
          <p className="mb-0">{d.nomeCliente}</p>
          <SmallTableFieldDescription label={d.cpfCnpjFormatado} fontStyle="italic" />
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'contract.index.status' }),
      key: 'status',
      dataIndex: 'ativo',
      sorter: (a, b) => a.ativo - b.ativo, 
      render: (text, d) => (
        <Badge
          style={{ color: d.ativo ? 'green' : 'red'}}
          color={
              d.ativo
              ? 'green'
              : 'red'
          }
          text={d.ativo ? 'Ativo' : 'Inativo'}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title={formatMessage({ id: hasPermission(userPermissions, 'Alter') ? 'edit' : 'query' })}>
          <Button
            className="iconButton"
            shape="circle"
            type="primary"
            ghost
            onClick={() => {
              editAsset(d.id)
            }}
          >
            <i className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'} fa-lg`} />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
    <DefaultTable
      className="mt-5"
      dataSource={data}
      columns={columns}
      rowKey={record => record.key}
      rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
      key={keyTable}
    />
  )
}

AssetsTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  editAsset: PropTypes.func,
  keyTable: PropTypes.number,
  userPermissions: PropTypes.array,
}
