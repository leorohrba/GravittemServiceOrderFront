/**
 * breadcrumb: Agenda
 * type: Menu
 */
import React, { useEffect } from 'react'
import { withWrapper } from 'with-wrapper'
import ScheduleHeader from './components/ScheduleHeader'
import ScheduleTable from './components/ScheduleTable'
import { ScheduleProvider, useScheduleContext } from './context/ScheduleContext'
import CRMNewTask from './modals/CRMNewTask'

function Schedule() {
  const {
    visibleTaskModal,
    setVisibleTaskModal,
    editTaskId,
    setEditTaskId,
    canAlterTask,
    setUpdateKey,
  } = useScheduleContext()

  useEffect(() => {
    if (!visibleTaskModal) {
      setEditTaskId(0)
    }
  }, [visibleTaskModal])

  return (
    <div className="container">
      <CRMNewTask
        {...{
          visibleTaskModal,
          setVisibleTaskModal,
          editTaskId,
          canAlterTask,
          setUpdateKey,
        }}
      />
      <ScheduleHeader />
      <ScheduleTable />
    </div>
  )
}

export const WrapperSchedule = withWrapper((element, props) => (
  <ScheduleProvider {...props}>{element}</ScheduleProvider>
))(props => {
  return <Schedule {...props} />
})

export default WrapperSchedule
