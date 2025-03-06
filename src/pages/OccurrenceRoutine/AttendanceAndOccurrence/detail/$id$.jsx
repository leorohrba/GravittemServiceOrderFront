/**
 * breadcrumb: Editar atendimento
 * hide: true
 */
import React, { useState } from 'react'
import EditAttendance from './EditAttendance'
import PropTypes from 'prop-types'

export default function Index({ match, location }) {

  const [id, setId] = useState(match.params.id ? match.params.id : null)
  
  return (
     <EditAttendance
       attendanceId={id} 
       setAttendanceId={setId} 
       isRouter 
       location={location}
     />) 

}

Index.propTypes = {
  match: PropTypes.any,
  location: PropTypes.any,
}



