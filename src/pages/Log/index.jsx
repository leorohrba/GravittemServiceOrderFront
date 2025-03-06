/**
 * breadcrumb: Log
 * type: Menu
 */
import React from 'react'
import LogForm from './components/LogForm'
import LogHeader from './components/LogHeader'
import LogTable from './components/LogTable'
import LogTableHeader from './components/LogTableHeader'
import { LogProvider, useLogContext } from './context/LogContext'
import LogDetailModal from './modals/LogDetailModal'
import { withWrapper } from 'with-wrapper'
import { Spin } from 'antd'

function Log() {
  const { loading } = useLogContext()
  return (
    <div className="container">
      <Spin size="large" spinning={loading}>
        <LogDetailModal />
        <LogHeader />
        <LogForm />
        <LogTableHeader />
        <LogTable />
      </Spin>
    </div>
  )
}

export const WrapperLog = withWrapper((element, props) => {
  return (
  <LogProvider>
    {element}
  </LogProvider>
  )
})(props => {
  return (
   <Log />
  )
})

export default WrapperLog
