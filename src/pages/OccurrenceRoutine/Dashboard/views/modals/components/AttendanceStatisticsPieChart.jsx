/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import { Chart, Geom, Axis, Tooltip, Label, Legend, Coord, Guide } from 'bizcharts'
import { formatNumber } from '@utils'
import PropTypes from 'prop-types'

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

function AttendanceStatisticsPieChart (props) {
  
  const { data, chartHeight, openAttendances } = props

  const [legend, setLegend] = useState([])
  
  useEffect(() => {
    const legendSource = []
    data.data.map((r) => {
      legendSource.push({
                          id: r.id,
                          value: r.description,
                          marker: {
                            symbol: "square",
                            fill: r.color,
                            radius: 5
                          }
                        })
        return true
    })
    setLegend(legendSource)
  }, [data.data])
  
  const getColor = (color) => {
    return color
  }      

  return (
    <Chart
      height={chartHeight}
      padding={{ top: chartTop, right: chartRight, bottom: chartBottom, left: chartLeft }}
      forceFit
      data={data.data}
      style={{ marginLeft: '-30%' }}
      scale={scale}
      onPlotDblClick={evt => {
            if (evt.data != null)
            {
               try {
                 openAttendances(data.index, evt.data._origin.id, evt.data._origin.type)
               }
               catch {}
            }
          }}
    >

     <Coord type="theta" radius={0.75} innerRadius={0.6} />

      <Axis name="percent" />
     
     <Legend
       position="right"
       custom={data.hasColor}
       items={legend}
       offsetY={-((chartHeight - chartTop - chartBottom) / 2) + 50}
       offsetX={-300}
       textStyle={{
           fill: '#404040', // color of label text
           fontSize: '14', // font size of label text
         }}
     />

      <Tooltip showTitle={false} />
    
      <Guide>
        <Html
          position={["50%", "50%"]}
          html={`<h1>${data.total}</h1>`}
          alignX="middle"
          alignY="middle"
        />
      </Guide>

      <Geom
        type="intervalStack"
        position="percent"
        color={data.hasColor ? ['color', getColor] : 'description'}
        tooltip={[
          "description*quantity",
          (description, quantity) => {
            return {
              name: description,
              value: formatNumber(quantity, 0),
            };
          }
        ]}
      >
        <Label
          textStyle={{
             fill: '#404040', // color of label text
             fontSize: '14', // font size of label text
             fontWeight: 'bold',
           }}
          content={[
            "description*quantity*percent",
            (description, quantity, percent) => {
              return `${formatNumber(quantity,0)} (${formatNumber(percent * 100, 1)}%)`;
            }
          ]}
        />
      </Geom>

    </Chart>
  )
  
}

AttendanceStatisticsPieChart.propTypes = {
  data: PropTypes.array,
  chartHeight: PropTypes.number,
  openAttendances: PropTypes.func,
}

export default AttendanceStatisticsPieChart