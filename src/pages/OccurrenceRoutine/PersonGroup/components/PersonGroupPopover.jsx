import { apiAttendance } from '@services/api'
import { handleAuthError, showApiMessages } from '@utils'
import { Col, message, Popover, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

export default function PersonGroupPopover(props) {
  const { personGroupId, children } = props
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [collaborators, setCollaborators] = useState([])
  const [loading, setLoading] = useState(false)

  const handlePopoverVisible = visible => {
    if (visible) {
      getPersonGroup()
    } else {
      setCollaborators([])
    }
    setPopoverVisible(visible)
  }

  async function getPersonGroup() {
    setLoading(true)
    setCollaborators([])
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaGrupoColaborador`,
        data: { id: [personGroupId], trazerColaboradores: true },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk && data.grupoColaborador.length > 0) {
        const personGroup = data.grupoColaborador[0]
        setCollaborators(personGroup.colaboradores)
      } else if (data.isOk && data.grupoColaborador.length === 0) {
        message.error('Grupo de colaborador não encontrado!')
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const popoverContent = (
    <div
      style={{
        width: '150px',
        minHeight: '32px',
        maxHeight: '250px',
        overflowY: 'auto',
      }}
    >
      <Spin
        size="small"
        spinning={loading}
        style={{ position: 'absolute', top: '12px' }}
      >
        <div>
          {collaborators.map(record => (
            <Row style={{ width: '140px' }}>
              <Col
                className="truncate"
                style={{ width: '140px', color: 'gray' }}
              >
                {record.nomeColaborador}
              </Col>
            </Row>
          ))}
        </div>
      </Spin>
    </div>
  )

  return (
    <Popover
      visible={popoverVisible}
      content={popoverContent}
      onVisibleChange={visible => handlePopoverVisible(visible)}
    >
      {children || <i className="fa fa-search" style={{ color: 'gray' }} />}
    </Popover>
  )
}

PersonGroupPopover.propTypes = {
  personGroupId: PropTypes.string,
  children: PropTypes.any,
}
