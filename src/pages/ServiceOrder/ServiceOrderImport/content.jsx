import React from 'react'
import ServiceOrdersHeader from './components/ServiceOrdersHeader'
import ServiceOrdersTable from './components/ServiceOrdersTable'
import { useServiceOrderContext } from './context/ServiceOrderContext'
import { NoVisualize } from '@utils'
import { Spin } from 'antd'

function Content() {
  const { loadingUserPermissions, canView, userPermissions } =
    useServiceOrderContext()
  return (
    <div className="container">
      <Spin spinning={loadingUserPermissions}>
        {canView && (
          <div>
            <ServiceOrdersHeader />
            <ServiceOrdersTable />
          </div>
        )}
        {canView === false && <NoVisualize userPermissions={userPermissions} />}
      </Spin>
    </div>
  )
}

export default Content
