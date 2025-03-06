/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import { Card, Spin } from 'antd'
import { Chart, Geom, Axis, Tooltip, Label, Legend, Coord, Guide } from 'bizcharts'
import { formatNumber } from '@utils'
import PropTypes from 'prop-types'
import NoDataResult from '../../components/NoDataResult'

const { Html } = Guide

const chartTop = 10
const chartRight = 10
const chartBottom = 10
const chartLeft = 10
const scale = {
  percent: {
    min: 0,
    // max: scaleMax,
    formatter: val => `${formatNumber(val*100,2)}%`
  },
}

function AttendanceStatusCard (props) {
  
  const { data, openAttendances, chartHeight, loading } = props

  const [chartData, setChartData] = useState([])
  const [legend, setLegend] = useState([])
  const [totalQuantity, setTotalQuantity] = useState(0)
  
  useEffect(() => {
    const dataSource = []
    const legendSource = []
    const total = data.reduce((accumulator, { quantidade }) => accumulator + quantidade ,0) || 0
    data.map((r) => {

      dataSource.push({
                       statusId: r.idStatus,
                       statusDescription: r.descricaoStatus,
                       color: r.corStatus,
                       quantity: r.quantidade,
                       percent: total === 0 ? 0 : r.quantidade / total,
                     })

      legendSource.push({
                          id: r.idStatus,
                          value: `${r.descricaoStatus} (${r.quantidade})`,
                          marker: {
                            symbol: "square",
                            fill: r.corStatus,
                            radius: 5
                          }
                        })
        return true
    })
    setTotalQuantity(total)
    setLegend(legendSource)
    setChartData(dataSource)
  }, [data])
  
  const handleOpenAttendances = (statusId) => {
    if (openAttendances === undefined) {
      return 
    }
    const parameters = { idStatus: [statusId] }
    openAttendances(parameters)
  }
  
  const getColor = (color) => {
    return color
  }      

  return (
   <Spin spinning={loading} size="large">
      <Card 
        size="small"
        title={<h3>Total de atendimentos</h3>}
      >
       {(!loading && data.length === 0 )? (
         <NoDataResult />
       ) : (  
          <Chart
            height={chartHeight}
            padding={{ top: chartTop, right: chartRight, bottom: chartBottom, left: chartLeft }}
            forceFit
            data={chartData}
            style={{ marginLeft: '-35%' }}
            scale={scale}
            onPlotDblClick={evt => {
                  if (evt.data != null)
                  {
                     try {
                       handleOpenAttendances(evt.data._origin.statusId)
                     }
                     catch {}
                  }  
            }}
          >
           <Coord type="theta" radius={0.75} innerRadius={0.6} />

            <Axis name="percent" />
           
           <Legend
             position="right"
             custom
             items={legend}
             offsetY={-((chartHeight - chartBottom - chartTop) / 2) + 15}
             offsetX={-225}
             textStyle={{
                 fill: '#404040', // color of label text
                 fontSize: '14', // font size of label text
               }}
           />

            <Tooltip showTitle={false} />
          
            <Guide>
              <Html
                position={["50%", "50%"]}
                html={`<h1>${totalQuantity}</h1>`}
                alignX="middle"
                alignY="middle"
              />
            </Guide>

            <Geom
              type="intervalStack"
              position="percent"
              color={['color', getColor]}
              tooltip={[
                "statusDescription*quantity",
                (statusDescription, quantity) => {
                  return {
                    name: statusDescription,
                    value: formatNumber(quantity, 0),
                  };
                }
              ]}
            >
              <Label
                content={[
                  "statusDescription*percent",
                  (statusDescription, percent) => {
                    return `${formatNumber(percent * 100, 2)}%`;
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

AttendanceStatusCard.propTypes = {
  data: PropTypes.array,
  openAttendances: PropTypes.func,
  chartHeight: PropTypes.number,
  loading: PropTypes.bool,
}

export default AttendanceStatusCard