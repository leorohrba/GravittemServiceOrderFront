import { Button, Form, Input, Select } from 'antd'
import React from 'react'

const { Option } = Select

export default function SearchAssetModalForm({ form, getSearchValues }) {
  return (
    <Form form={form}>
      <Input.Group compact>
        <Form.Item noStyle name="searchField" initialValue="Ativo">
          <Select onChange={() => form.resetFields()}>
            <Option value="Ativo">Ativo</Option>
          </Select>
        </Form.Item>
        <Form.Item noStyle name="searchValue">
          <Input
            style={{
              width: '70%',
            }}
            onPressEnter={getSearchValues}
          />
        </Form.Item>
        <Button type="primary" onClick={getSearchValues}>
          <i className="fa fa-search fa-lg mr-3" />
          Pesquisar
        </Button>
        <Button type="primary" className="ml-1">
          <i className="fa fa-chevron-down" />
        </Button>
      </Input.Group>
    </Form>
  )
}
