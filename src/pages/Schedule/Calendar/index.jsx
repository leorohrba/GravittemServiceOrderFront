/**
 * breadcrumb: Calendário
 */
import React from 'react'
import CalendarHeader from './components/CalendarHeader'
import CalendarTable from './components/CalendarTable'
import { CalendarProvider, useCalendarContext } from './context/CalendarContext'
import { withWrapper } from 'with-wrapper'
import { Spin } from 'antd'
import { NoVisualize, hasPermission } from '@utils'
import NewCalendar from './NewCalendar'

function Calendar() {
  const { screen, loading, setScreen, setCalendarId, calendarId, userPermissions, startSearch } = useCalendarContext()

  const handleClose = () => {
    setScreen('Grid')
    startSearch()
  }

  return hasPermission(userPermissions, 'Visualize') ? (
    <Spin spinning={loading} size="large">
      {screen === 'Grid' ? (
        <div className="container">
          <CalendarHeader />
          <CalendarTable />
        </div>
      ) : (
          <NewCalendar onClose={handleClose} {...{ calendarId, setCalendarId }} />
      )}
    </Spin>
  ) : (<NoVisualize userPermissions={userPermissions} />)
}

export const WrapperCalendar = withWrapper((element, props) => {
  return (
  <CalendarProvider>
    {element}
  </CalendarProvider>
  )
})(props => {
  return (
   <Calendar />
  )
})

export default WrapperCalendar
