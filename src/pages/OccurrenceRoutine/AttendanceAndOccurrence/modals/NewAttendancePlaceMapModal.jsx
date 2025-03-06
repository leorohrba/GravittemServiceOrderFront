/* eslint-disable import/no-cycle */
import { apiAttendance } from '@services/api'
import { handleAuthError, showApiMessages } from '@utils'
import { Button, Col, Input, message, Modal, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet'
import AttendancePopover from '../components/AttendancePopover'
import AttendancePopoverContent from '../components/AttendancePopoverContent'

const initialPosition = [-26.27522, -48.82132]
function NewAttendancePlaceMapModal(props) {
  const {
    placeMapModalVisible,
    setPlaceMapModalVisible,
    onChangePlace,
    defaultPlace,
    // paramêtros abaixo são exclusivos quando chamado pelo AttendancePopover
    defaultPosition,
    showAttendancePopover,
    attendance,
    userPermissions,
    editAttendance,
    readOnly,
  } = props

  const [markerPosition, setMarkerPosition] = useState(initialPosition)
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(false)
  const ref = React.useRef()

  useEffect(() => {
    if (placeMapModalVisible) {
      setPlace(defaultPlace)
      if (defaultPosition) {
        setMarkerPosition(defaultPosition)
      } else {
        getCoordinates(defaultPlace)
      }
      if (ref.current) {
        ref.current.focus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeMapModalVisible])

  async function getCoordinates(place) {
    if (!place) {
      setMarkerPosition(initialPosition)
      return
    }
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Coordenadas`,
        params: { searchText: place },
      })
      const { data } = response

      setLoading(false)

      if (ref.current) {
        ref.current.focus()
      }

      if (data.isOk && data.coordenadas.length > 0) {
        setMarkerPosition([
          data.coordenadas[0].latitude,
          data.coordenadas[0].longitude,
        ])
      } else if (data.isOk) {
        message.error('Local não encontrado!')
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const handlePressEnter = e => {
    if (!readOnly) {
      getCoordinates(e.target.value)
    }
  }

  const openEditAttendance = () => {
    if (editAttendance !== undefined && attendance) {
      editAttendance(attendance.id)
    }
  }

  return (
    <Modal
      title="Consulta local de atendimento"
      visible={placeMapModalVisible}
      centered
      width={900}
      destroyOnClose
      onCancel={() => setPlaceMapModalVisible(false)}
      footer={
        <Row type="flex">
          {onChangePlace !== undefined && place && (
            <Button
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
              onClick={() => onChangePlace(place)}
            >
              <i className="mr-2 fa fa-check" />
              Confirmar
            </Button>
          )}
          <Button
            onClick={() => setPlaceMapModalVisible(false)}
            type="secondary"
            style={{
              marginLeft: 'auto',
            }}
          >
            Fechar
          </Button>
        </Row>
      }
    >
      <Row
        type="flex"
        align="middle"
        style={{
          position: 'absolute',
          left: '90px',
          top: '100px',
          zIndex: 999,
        }}
      >
        <Col className="mr-2">
          <h3 style={{ marginTop: '5px' }}>Local:</h3>
        </Col>
        <Col style={{ width: '650px' }}>
          <Input
            value={place}
            allowClear={!readOnly}
            autoFocus
            ref={ref}
            readOnly={readOnly}
            placeholder="Digite o local de atendimento"
            onChange={e => setPlace(e.target.value)}
            onPressEnter={e => handlePressEnter(e)}
          />
        </Col>
        {!readOnly && (
          <Col>
            <Button
              className="ml-2"
              type="primary"
              onClick={() => getCoordinates(place)}
            >
              <i className="fa fa-search" aria-hidden="true" />
            </Button>
          </Col>
        )}
        {showAttendancePopover && attendance && (
          <Col>
            <AttendancePopover
              attendance={attendance}
              showEditAttendance={editAttendance !== undefined && attendance}
              userPermissions={userPermissions}
              editAttendance={() => openEditAttendance()}
            >
              <i
                className="ml-2 fa fa-info-circle fa-2x cursor-pointer"
                style={{ color: '#1976D2' }}
                role="button"
                aria-hidden="true"
              />
            </AttendancePopover>
          </Col>
        )}
      </Row>
      <Spin spinning={loading} size="large">
        <LeafletMap
          center={markerPosition}
          zoom={15}
          style={{ height: '400px' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition}>
            {showAttendancePopover && attendance && (
              <Popup>
                <AttendancePopoverContent attendance={attendance} showNumber />
              </Popup>
            )}
          </Marker>
        </LeafletMap>
      </Spin>
    </Modal>
  )
}

NewAttendancePlaceMapModal.propTypes = {
  placeMapModalVisible: PropTypes.bool,
  setPlaceMapModalVisible: PropTypes.func,
  onChangePlace: PropTypes.func,
  defaultPlace: PropTypes.string,
  defaultPosition: PropTypes.array,
  showAttendancePopover: PropTypes.bool,
  attendance: PropTypes.any,
  userPermissions: PropTypes.array,
  editAttendance: PropTypes.func,
  readOnly: PropTypes.bool,
}

export default NewAttendancePlaceMapModal
