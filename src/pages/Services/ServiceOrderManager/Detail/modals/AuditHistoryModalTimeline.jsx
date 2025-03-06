import { Timeline } from 'antd'
import moment from 'moment'
import React from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

export default function BlockHistoryModalTimeline() {
  const { auditHistory } = useNewServiceOrderContext()

  const timelineItems = auditHistory.map(historico => {
    const changes = historico.alteracoes.map((change, index) => {
      return (
        <React.Fragment>
          <b>{change.propriedade}</b>
          <span>{` `}</span>
          <span>{change.alteracao}</span>
          <br />
          {historico.alteracoes.length > 1 && (
            <React.Fragment>
              <br />
              <br />
            </React.Fragment>
          )}
        </React.Fragment>
      )
    })
    return (
      <Timeline.Item className="tracking-tight leading-snug">
        <span className="text-lg font-bold">
          {moment(historico.data).format('DD/MM/YY LT')}
        </span>
        <br />
        <p>{historico?.nomeUsuario}</p>
        {changes}
      </Timeline.Item>
    )
  })
  return (
    <React.Fragment>
      <Timeline reverse mode="left">
        {timelineItems}
      </Timeline>
    </React.Fragment>
  )
}
