import * as dates from 'date-arithmetic'
import React from 'react'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

export default function WeeklyView(props) {
  const { date } = props
  const range = WeeklyView.range(date, props)

  return (
    <>
      <TimeGrid
        {...props}
        range={range}
        max={new Date(2021, 0, 1, 5, 59, 59)}
        resources={[{ periodoDia: 'Madrugada', title: 'Madrugada' }]}
      />
      <TimeGrid
        {...props}
        range={range}
        min={new Date(2021, 0, 1, 6, 0, 0)}
        max={new Date(2021, 0, 1, 11, 59, 59)}
        resources={[{ periodoDia: 'Manhã', title: 'Manhã' }]}
      />
      <TimeGrid
        {...props}
        range={range}
        min={new Date(2021, 0, 1, 12, 0, 0)}
        max={new Date(2021, 0, 1, 17, 59, 59)}
        resources={[{ periodoDia: 'Tarde', title: 'Tarde' }]}
      />
      <TimeGrid
        {...props}
        range={range}
        min={new Date(2021, 0, 1, 18, 0, 0)}
        max={new Date(2021, 0, 1, 23, 59, 59)}
        resources={[{ periodoDia: 'Noite', title: 'Noite' }]}
      />
    </>
  )
}

WeeklyView.range = (date, { localizer }) => {
  const firstOfWeek = localizer.startOfWeek()
  const start = dates.startOf(date, 'week', firstOfWeek)
  const end = dates.endOf(date, 'week', firstOfWeek)

  let current = start
  const days = []

  while (dates.lte(current, end, 'day')) {
    days.push(current)
    current = dates.add(current, 1, 'day')
  }

  return days
}

WeeklyView.title = date => {
  return `Semanal (Período)`
}
