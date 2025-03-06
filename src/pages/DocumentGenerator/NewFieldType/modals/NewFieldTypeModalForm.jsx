import { isObjEmpty } from '@utils'
import { Form, Input, Switch } from 'antd'
import React from 'react'
import { useNewFieldTypeContext } from '../context/DocumentGeneratorContext'

export default function NewFieldTypeModalForm({ form }) {
  const { editData } = useNewFieldTypeContext()
  const isEdit = !isObjEmpty(editData)
  return (
    <React.Fragment>
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Nome do campo"
          name="descricao"
          rules={[{ required: true, message: 'Campo obrigatório!' }]}
          initialValue={isEdit ? editData.descricao : ''}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Nome ícone"
          initialValue={isEdit ? editData.icone : ''}
          name="icone"
          rules={[{ required: true, message: 'Campo obrigatório!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          initialValue={isEdit ? editData.status === 1 : false}
        >
          <Switch />
        </Form.Item>
      </Form>
    </React.Fragment>
  )
}
