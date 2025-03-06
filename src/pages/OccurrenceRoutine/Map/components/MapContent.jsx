import PropTypes from 'prop-types'
import React from 'react'
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet'
import AttendancePopoverContent from '../../AttendanceAndOccurrence/components/AttendancePopoverContent'

const zoom = 15

export function MapContent({ data, position, editAttendance, userPermissions }) {

  const markers = data.map((attendance, index) => {
    
    const position = [attendance.latitude, attendance.longitude]
    
    return (
      <Marker key={index} position={position}>
        <Popup>
          <AttendancePopoverContent
            attendance={attendance}
            showNumber
            showEditAttendance
            editAttendance={editAttendance}
            userPermissions={userPermissions}
          />  
        </Popup>
      </Marker>
    )
  })

  return (
    <LeafletMap center={position} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {markers}
    </LeafletMap>
  )
}

MapContent.propTypes = {
  data: PropTypes.array,
  editAttendance: PropTypes.func,
  userPermissions: PropTypes.array,
  position: PropTypes.array
}
