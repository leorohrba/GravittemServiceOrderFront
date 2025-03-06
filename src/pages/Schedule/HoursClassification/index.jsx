/**
 * breadcrumb: Classificação de horas
 */
import React from 'react'
import HourClassificationHeader from './components/HourClassificationHeader'
import HourClassificationTable from './components/HourClassificationTable'
import { HourClassificationProvider, useHourClassificationContext } from './context/HourClassificationContext'
import { withWrapper } from 'with-wrapper'
import { Spin } from 'antd'
import { hasPermission, NoVisualize } from '@utils' 

function HourClassification() {
  
  const { loading, userPermissions } = useHourClassificationContext()

  return hasPermission(userPermissions, 'Visualize') ? (
    <div className="container">
      <Spin spinning={loading} size="large">
        <HourClassificationHeader />
        <HourClassificationTable />
      </Spin>
    </div>
  ) : (<NoVisualize userPermissions={userPermissions} />)
}

export const WrapperHourClassification = withWrapper((element, props) => {
  return (
  <HourClassificationProvider>
    {element}
  </HourClassificationProvider>
  )
})(props => {
  return (
   <HourClassification />
  )
})

export default WrapperHourClassification