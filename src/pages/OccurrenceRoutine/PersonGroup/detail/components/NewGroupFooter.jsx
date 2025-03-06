import { Button } from 'antd'
import PropTypes from 'prop-types'
import { hasPermission } from '@utils'
import React from 'react'

export default function NewGroupFooter({ handleSave, isSaving, userPermissions, handleCancel }) {
  return (
    <div className="mt-5">
      {hasPermission(userPermissions, 'Alter') && (
        <Button
          className="mr-3"
          loading={isSaving}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
          }}
          onClick={handleSave}
        >
          Salvar
        </Button>
      )}
      <Button onClick={() => handleCancel()} type="secondary">Cancelar</Button>
    </div>
  )
}

NewGroupFooter.propTypes = {
  handleSave: PropTypes.func,
  handleCancel: PropTypes.func,
  userPermissions: PropTypes.array,
  isSaving: PropTypes.bool
}
