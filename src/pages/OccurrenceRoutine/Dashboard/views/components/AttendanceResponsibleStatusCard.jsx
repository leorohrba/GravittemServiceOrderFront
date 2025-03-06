/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import { Card, Spin } from 'antd'
import { Chart, Geom, Axis, Tooltip, Label, Legend } from 'bizcharts'
import { formatNumber } from '@utils'
import PropTypes from 'prop-types'
import NoDataResult from '../../components/NoDataResult'

const chartTop = 40
const chartRight = 60
const chartBottom = 115
const chartLeft = 80
const scale = {
  quantity: {
    min: 0,
    // max: scaleMax,
    formatter: val => `${formatNumber(val,0)}`
  },
}

function AttendanceResponsibleStatusCard (props) {
  
  const { loading, data, openAttendances, chartHeight } = props

  const [chartData, setChartData] = useState([])
  const [legend, setLegend] = useState([])
  
  useEffect(() => {
    const dataSource = []
    const legendSource = []
    
    data.map((r) => {
      r.status.map((s) => {
          dataSource.push( 
                      {
                        responsibleId: r.idResponsavelAtendimento,
                        personGroupId: r.idGrupoColaborador,
                        responsibleName: r.nomeResponsavelAtendimento,
                        statusId: s.idStatus,
                        statusDescription: s.descricaoStatus,
                        color: s.corStatus,
                        quantity: s.quantidade,
                        responsibleQuantity: r.quantidade
                      } 
                     )
   
          if (!legendSource.find(x => x.id === s.idStatus)) {
            legendSource.push({
                                id: s.idStatus,
                                value: s.descricaoStatus,
                                marker: {
                                  symbol: "square",
                                  fill: s.corStatus,
                                  radius: 5
                                }
                              })
          }          
          return true
        })
        return true
    })

    setLegend(legendSource)
    setChartData(dataSource)
  }, [data])
  
  const handleOpenAttendances = (responsibleId, personGroupId, statusId) => {
    if (openAttendances === undefined) {
      return 
    }
    const parameters = { idStatus: [statusId] }
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
  
  const getColor = (color) => {
    return color
  }      
  
  return (
    <Spin spinning={loading} size="large">
      <Card 
        size="small"
        title={<h3>Responsáveis pelos atendimento</h3>}
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
            <Legend
              custom
              items={legend}
            />

            <Axis
              name="responsibleName" 
              visible
            />

            <Tooltip />
          
            <Geom
              type="intervalStack"
              position="responsibleName*quantity"
              color={['color', getColor]}
              tooltip={[
                "responsibleName*statusDescription*quantity*responsibleQuantity",
                (responsibleName, statusDescription, quantity, responsibleQuantity) => {
                  return {
                    name: statusDescription,
                    title: `${responsibleName} (${formatNumber(responsibleQuantity,0)})`,
                    value: formatNumber(quantity, 0)
                  };
                }
              ]}
            >
              <Label
                content={[
                  "responsibleName*quantity",
                  (responsibleName, quantity) => {
                    return `${formatNumber(quantity, 0)}`;
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

AttendanceResponsibleStatusCard.propTypes = {
  data: PropTypes.array,
  openAttendances: PropTypes.func,
  chartHeight: PropTypes.number,
  loading: PropTypes.bool,
}

export default AttendanceResponsibleStatusCard