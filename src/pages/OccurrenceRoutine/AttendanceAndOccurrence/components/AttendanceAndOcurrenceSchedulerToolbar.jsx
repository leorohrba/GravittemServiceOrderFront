/* eslint-disable react/jsx-no-bind */
import { Button } from 'antd'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import React from 'react'
import { navigate } from '../utils'

class AttendanceAndOcurrenceSchedulerToolbar extends React.Component {
  render() {
    const {
      localizer: { messages },
      label,
    } = this.props
    return (
      <div className="rbc-toolbar-custom">
        <Button onClick={this.navigate.bind(null, navigate.TODAY)}>
          {messages.today}
        </Button>
        <i
          className="fa fa-chevron-left cursor-pointer fa-lg"
          aria-hidden="true"
          onClick={this.navigate.bind(null, navigate.PREVIOUS)}
          style={{ marginLeft: 'auto', color: 'gray' }}
        />
        <span
          className="rbc-toolbar-label mx-4 text-lg"
          style={{ flexGrow: 'initial' }}
        >
          {label}
        </span>
        <i
          className="fa fa-chevron-right cursor-pointer fa-lg"
          aria-hidden="true"
          onClick={this.navigate.bind(null, navigate.NEXT)}
          style={{ marginRight: 'auto', color: 'gray' }}
        />
        <Button.Group>{this.viewNamesGroup(messages)}</Button.Group>
      </div>
    )
  }

  navigate = action => {
    const { onNavigate } = this.props
    onNavigate(action)
  }

  view = view => {
    const { onView } = this.props
    onView(view)
  }

  viewNamesGroup(messages) {
    const { views, view } = this.props
    const viewNames = views

    if (viewNames.length > 1) {
      return viewNames.map(name => (
        <Button
          type="button"
          key={name}
          className={clsx({ 'rbc-active': view === name })}
          onClick={this.view.bind(null, name)}
        >
          {messages[name]}
        </Button>
      ))
    }
    return false
  }
}

AttendanceAndOcurrenceSchedulerToolbar.propTypes = {
  view: PropTypes.string.isRequired,
  views: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.node.isRequired,
  localizer: PropTypes.object,
  onNavigate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
}

export default AttendanceAndOcurrenceSchedulerToolbar
