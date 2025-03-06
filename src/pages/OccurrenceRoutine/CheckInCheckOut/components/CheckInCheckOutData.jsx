import { minuteToHourMinute } from '@utils'
import { Badge, Card, Timeline } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import moment from 'moment'

export default function CheckInCheckOutData({ data, editAttendance }) {
  return (
    <div className="mt-2">
      {data.length > 0 ? (
        <Timeline>
          {data.map(d => (
            <Timeline.Item key={d.key}>
              <p>
                <b>Check-In:</b> {d.dataInicial ? moment(d.dataInicial).format('DD MMM, HH:mm') : ''} -{' '}
                <b>Check-Out:</b> {d.dataFinal ? moment(d.dataFinal).format('DD MMM, HH:mm') : ''}
              </p>
              <Card>
                <h3 className="text-black">
                  #<span
                    role="button"
                    className="primary-color cursor-pointer"
                    onClick={() => editAttendance(d.id)}
                  >
                     {d.numero}
                   </span>   
                   <span className="ml-1 mr-1">-</span>
                   {d.nomeCliente || d.nomeSolicitante}
                </h3>
                <div className="flex">
                  <div style={{ width: '50%' }}>
                    <p className="mb-0">
                      <b>
                        {formatMessage({
                          id:
                            'occurrenceRoutine.checkInCheckOut.classification',
                        })}
                        :{' '}
                      </b>
                      {d.descricaoClassificacaoAtendimento}
                    </p>
                    <p className="mb-0">
                      <b>
                        {formatMessage({
                          id: 'occurrenceRoutine.checkInCheckOut.responsible',
                        })}
                        :{' '}
                      </b>
                      {d.nomeResponsavel}
                    </p>
                    <p className="mb-0">
                      <b>
                        {formatMessage({
                          id: 'occurrenceRoutine.checkInCheckOut.place',
                        })}
                        :{' '}
                      </b>
                      {d.localAtendimento}
                    </p>
                  </div>
                  <div style={{ width: '50%' }}>
                    <p className="mb-0">
                      <b>
                        {formatMessage({
                          id: 'occurrenceRoutine.checkInCheckOut.scheduleDate',
                        })}
                        :{' '}
                      </b>
                      {d.dataAgendamento
                        ? moment(d.dataAgendamento).format(
                            d.horarioAgendamento ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY',
                          )
                        : ''
                      }
                    </p>
                    <p className="mb-0">
                      <b>
                        {formatMessage({
                          id: 'occurrenceRoutine.checkInCheckOut.duration',
                        })}
                        :{' '}
                      </b>
                      {minuteToHourMinute(d.duracao)}
                    </p>
                    <p className="mb-0">
                      <b>
                        {formatMessage({
                          id: 'occurrenceRoutine.checkInCheckOut.priority',
                        })}
                        :{' '}
                      </b>
                      <Badge
                        text={d.descricaoPrioridade}
                        color={d.corPrioridade}
                        className="ml-1"
                      />
                    </p>
                  </div>
                </div>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <div className="text-center" style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
          <i
            className="fa fa-exclamation-circle fa-3x m-5"
            aria-hidden="true"
          />
          <h3>
            {formatMessage({
              id: 'occurrenceRoutine.checkInCheckOut.noDataMessage',
            })}
          </h3>
        </div>
      )}
    </div>
  )
}

CheckInCheckOutData.propTypes = {
  data: PropTypes.any,
  editAttendance: PropTypes.func,
}
