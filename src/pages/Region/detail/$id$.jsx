/**
 * breadcrumb: Cadastro de regiões
 */
import React, { useState } from 'react'
import RegionEdit from './components/RegionEdit'
import PropTypes from 'prop-types'

function Index({ match }) {
  
  const [regionId, setRegionId] = useState(match.params.id || null)
  
  return (
    <div className="container">
     <RegionEdit
       regionId={regionId}
       setRegionId={setRegionId}
     />
    </div>
  )

}

Index.propTypes = {
  match: PropTypes.any,
}

export default Index