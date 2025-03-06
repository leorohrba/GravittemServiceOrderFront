import { Button } from 'antd'
import React from 'react'
import router from 'umi/router'
import { useNewAssetContext } from '../context/NewAssetContext'

export default function NewAssetFooter({ handleSave }) {
  const { canBeUpdated, isSaving, loading } = useNewAssetContext()

  return (
    <div className="mt-4">
      {(!loading || isSaving) && canBeUpdated && (
        <Button
          className="mr-3"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
          }}
          loading={isSaving}
          onClick={handleSave}
        >
          Salvar
        </Button>
      )}
      <Button type="secondary" onClick={() => router.push('/Assets')}>
        {canBeUpdated ? 'Cancelar' : 'Voltar'}
      </Button>
    </div>
  )
}
