import { Button } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import router from 'umi/router'
import { formatMessage } from 'umi-plugin-react/locale'

export default function NewAssetFooter({ handleSave, isSaving, canBeUpdated, loading }) {
  return (
    <React.Fragment>
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
          {formatMessage({
            id: 'saveButton',
          })}
        </Button>
      )}
      <Button type="secondary" onClick={() => router.push('/occurrenceRoutine/Assets')}>
        {canBeUpdated ? 
          formatMessage({
            id: 'cancelButton',
          })
          : 'Voltar'}
      </Button>
    </React.Fragment>
  )
}

NewAssetFooter.propTypes = {
  handleSave: PropTypes.any,
  isSaving: PropTypes.bool,
  loading: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
}
