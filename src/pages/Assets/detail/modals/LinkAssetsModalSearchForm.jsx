import { Button, Input, Select } from 'antd'
import React from 'react'

const { Option } = Select

export default function LinkAssetsModalSearchForm({ form, getSearchValues }) {
  const { getFieldDecorator } = form

  return (
    <Input.Group
      compact
      style={{
        display: 'flex',
      }}
    >
      {getFieldDecorator('fieldName', {
        initialValue: 'produto',
      })(
        <Select onChange={() => form.resetFields()}>
          <Option value="produto">Produto</Option>
        </Select>,
      )}
      {getFieldDecorator('searchValue', {})(
        <Input
          style={{
            width: '65%',
          }}
          onPressEnter={getSearchValues}
        />,
      )}
      <Button type="primary" onClick={getSearchValues}>
        <i className="fa fa-search fa-lg mr-3" aria-hidden="true" />
        Pesquisar
      </Button>
      <Button type="primary" className="ml-1">
        <i className="fa fa-chevron-down" aria-hidden="true" />
      </Button>
    </Input.Group>
  )
}
