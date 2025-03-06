import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Badge, Button, Col, Divider, Form, Row, Select, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

export default function ClientBlock() {
  const { clientTableData } = useNewServiceOrderContext()

  const [searchValue, setSearchValue] = useState('')

  const columns = [
    {
      title: 'Documento',
      dataIndex: 'documento',
    },
    {
      title: 'Nome',
      render: d => (
        <div className="flex">
          <p className="mb-0 mr-3">{d.nome}</p>
          {d.registros > 0 && (
            <Tooltip
              placement="top"
              title={
                <div>
                  {d.registros} registros encontrados com esse CPF.
                  <a href="#0"> Clique aqui para ver detalhes.</a>
                </div>
              }
            >
              <Badge
                count={d.registros}
                style={{
                  backgroundColor: '#f56a00',
                }}
              />
            </Tooltip>
          )}
          {d.bloqueado && (
            <Tooltip placement="top" title={<div>Cadastro bloqueado.</div>}>
              <i
                className="fa fa-lock fa-lg ml-3 mt-1"
                style={{ color: '#f5222d' }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Telefone',
      render: d => (
        <React.Fragment>
          <p className="mb-0">
            {d.telefone}{' '}
            {d.principal && (
              <i className="fa fa-star fa-lg ml-2 text-orange-500" />
            )}
          </p>
        </React.Fragment>
      ),
    },
    {
      title: 'Endereço',
      render: d => (
        <React.Fragment>
          <p className="mb-0">{d.endereco}</p>
          <SmallTableFieldDescription
            label={d.complemento}
            fontStyle="italic"
            color="gray"
          />
        </React.Fragment>
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

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      //   setSelectedRows(selectedRow)
    },
  }

  return (
    <div>
      <Form layout="vertical">
        <Row type="flex" justify="space-between">
          <Col span={6}>
            <Form.Item label="Cliente" name="cliente">
              <Select
                suffixIcon={<i className="fa fa-search" />}
                showSearch
                onSearch={e => setSearchValue(e)}
                dropdownRender={menu => (
                  <div className="mx-1">
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <p className="text-black pb-0">
                      0 resultados encontrados com o termo <b>{searchValue}</b>.
                      Clique para{' '}
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
          <Button>
            <i className="fa fa-ellipsis-v" />
          </Button>
        </Row>
      </Form>
      <DefaultTable
        rowSelection={rowSelection}
        columns={columns}
        dataSource={clientTableData}
        rowKey={row => row.id}
      />
    </div>
  )
}
