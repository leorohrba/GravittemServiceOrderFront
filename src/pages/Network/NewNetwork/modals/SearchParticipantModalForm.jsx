import { Form } from '@ant-design/compatible'
import { Button, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function SearchParticipantModalForm({ form, getSearchValues }) {
  const { getFieldDecorator } = form
  return (
    <Form
      style={{
        display: 'flex',
        height: '40px',
      }}
    >
      <Input.Group compact>
        {getFieldDecorator('fieldName', {
          initialValue: 'city',
        })(
          <Select onChange={() => form.resetFields()}>
            <Option value="city">Município</Option>
          </Select>,
        )}
        {getFieldDecorator(
          'searchValue',
          {},
        )(
          <Input
            style={{
              width: '58%',
            }}
            onPressEnter={getSearchValues}
          />,
        )}
        <Button type="primary" onClick={getSearchValues}>
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

SearchParticipantModalForm.propTypes = {
  form: PropTypes.shape({
    resetFields: PropTypes.func,
    getFieldDecorator: PropTypes.func,
  }),
  getSearchValues: PropTypes.func,
}
