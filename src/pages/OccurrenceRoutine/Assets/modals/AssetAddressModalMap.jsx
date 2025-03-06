import PropTypes from 'prop-types'
import React from 'react'
import { Map as LeafletMap, Marker, TileLayer } from 'react-leaflet'

export default function AssetAddressModalMap({ marker, setMarker }) {
  const mapData = {
    zoom: 6,
    lat: -15.79753,
    lng: -47.89489,
  }

  const markerPosition = [marker.lat, marker.lng]

  const { lat, zoom, lng } = mapData
  const position = [lat, lng]

  return (
    <LeafletMap center={position} zoom={zoom} style={{ height: '400px' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={markerPosition}
        draggable
        // eslint-disable-next-line no-underscore-dangle
        onDragend={e => setMarker(e.target._latlng)}
      />
    </LeafletMap>
  )
}

AssetAddressModalMap.propTypes = {
  marker: PropTypes.any,
  setMarker: PropTypes.any,
}
