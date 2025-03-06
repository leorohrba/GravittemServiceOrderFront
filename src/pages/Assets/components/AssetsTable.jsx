import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { getLocaleDateFormat, hasPermission } from '@utils'
import { Badge, Button, Tag, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useAssetContext } from '../context/AssetContext'

export default function AssetsTable() {
  const {
    data,
    setSelectedRows,
    userPermissions,
    editAsset,
    keyTable,
  } = useAssetContext()

  const columns = [
    {
      title: 'Ativo',
      render: d => (
        <span>
          <p className="mb-0">
            {!!d.codigoProduto && (
              <span className="mr-2">{`${d.codigoProduto} -`}</span>
            )}
            <span>{d.descricaoProduto}</span>
          </p>
          {!!d.numeroSerie && (
            <SmallTableFieldDescription
              label={`N° série ${d.numeroSerie}`}
              fontStyle="italic"
            />
          )}
        </span>
      ),
    },
    {
      title: 'Compra',
      render: d => (
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
                  {d.dataCompra &&
                    moment(d.dataCompra).format(getLocaleDateFormat())}
                </span>
              }
              fontStyle="italic"
            />
          )}
        </span>
      ),
    },
    {
      title: 'Garantia',
      render: d => (
        <span>
          <p className="mb-0">{d.garantia}</p>
          {d.dataGarantia && (
            <SmallTableFieldDescription
              label={
                <span className="mb-0">
                  <i
                    className="fa fa-flag fa-lg mr-2"
                    style={{ color: 'rgba(0, 0, 0, 0.67)' }}
                  />
                  {d.dataGarantia &&
                    moment(d.dataGarantia).format(getLocaleDateFormat())}
                </span>
              }
              fontStyle="italic"
            />
          )}
        </span>
      ),
    },
    {
      title: 'Cliente',
      render: d => (
        <span>
          <p className="mb-0">{d.nomeCliente}</p>
          <SmallTableFieldDescription
            label={d.cpfCnpjFormatado}
            fontStyle="italic"
          />
        </span>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: tags =>
        tags && tags.map(tag => <Tag className="mr-1">{tag}</Tag>),
    },
    {
      title: 'Status',
      render: d => (
        <Badge
          style={{ color: d.ativo ? 'green' : 'red' }}
          color={d.ativo ? 'green' : 'red'}
          text={d.ativo ? 'Ativo' : 'Inativo'}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip
          placement="top"
          title={formatMessage({
            id: hasPermission(userPermissions, 'Alter') ? 'edit' : 'query',
          })}
        >
          <Button
            className="iconButton"
            shape="circle"
            type="primary"
            ghost
            onClick={() => {
              editAsset(d.id)
            }}
          >
            <i
              className={`fa fa-${
                hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'
              } fa-lg`}
            />
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
    <DefaultTable
      className="mt-5"
      dataSource={data}
      columns={columns}
      rowKey={record => record.id}
      rowSelection={rowSelection}
      key={keyTable}
    />
  )
}
