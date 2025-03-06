import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { confirmDelete } from '@utils'
import { Button, Col, Divider, Form, Row, Select, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

export default function AssetBlock() {
  const { assetTableData, setAssetTableData } = useNewServiceOrderContext()

  const [selectedRows, setSelectedRows] = useState([])
  const [searchValue, setSearchValue] = useState('')

  function deleteAsset() {
    const keysToRemove = selectedRows.map(selectedRow => selectedRow.key)
    const filteredArray = assetTableData.filter(
      i => !keysToRemove.includes(i.key),
    )
    setAssetTableData(filteredArray)
    setSelectedRows([])
  }

  const columns = [
    {
      title: 'Ativo',
      render: d => (
        <span>
          <p className="mb-0">{d.ativo}</p>
          <SmallTableFieldDescription
            label={`Número de série ${d.nSerie}`}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
    },
    {
      title: 'Compra',
      render: d => (
        <span>
          <p className="mb-0">{d.nf}</p>
          <SmallTableFieldDescription
            label={d.data.format('DD/MM/YYYY')}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
    },
    {
      title: 'Defeito reclamado',
      dataIndex: 'defeitoReclamado',
    },
    {
      title: 'Defeito constatado',
      dataIndex: 'defeitoConstatado',
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: record => (
        <React.Fragment>
          <Tooltip placement="top" title="Comentários">
            <Button
              shape="circle"
              type="primary"
              className="iconButton mr-1"
              ghost
              size="default"
            >
              <i className="fa fa-comment fa-lg" />
            </Button>
          </Tooltip>
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
        </React.Fragment>
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
      <Form layout="vertical">
        <Row type="flex" justify="space-between">
          {selectedRows.length === 0 ? (
            <Col span={6}>
              <Form.Item label="Ativo" name="ativo">
                <Select
                  suffixIcon={<i className="fa fa-search" />}
                  showSearch
                  onSearch={e => setSearchValue(e)}
                  dropdownRender={menu => (
                    <div className="mx-1">
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <p className="text-black pb-0">
                        0 resultados encontrados com o termo{' '}
                        <b>{searchValue}</b>. Clique para{' '}
                        <Button type="link" className="px-0">
                          cadastrar outro
                        </Button>{' '}
                        ou{' '}
                        <Button type="link" className="px-0">
                          refinar busca
                        </Button>
                        .
                      </p>
                    </div>
                  )}
                />
              </Form.Item>
            </Col>
          ) : (
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
              }}
              className="my-4"
              onClick={() =>
                confirmDelete(
                  selectedRows.length,
                  deleteAsset,
                  ['Excluir ativo'],
                  [
                    `Deseja excluir o ativo "${selectedRows[0].ativo}" da ordem de serviço?`,
                  ],
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
        dataSource={assetTableData}
        rowKey={row => row.id}
      />
    </div>
  )
}
