import { Form } from '@ant-design/compatible'
import { Button, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

export default function ResellerModalForm({
  form,
  searchValue,
  setSearchValue,
}) {
  const { getFieldDecorator } = form
  return (
    <Form layout="vertical">
      <Form.Item label="Nome">
        {getFieldDecorator('name', {
          initialValue: '',
        })(
          <Select
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
            <Option value={1}>Casas Bahia</Option>
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
}

ResellerModalForm.propTypes = {
  form: PropTypes.any,
  searchValue: PropTypes.any,
  setSearchValue: PropTypes.any,
}
