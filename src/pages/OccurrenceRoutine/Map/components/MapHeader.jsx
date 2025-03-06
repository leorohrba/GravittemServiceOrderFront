import NewSimpleSearch from '@components/NewSimpleSearch'
import { Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import MapTablePopover from './MapTablePopover'

export function MapHeader(props) {
  const {
    setTags,
    tags,
    searchOptions,
    startSearch,
    userPermissions,
    data,
    onSelectAttendance,
    editAttendance,
    dataExport,
    setAttendanceStatisticsModalVisible,
  } = props

  return (
    <Row
      type="flex"
      style={{
        position: 'absolute',
        right: '30px',
        top: '30px',
        zIndex: 999,
      }}
    >
      <Col>
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          selectOptionsWidth={180}
          startSearch={startSearch}
          screenName="mapa_atendimentos"
          hideSaveSearch
          getSelectLabel
        />
      </Col>
      <Col className="ml-4 mt-1">
        <MapTablePopover
          data={data}
          editAttendance={editAttendance}
          userPermissions={userPermissions}
          onSelectAttendance={onSelectAttendance}
          dataExport={dataExport}
          setAttendanceStatisticsModalVisible={
            setAttendanceStatisticsModalVisible
          }
        >
          <i
            className="fa fa-list fa-2x cursor-pointer"
            style={{ color: '#1976D2' }}
            role="button"
            aria-hidden="true"
          />
        </MapTablePopover>
      </Col>
    </Row>
  )
}

MapHeader.propTypes = {
  setTags: PropTypes.func,
  tags: PropTypes.array,
  startSearch: PropTypes.func,
  searchOptions: PropTypes.array,
  editAttendance: PropTypes.func,
  dataExport: PropTypes.array,
  data: PropTypes.array,
  onSelectAttendance: PropTypes.array,
  userPermissions: PropTypes.array,
  setAttendanceStatisticsModalVisible: PropTypes.func,
}
