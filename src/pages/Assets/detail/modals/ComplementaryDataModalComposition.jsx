import { Button, Col, Form, Input, Row, Select, Table, Tooltip } from 'antd'
import React, { useState } from 'react'

export default function ComplementaryDataModalComposition() {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      codigo: '2123',
      descricao: 'Tirante borracha',
      quantidade: 10,
      garantia: 10,
      referencia: 1,
      fctao: 'F',
    },
  ])
  const [editData, setEditData] = useState()
  const [selectedRows, setSelectedRows] = useState([])

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
      title: 'Garantia (meses)',
      dataIndex: 'garantia',
    },
    {
      title: 'Referência',
      dataIndex: 'referencia',
    },
    {
      title: 'FCTAO',
      dataIndex: 'fctao',
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
            onClick={() => setEditData(record)}
          >
            <i className="fa fa-pencil fa-lg" />
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
    <Form layout="vertical">
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Item" name="item">
            <Select
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              suffixIcon={<i className="fa fa-search" />}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Quantidade" name="quantidade">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Garantia" name="garantia">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Referência" name="referencia">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="FCTAO" name="fctao">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8} className="self-center">
          <Button type="primary" className="mt-4">
            Salvar item
          </Button>
        </Col>
      </Row>
      <Table
        className="mt-5"
        dataSource={tableData}
        columns={columns}
        rowSelection={rowSelection}
        rowKey={row => row.id}
        pagination={false}
      />
    </Form>
  )
}
