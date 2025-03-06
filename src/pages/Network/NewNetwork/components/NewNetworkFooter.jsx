import { Button } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function NewNetworkFooter({ handleSave }) {
  return (
    <div className="mt-8">
      <Button
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
        }}
        onClick={handleSave}
      >
        Salvar
      </Button>
      <Button type="secondary" className="ml-3">
        Cancelar
      </Button>
    </div>
  )
}

NewNetworkFooter.propTypes = {
  handleSave: PropTypes.func,
}
