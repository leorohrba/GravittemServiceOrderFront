import { Button, message } from 'antd'
import React from 'react'
import { router } from 'umi'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'

export default function NewAssetFooter() {
  const { form } = useNewAssetContext()

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
