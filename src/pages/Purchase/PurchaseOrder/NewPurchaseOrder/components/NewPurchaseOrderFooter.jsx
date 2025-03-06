import { Button, message } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import { useNewPurchaseOrderContext } from '../context/NewPurchaseOrderContext'

export default function NewPurchaseOrderFooter() {
  const { form, setItemsData } = useNewPurchaseOrderContext()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields([])
      setItemsData([])
    })
  }
  return (
    <div>
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
