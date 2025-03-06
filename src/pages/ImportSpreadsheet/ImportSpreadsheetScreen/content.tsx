import React from 'react'
import ServiceOrdersHeader from '@pages/ServiceOrder/ServiceOrderImport/components/ServiceOrdersHeader'
import { useServiceOrderContext } from '@pages/ServiceOrder/ServiceOrderImport/context/ServiceOrderContext'
import { NoVisualize } from '@utils'
import { Spin } from 'antd'
import ServiceOrdersTable from '@pages/ServiceOrder/ServiceOrderImport/components/ServiceOrdersTable'

// Content referente à tela ImportSpreadsheetScreen
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
