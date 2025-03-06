/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import { Card, Spin, Row, Col } from 'antd'
import { Chart, Geom, Axis, Tooltip, Label, Coord } from 'bizcharts'
import { formatNumber, minuteToHourMinute } from '@utils'
import PropTypes from 'prop-types'
import NoDataResult from '../../components/NoDataResult'

const chartTop = 10
const chartRight = 50
const chartBottom = 30
const chartLeft = 170
const maxLengthAxisLabel = 30 // número de caracteres para aparecer no label do eixo x

const scale = {
  duration: {
    min: 0,
    // max: scaleMax,
    formatter: val => minuteToHourMinute(val),
  },
}

function AttendanceResponsibleCard (props) {
  
  const { loading, data, openAttendances, chartHeight } = props
  const [averageDuration, setAverageDuration] = useState(null)
  const [chartData, setChartData] = useState([])
  
  useEffect(() => {
    const dataSource = []
    let total = 0    
    data.map((r) => {
      total += r.duracao
      dataSource.push( 
                  {
                    responsibleId: r.idResponsavelAtendimento,
                    personGroupId: r.idGrupoColaborador,
                    responsibleName: r.nomeResponsavelAtendimento,
                    quantity: r.quantidade,
                    duration: r.duracao,
                  } 
                 )
        return true
    })
    setAverageDuration( data.length > 0 ? Math.round(total / data.length) : null)
    setChartData(dataSource)
  }, [data])
  
  const handleOpenAttendances = (responsibleId, personGroupId) => {
    if (openAttendances === undefined) {
      return 
    }
    const parameters = { }
    if (!responsibleId && !personGroupId) {
      parameters.semResponsavelAtendimento =  true
    }
    else if (responsibleId)
    {
      parameters.idResponsavelAtendimento = [responsibleId]
    }
    else if (personGroupId)
    {
      parameters.idGrupoColaborador = [personGroupId]
    }
    openAttendances(parameters)
  }
  
  return (
    <Spin spinning={loading} size="large">
      <Card 
        size="small"
        title={<Row type="flex" className="w-full">
                  <Col>
                    <h3>Duração dos atendimentos</h3>
                  </Col>
                  {!!data.length && (
                    <Col style={{ marginLeft: 'auto'}}>
                      <h3>Média por responsável:<span className="ml-2">{minuteToHourMinute(averageDuration)}</span></h3>
                    </Col>
                  )}
               </Row>   
              }
      >

       {(!loading && data.length === 0 )? (
         <NoDataResult />
       ) : (  
      
        <Chart
          height={chartHeight}
          padding={{ top: chartTop, right: chartRight, bottom: chartBottom, left: chartLeft }}
          forceFit
          data={chartData}
          scale={scale}
          onPlotDblClick={evt => {
                if (evt.data != null)
                {
                   try {
                     handleOpenAttendances(evt.data._origin.responsibleId, evt.data._origin.personGroupId, evt.data._origin.statusId)
                   }
                   catch {}
                }  
          }}
        >
          <Coord transpose />
          
          <Axis
            name="responsibleName" 
            visible
            label={{autoRotate: true, 
                     formatter(text, item, index) {
                         return text && text.length > maxLengthAxisLabel ?
                                `${text.substr(0,maxLengthAxisLabel)}...`:
                                text
                      },
                   }}
          />

          <Tooltip showTitle={false} />
        
          <Geom
            type="interval"
            position="responsibleName*duration"
            tooltip={[
              "responsibleName*duration*quantity",
              (responsibleName, duration, quantity) => {
                return {
                  name: `${responsibleName} (${formatNumber(quantity,0)})`,
                  value: minuteToHourMinute(duration)
                };
              }
            ]}
          >
            <Label
              content={[
                "responsibleName*duration",
                (responsibleName, duration) => {
                  return minuteToHourMinute(duration)
                }
              ]}
            />
          </Geom>

        </Chart>
       )}  
      </Card>
    </Spin>  
  )
  
}

AttendanceResponsibleCard.propTypes = {
  data: PropTypes.array,
  openAttendances: PropTypes.func,
  chartHeight: PropTypes.number,
  loading: PropTypes.bool,
}

export default AttendanceResponsibleCard