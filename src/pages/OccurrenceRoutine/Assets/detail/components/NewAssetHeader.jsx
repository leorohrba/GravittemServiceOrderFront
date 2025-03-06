import { Row, Col } from 'antd'
import React from 'react'
import router from 'umi/router'
import PropTypes from 'prop-types'

export default function NewAssetHeader({assetId, loading, isSaving, canBeUpdated}) {
  
  const title = (isSavingForm) => ( isSavingForm ? 'Salvando...' : 'Carregando...')
  
  return (
  <Row type="flex" className="mb-4">
    <Col>
      <span
        style={{
          color: '#1976D2',
          cursor: 'pointer',
        }}
        onClick={() => router.push('/occurrenceRoutine/Assets')}
        role="button"
      >
        Ativos
      </span>
      <i className="mx-3 fa fa-angle-right" />
      {loading ? title(isSaving) : 
         assetId ? 
           (<span>{`${canBeUpdated ? 'Editar' : 'Consultar'} ativo`}</span>) :
           'Novo ativo'
      }
    </Col>
  </Row> 
  )
}

NewAssetHeader.propTypes = {
  assetId: PropTypes.number,
  loading: PropTypes.bool,
  isSaving: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
}