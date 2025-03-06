import { Timeline } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

export default function HistoryModalTimeline({ history }) {
  
  const display = (value) => {
	if (!value) {
	  return value
	}
    const lines = value.split('\n')
	return (
	   <React.Fragment>
	     {lines.map((d, index) => (
		    <React.Fragment>
			  {index > 0 && (<br />)}
			  {d}
			</React.Fragment>
		 ))}
	   </React.Fragment>
	)
  }
  
  const timelineItems = history.map(historico => {
    const changes = historico.alteracoes.map((change, index) => {
      const marker = change.tipoAlteracao === 2 ? ' > ' : ''
      return (
        <React.Fragment>
          <span className="text-base font-semibold">{change.propriedade} </span>
          <span className="text-thin">
            {change.tipoAlteracao === 1
              ? ' criado'
              : change.tipoAlteracao === 2
                ? ' alterado'
                : 'deletado'
            }
          </span>
          <br />
          <span className="line-through">
		    {display(change.valorAnterior)}
	      </span>
          <span> {marker} </span>
          <span style={{ color: '#008AE6' }}>
		    {display(change.novoValor)}
		  </span>
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
        <span className="test-thin">{historico?.nomeUsuario}</span>
        <br />
		{!!historico?.valor && historico?.tipoAlteracao === 2 && (
		  <React.Fragment>
		    <span className="test-thin" style={{color: 'gray'}}>
			  <b className="mr-2">
			    {display(`${historico?.nomeEntidade}:`)}
		      </b>		
			  {display(historico?.valor)}
			</span>
			<br />
		  </React.Fragment>
		)}
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
HistoryModalTimeline.propTypes = {
  history: PropTypes.array,
}
