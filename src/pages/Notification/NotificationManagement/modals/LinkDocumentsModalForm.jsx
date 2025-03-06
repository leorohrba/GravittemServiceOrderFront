import { Button, Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function LinkDocumentsModalForm({ form, getSearchValues }) {
  return (
    <Form form={form}>
      <Input.Group compact>
        <Form.Item name="fieldName">
          <Select
            onChange={() => form.resetFields()}
            style={{ width: '100%' }}
            defaultValue="os"
          >
            <Option value="os">Ordem de serviço</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="searchValue"
          style={{
            width: '50%',
          }}
        >
          <Input
            style={{
              width: '100%',
            }}
            onPressEnter={getSearchValues}
          />
        </Form.Item>
        <Button type="primary" onClick={getSearchValues} htmlType="submit">
          <i className="fa fa-search fa-lg mr-3" aria-hidden="true" />
          {formatMessage({
            id: 'person.modals.linkedEntriesModal.search',
          })}
        </Button>
        <Button type="primary" className="ml-1">
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </Button>
      </Input.Group>
    </Form>
  )
}

LinkDocumentsModalForm.propTypes = {
  form: PropTypes.shape({
    resetFields: PropTypes.func,
  }),
  getSearchValues: PropTypes.func,
}
