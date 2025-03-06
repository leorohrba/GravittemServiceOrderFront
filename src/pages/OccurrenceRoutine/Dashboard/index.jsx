/**
 * breadcrumb: Dashboard
 */
import React, { useState, useEffect } from 'react'
import AttendanceView from './views/AttendanceView'
import {
  getPermissions
} from '@utils'

const viewOptions = [
                     { value: 'A',
                        label: 'Atendimento'
                     }
                    ]                        

function Dashboard() {
  
  const [viewOption, setViewOption] = useState('') // O viewOption padrão deve ser setado no useEffect
  const [userPermissions, setUserPermissions] = useState([])

  useEffect(() => {
    setViewOption('A')
    setPermissions()
  },[])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  return (
    <div className="container bg-gray-100">

       <AttendanceView
         viewOptions={viewOptions}
         viewOption={viewOption}
         setViewOption={setViewOption}
         show={viewOption === 'A'}
         userPermissions={userPermissions}
       />
    
    </div>
  )

}

export default Dashboard