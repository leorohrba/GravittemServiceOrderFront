import { Button, Divider, Popover } from 'antd'
import moment from 'moment'
import randomColor from 'randomcolor'
import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useScheduleContext } from '../context/ScheduleContext'
import DailyView from './DailyView'
import WeeklyView from './WeeklyView'

moment.locale('pt-BR')
const localizer = momentLocalizer(moment)

export default function ScheduleCalendar() {
  const {
    selectedDate,
    setSelectedDate,
    selectedPeriod,
    tableData,
    franchisee,
    completeTask,
    setSelectedPeriod,
  } = useScheduleContext()

  const mappedColors = React.useMemo(() => {
    const mapping = []
    // eslint-disable-next-line array-callback-return
    tableData.map(t => {
      const newColor = randomColor({
        luminosity: 'light',
      })
      if (!mapping.includes(t.responsavel) && !mapping.includes(newColor)) {
        mapping.push({
          responsavel: t.responsavel,
          cor: newColor,
        })
      }
    })
    return mapping
  }, [tableData])

  function Event({ event }) {
    const content = (
      <span>
        {event.hora && (
          <p className="mb-0">
            <b>Hora: </b>
            {moment(event.hora).format('HH:mm')}h
          </p>
        )}
        {event.duracao && (
          <p className="mb-0">
            <b>Duração: </b>
            {moment(event.duracao).diff(moment(event.hora), 'hours')}h
            {moment
              .utc(
                moment(event.duracao, 'HH:mm:ss').diff(
                  moment(event.hora, 'HH:mm:ss'),
                ),
              )
              .format('mm')}
          </p>
        )}
        {event.organizacao && (
          <p className="mb-0">
            <b>Organização: </b>
            {event.organizacao}
          </p>
        )}
        {event.responsavel && (
          <p className="mb-0">
            <b>Responsável: </b>
            {event.responsavel}
          </p>
        )}
        {franchisee && (
          <p className="mb-0">
            <b>Empresa: </b>
            {event.franquia}
          </p>
        )}
        {event.status === 1 && (
          <div className="text-center">
            <Divider className="my-2" />
            <Button
              ghost
              style={{
                color: '#4CAF50',
                border: '1px solid #4CAF50',
              }}
              className="mx-auto"
              onClick={() => completeTask(event.intId)}
            >
              <i className="fa fa-check mr-1" />
              Concluir
            </Button>
          </div>
        )}
      </span>
    )
    return (
      <Popover content={content} title={event.assunto}>
        <div className="w-full">
          {event.status === 2 && (
            <i className="fa fa-check mr-1" style={{ color: 'green' }} />
          )}
          {event.assunto}
        </div>
      </Popover>
    )
  }

  function customEvent(event) {
    const backgroundColor =
      mappedColors.find(c => c.responsavel === event.responsavel)?.cor ||
      randomColor()
    const style = {
      backgroundColor,
      opacity: 0.8,
      color: 'black',
      display: 'block',
    }
    return {
      style,
    }
  }

  return (
    <Calendar
      style={{ height: selectedPeriod === 'month' ? 600 : '100%' }}
      popup
      localizer={localizer}
      events={tableData}
      toolbar={false}
      views={{
        day: true,
        week: true,
        month: true,
        daily: DailyView,
        weekly: WeeklyView,
      }}
      view={selectedPeriod}
      messages={{
        today: 'Hoje',
        allDay: 'Tarefa',
        week: 'Semana',
        day: 'Dia',
        daily: 'Dia (Período)',
        month: 'Mês',
        previous: 'Anterior',
        next: 'Próximo',
        showMore: function showMore(total) {
          return `Mostrar +${total}`
        },
      }}
      date={selectedDate[0].toDate()}
      onNavigate={date => {
        setSelectedDate(moment(date))
      }}
      components={{
        event: Event,
      }}
      resourceAccessor="periodoDia"
      resourceIdAccessor="periodoDia"
      allDayAccessor="diaInteiro"
      startAccessor={event => moment(event.hora).toDate()}
      endAccessor={event => moment(event.duracao).toDate()}
      eventPropGetter={event => customEvent(event)}
      onDrillDown={date => {
        setSelectedPeriod('day')
        setSelectedDate([moment(date), moment(date)])
      }}
    />
  )
}
