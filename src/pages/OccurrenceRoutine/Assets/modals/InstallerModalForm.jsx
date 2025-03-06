import { Form } from '@ant-design/compatible'
import { Button, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const { Option } = Select

export default function InstallerModalForm({ form }) {
  const [searchValue, setSearchValue] = useState('')

  const { getFieldDecorator } = form
  return (
    <Form layout="vertical">
      <Form.Item label="Nome">
        {getFieldDecorator('name', {
          initialValue: '',
        })(
          <Select
            style={{
              width: '100%',
            }}
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onSearch={value => setSearchValue(value)}
            notFoundContent={
              <div
                style={{
                  cursor: 'default',
                  color: 'black',
                  whiteSpace: 'normal',
                }}
                className="flex-wrap"
              >
                Nenhum resultado encontrado com o termo <b>{searchValue}</b>.{' '}
                Clique para{' '}
                <Button type="link" className="px-0">
                  cadastrar
                </Button>{' '}
                ou{' '}
                <Button type="link" className="px-0">
                  refinar a busca
                </Button>
                .
              </div>
            }
          >
            <Option value={1}>João da Silva</Option>
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
}

InstallerModalForm.propTypes = {
  form: PropTypes.any,
}
