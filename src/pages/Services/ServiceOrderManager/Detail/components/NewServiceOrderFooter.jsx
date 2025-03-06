import { Button, message } from 'antd'
import React from 'react'
import { router } from 'umi'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

export default function NewServiceOrderFooter() {
  const { form } = useNewServiceOrderContext()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
    })
  }
  return (
    <div className="mt-4">
      <Button
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
        }}
        onClick={handleSave}
      >
        Salvar
      </Button>
      <Button type="secondary" className="ml-3" onClick={() => router.goBack()}>
        Cancelar
      </Button>
    </div>
  )
}
