import { Button } from 'antd'
import React from 'react'

export default function ScheduleConfigurationFooter({ handleSave }) {
  return (
    <Button
      className="mt-6"
      style={{ backgroundColor: '#4CAF50', color: 'white' }}
      onClick={handleSave}
    >
      Salvar
    </Button>
  )
}
