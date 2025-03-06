import { Button, Col, Form, Input, InputNumber, Row, Select, Tag } from 'antd'
import React, { useState } from 'react'
import NewItemModalTable from './NewItemModalTable'

const { Option } = Select

export default function NewItemModalSearch({ selectedRows, setSelectedRows }) {
  const [form] = Form.useForm()
  const filterOptions = [
    {
      id: 1,
      name: 'Lista de itens',
    },
    {
      id: 2,
      name: 'Kit de itens',
    },
    {
      id: 3,
      name: 'Catálogo de produtos',
    },
  ]
  const [selectedFilter, setSelectedFilter] = useState(1)
  const [searchValues, setSearchValues] = useState([])
  const [tableData, setTableData] = useState([])

  function handleSearch() {
    form.validateFields().then(values => {
      const newSearchValue = {
        fieldName: 'Município',
        searchField: values.searchField,
      }
      setSearchValues([...searchValues, { ...newSearchValue }])
      setTableData([
        {
          key: 2,
          codigo: '2240',
          descricao: 'Tirante Branco',
        },
        {
          key: 3,
          codigo: '2241',
          descricao: 'Tirante Preto',
        },
      ])
    })
  }

  return (
    <React.Fragment>
      <Form layout="vertical" form={form}>
        <Row type="flex" gutter={16}>
          <Col span={6}>
            <Form.Item label="Buscar item" name="select">
              <Select
                defaultValue={selectedFilter}
                onChange={e => setSelectedFilter(e)}
              >
                {filterOptions.map(f => (
                  <Option value={f.id}>{f.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {selectedFilter === 1 && (
            <Col span={14} style={{ marginTop: '30px' }}>
              <Form.Item name="searchField">
                <Input placeholder="Informe código ou descrição do item" />
              </Form.Item>
            </Col>
          )}
          {selectedFilter === 2 && (
            <React.Fragment>
              <Col span={10} style={{ marginTop: '30px' }}>
                <Form.Item name="searchField">
                  <Select />
                </Form.Item>
              </Col>
              <Col span={4} style={{ marginTop: '30px' }}>
                <Form.Item name="searchField2">
                  <InputNumber
                    defaultValue={1}
                    min={0}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </React.Fragment>
          )}
          {selectedFilter === 3 && (
            <Col span={14} style={{ marginTop: '30px' }}>
              <Form.Item name="searchField">
                <Select />
              </Form.Item>
            </Col>
          )}
          <Col span={2}>
            <Button
              type="primary"
              style={{ marginTop: '30px' }}
              onClick={handleSearch}
            >
              <i className="fa fa-search fa-lg mr-3" />
              Pesquisar
            </Button>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={6} />
          {searchValues.map(s => (
            <Tag color="blue" closable>
              {s.searchField}
            </Tag>
          ))}
        </Row>
      </Form>
      <NewItemModalTable {...{ tableData, selectedRows, setSelectedRows }} />
    </React.Fragment>
  )
}
