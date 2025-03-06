import React  from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import AttendanceStatisticsBarChart from './AttendanceStatisticsBarChart'
import AttendanceStatisticsPieChart from './AttendanceStatisticsPieChart'

const colorEnabled = '#1976d2'
const colorDisabled = 'gray'
const chartHeight = 335

function AttendanceStatisticsContent(props) {
  
  const { data, chartType, setChartType, openAttendances } = props
  
  return (
   <div>
     <Row type="flex" className="mb-2">
        <Col>
          <h3>{data.chartDescription}</h3>
        </Col>  
        <Col style={{ marginLeft: 'auto' }}>
          <i
            role="button"
            className="ml-2 fa fa-bar-chart fa-lg cursor-pointer"
            style={{ color: chartType === 'VB' ? colorEnabled : colorDisabled}}
            onClick={() => setChartType('VB')}
          />  
        </Col>
        <Col>
          <i
            role="button"
            className="ml-2 fa fa-bar-chart fa-rotate-90 fa-lg cursor-pointer"
            style={{ color: chartType === 'HB' ? colorEnabled : colorDisabled}}
            onClick={() => setChartType('HB')}
          />  
        </Col>
        <Col>
          <i
            role="button"
            className="ml-2 fa fa-pie-chart fa-lg cursor-pointer"
            style={{ color: chartType === 'P' ? colorEnabled : colorDisabled}}
            onClick={() => setChartType('P')}
          />  
        </Col>
     </Row>
     {chartType === 'P' ? (
        <AttendanceStatisticsPieChart
          data={data}
          chartHeight={chartHeight}
          openAttendances={openAttendances}
        />
       ) : (  
        <AttendanceStatisticsBarChart
          data={data}
          chartHeight={chartHeight}
          isHorizontal={chartType === 'HB'}
          openAttendances={openAttendances}
        />
     )}  
   </div>
  )
  
}

AttendanceStatisticsContent.propTypes = {
  data: PropTypes.any,
  chartType: PropTypes.string,
  setChartType: PropTypes.func,
  openAttendances: PropTypes.func,
}

export default AttendanceStatisticsContent