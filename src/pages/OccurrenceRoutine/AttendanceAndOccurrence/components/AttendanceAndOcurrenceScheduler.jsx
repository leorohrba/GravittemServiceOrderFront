/* eslint-disable class-methods-use-this */
import { Row } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { messages } from '../utils'
import AttendanceAndOcurrenceSchedulerToolbar from './AttendanceAndOcurrenceSchedulerToolbar'
import AttendancePopover from './AttendancePopover'

const DragAndDropCalendar = withDragAndDrop(Calendar)

class AttendanceAndOcurrenceScheduler extends React.Component {
  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events, editAttendance } = this.props

    const idx = events.indexOf(event)
    let { allDay } = event

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    editAttendance(event.id, moment(updatedEvent.start))
  }

  resizeEvent = ({ event, start, end }) => {
    const { editAttendance } = this.props

    if (
      moment(start).format('YYYY-MM-DD') === moment(end).format('YYYY-MM-DD')
    ) {
      const duration = moment.duration(moment(end).diff(moment(start)))
      editAttendance(event.id, moment(start), duration.asMinutes())
    }
  }

  eventPopup(event, isDay) {
    const { editAttendance, userPermissions } = this.props
    return (
      <AttendancePopover
        attendance={event}
        showPeriod
        showEditAttendance
        showPlaceMap
        editAttendance={id => editAttendance(id, null, null, true)}
        userPermissions={userPermissions}
      >
        <Row className="w-full h-full">{event.descricao}</Row>
      </AttendancePopover>
    )
  }

  editAttendancePage(id) {
    const { editAttendance } = this.props
    editAttendance(id, null, null, false, false, true)
  }

  getTooltip(event) {
    if (event.descricao.length > 50) {
      return `${event.descricao.substr(0, 50)}...`
    }
    return event.descricao
  }

  render() {
    const localizer = momentLocalizer(moment)
    const { events } = this.props
    const components = {
      toolbar: AttendanceAndOcurrenceSchedulerToolbar,
      event: ({ event }) => this.eventPopup(event, false),
      day: { event: ({ event }) => this.eventPopup(event, true) },
    }

    return (
      <DragAndDropCalendar
        components={components}
        localizer={localizer}
        tooltipAccessor={event => this.getTooltip(event)}
        messages={messages}
        popup
        events={events}
        onEventDrop={this.moveEvent}
        selectable
        resizable
        onEventResize={this.resizeEvent}
        // onDragStart={console.log}
        defaultDate={new Date()}
        views={{ month: true, week: true, day: true }}
        onDoubleClickEvent={(event, e) => this.editAttendancePage(event.id)}
      />
    )
  }
}

AttendanceAndOcurrenceScheduler.propTypes = {
  events: PropTypes.array,
  editAttendance: PropTypes.func,
  userPermissions: PropTypes.array,
}

export default AttendanceAndOcurrenceScheduler
