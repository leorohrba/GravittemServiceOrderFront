import { getTimeDistance, getTimeRange } from '@utils/dashboard'
import { Card, Col, DatePicker, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { RangePicker } = DatePicker
const { Option } = Select

const dateFormatDisplay = 'DD/MM/YYYY'

function DashboardHeader(props) {
  const {
    viewOptions,
    viewOption,
    setViewOption,
    rangeDate,
    setRangeDate,
    fetchData,
  } = props

  const isActive = type => {
    const value = getTimeDistance(type)
    if (!rangeDate[0] || !rangeDate[1]) {
      return ''
    }
    if (
      rangeDate[0].isSame(value[0], 'day') &&
      rangeDate[1].isSame(value[1], 'day')
    ) {
      return 'primary-color'
    }
    return ''
  }

  const selectDate = type => {
    setRangeDate(getTimeDistance(type))
  }

  const goPreviousRange = () => {
    setRangeDate(getTimeRange(rangeDate, -1))
  }

  const goNextRange = () => {
    setRangeDate(getTimeRange(rangeDate, 1))
  }

  const handleFetchData = () => {
    if (fetchData !== undefined) {
      fetchData()
    }
  }

  return (
    <div className="mb-2">
      <Card size="small">
        <Row type="flex" align="middle" className="w-full">
          <Col className="ml-2 mr-4">
            <b>Visão:</b>
          </Col>
          <Col>
            <Select
              value={viewOption}
              style={{ width: '250px' }}
              onChange={value => setViewOption(value)}
            >
              {viewOptions.map((d, index) => (
                <Option key={index} value={d.value}>
                  {d.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col style={{ marginLeft: 'auto' }}>
            <Row type="flex" align="middle" className="w-full">
              <Col>
                <div className="flex">
                  <span
                    className={`mr-4 cursor-pointer ${isActive('week')}`}
                    onClick={() => selectDate('week')}
                    role="button"
                  >
                    Semanal
                  </span>
                  <span
                    className={`mr-4 cursor-pointer ${isActive('month')}`}
                    onClick={() => selectDate('month')}
                    role="button"
                  >
                    Mensal
                  </span>
                </div>
              </Col>
              <Col>
                <RangePicker
                  value={rangeDate}
                  onChange={value => setRangeDate(value)}
                  format={dateFormatDisplay}
                  style={{ width: 256 }}
                />
              </Col>
              <Col className="ml-3">
                <i
                  className="mr-2 fa fa-chevron-circle-left fa-2x primary-color cursor-pointer"
                  onClick={() => goPreviousRange()}
                  role="button"
                />
              </Col>
              <Col>
                <i
                  className="mr-2 fa fa-chevron-circle-right fa-2x primary-color cursor-pointer"
                  onClick={() => goNextRange()}
                  role="button"
                />
              </Col>
              <Col>
                <i
                  className="mr-2 fa fa-repeat fa-2x primary-color cursor-pointer"
                  onClick={() => handleFetchData()}
                  role="button"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

DashboardHeader.propTypes = {
  viewOptions: PropTypes.array,
  viewOption: PropTypes.string,
  setViewOption: PropTypes.func,
  rangeDate: PropTypes.array,
  setRangeDate: PropTypes.func,
  fetchData: PropTypes.func,
}

export default DashboardHeader
