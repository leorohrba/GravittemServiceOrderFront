import { Collapse, Spin, Alert } from 'antd'
import React, { useEffect } from 'react'
import NewCalendarDatesTable from './components/NewCalendarDatesTable'
import NewCalendarFooter from './components/NewCalendarFooter'
import NewCalendarForm from './components/NewCalendarForm'
import NewCalendarHoursTable from './components/NewCalendarHoursTable'
import { NewCalendarProvider, useNewCalendarContext } from './context/NewCalendarContext'
import { withWrapper } from 'with-wrapper'

const { Panel } = Collapse

function NewCalendar() {
  const { calendarId, onClose, alertMessages, loading, refContent } = useNewCalendarContext()
  const refAlert = React.useRef()

  useEffect(() => {
    if (alertMessages.length > 0 && refAlert.current) {
      refAlert.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [alertMessages])

  return (
  <Spin size="large" spinning={loading}>  
    <div ref={refContent} className="container">
      <div className="mb-4">
        <span
          style={{
            color: '#1976D2',
            cursor: 'pointer',
          }}
          onClick={() => onClose && onClose()}
          role="button"
        >
           Calendários
        </span>
        <i className="mx-3 fa fa-angle-right" />
        <span>{`${calendarId ? 'Editar' : 'Novo'} calendário`}</span>  
      </div>

      <div ref={refAlert}>
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message.mensagem}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}
      </div>

      <NewCalendarForm />
      <Collapse
        className="mb-3"
        bordered={false}
        defaultActiveKey={['1', '2']}
        expandIcon={({ isActive }) =>
          isActive ? (
            <React.Fragment>
              <i
                className="fa fa-minus-square-o"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '12px',
                  fontSize: '24px',
                }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <i
                className="fa fa-plus-square-o"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '12px',
                  fontSize: '24px',
                }}
              />
            </React.Fragment>
          )
        }
      >
        <Panel header={<h3 className="ml-3">Horas trabalhadas</h3>} key="1">
          <NewCalendarHoursTable />
        </Panel>
        <Panel header={<h3 className="ml-3">Datas especiais</h3>} key="2">
          <NewCalendarDatesTable />
        </Panel>
      </Collapse>
      <NewCalendarFooter />
    </div>
  </Spin>  
  )
}

export const WrapperNewCalendar = withWrapper((element, props) => {
  return (
  <NewCalendarProvider {...props}>
    {element}
  </NewCalendarProvider>
  )
})(props => {
  return (
   <NewCalendar />
  )
})

export default WrapperNewCalendar
