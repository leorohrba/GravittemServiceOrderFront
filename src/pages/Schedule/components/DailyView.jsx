import * as dates from 'date-arithmetic'
import React from 'react'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

export default function DailyView(props) {
  const { date } = props
  const range = DailyView.range(date)

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

DailyView.range = date => {
  return [dates.startOf(date, 'day')]
}

DailyView.title = date => {
  return `Diário (Período)`
}
