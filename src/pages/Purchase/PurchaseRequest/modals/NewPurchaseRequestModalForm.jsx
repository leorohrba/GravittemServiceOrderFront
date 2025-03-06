import { isObjEmpty } from '@utils'
import { Form, Input, Select } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { usePurchaseRequestContext } from '../context/PurchaseRequestContext'

const { Option } = Select
const { TextArea } = Input

export default function NewPurchaseRequestModalForm({ form }) {
  const { itemsData, editData } = usePurchaseRequestContext()

  const isEdit = !isObjEmpty(editData)

  const selectAfter = (
    <Select defaultValue="un">
      <Option value="un">un</Option>
    </Select>
  )

  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        label="Item"
        name="item"
        initialValue={isEdit ? editData.descricao : ''}
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <Select suffixIcon={<i className="fa fa-search" />} showSearch>
          {itemsData.map(d => (
            <Option value={d.id}>{`${d.codigo} - ${d.descricao}`}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Quantidade solicitado"
        name="solicitado"
        initialValue={isEdit ? editData.solicitado : ''}
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <Input addonAfter={selectAfter} className="w-1/2" />
      </Form.Item>
      <Form.Item
        label="Motivo"
        name="motivo"
        initialValue={isEdit ? editData.motivo : ''}
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
      </Form.Item>
    </Form>
  )
}
