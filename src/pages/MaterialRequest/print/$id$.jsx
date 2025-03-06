/**
 * breadcrumb: Impressão da Requisição
 */
import React from 'react'
import router from 'umi/router'
import PrintRequest from './PrintRequest'
import PropTypes from 'prop-types'

const Index = ({ match }) => {
  const requestNewId = match.params.id  
  
  const goRequest = e => {
    e && e.preventDefault()
    router.push(`/MaterialRequest/detail/${requestNewId}`)
  }  
  
  return (
    <PrintRequest requestNewId={requestNewId} onClose={goRequest} /> 
  )
}

Index.propTypes = {
  match: PropTypes.object,
}

export default Index
