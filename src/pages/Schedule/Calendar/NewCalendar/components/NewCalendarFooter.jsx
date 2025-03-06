import { Button } from 'antd'
import React from 'react'
import { useNewCalendarContext } from '../context/NewCalendarContext'

export default function NewCalendarFooter() {

  const { canBeUpdated, onClose, handleSave } = useNewCalendarContext()

  return (
    <div>
      {canBeUpdated && (
        <>
          <Button
            onClick={() => handleSave(false)}
            className="mr-3"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
          >
            Salvar
          </Button>
          <Button
            onClick={() => handleSave(true)}
            className="mr-3"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
          >
            Salvar e retornar
          </Button>
        </>
      )}
      <Button type="secondary" onClick={() => onClose && onClose()}>
        Cancelar
      </Button>
    </div>
  )
}
