/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Chart, Geom, Axis, Tooltip, Label, Coord } from 'bizcharts'
import { formatNumber } from '@utils'
import PropTypes from 'prop-types'

const chartTopH = 10
const chartRightH = 50
const chartBottomH = 50
const chartLeftH = 170

const chartTop = 40
const chartRight = 60
const chartBottom = 70
const chartLeft = 80

const maxLengthAxisLabel = 30 // número de caracteres para aparecer no label do eixo x

const scale = {
  quantity: {
    min: 0,
    // max: scaleMax,
    formatter: val => formatNumber(val,0),
  },
}

function AttendanceStatisticsBarChart (props) {
  
  const { data, isHorizontal, chartHeight, openAttendances } = props

  const getColor = (color) => {
    return color
  }      
  
  return (
      <Chart
        height={chartHeight}
        padding={{ top: isHorizontal ? chartTopH : chartTop, 
                   right: isHorizontal ? chartRightH : chartRight, 
                   bottom: isHorizontal ? chartBottomH : chartBottom, 
                   left: isHorizontal ? chartLeftH : chartLeft 
                 }}
        forceFit
        data={data.data}
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
        {isHorizontal && (<Coord transpose />)}
        
        <Axis
          name="description" 
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
          color={['color', getColor]}
          position="description*quantity"
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
            content={[
              "description*quantity",
              (description, quantity) => {
                return formatNumber(quantity,0)
              }
            ]}
          />
        </Geom>

      </Chart>
  )
  
}

AttendanceStatisticsBarChart.propTypes = {
  data: PropTypes.array,
  isHorizontal: PropTypes.bool,
  openAttendances: PropTypes.func,
  chartHeight: PropTypes.number,
}

export default AttendanceStatisticsBarChart