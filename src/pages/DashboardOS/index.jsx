/**
 * breadcrumb: Dashboard OS
 */
import React, { useState, useEffect } from 'react'
import ServiceOrderDashboard from './components/ServiceOrderDashboard'
import { getPermissions } from '@utils'

function Index() {
  const [userPermissions, setUserPermissions] = useState([])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  useEffect(() => {
    setPermissions()
  }, [])

  return (
    <div className="container bg-gray-100">
      <ServiceOrderDashboard userPermissions={userPermissions} />
    </div>
  )
}

export default Index
