import Breadcrumb from '@components/Breadcrumb'
import { Button } from 'antd'
import React from 'react'
import { useNewFieldContext } from '../context/DocumentGeneratorContext'

export default function NewFieldHeader() {
  const { setNewFieldModalVisible } = useNewFieldContext()
  return (
    <div>
      <Breadcrumb />
      <div className="mt-8">
        <Button type="primary" onClick={() => setNewFieldModalVisible(true)}>
          Novo campo
        </Button>
      </div>
    </div>
  )
}
