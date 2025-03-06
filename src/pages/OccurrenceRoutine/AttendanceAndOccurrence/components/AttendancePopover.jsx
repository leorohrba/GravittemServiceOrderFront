/* eslint-disable import/no-cycle */
import { Row, Col, Popover } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { hasPermission } from '@utils'
import AttendancePopoverContent from './AttendancePopoverContent'

const AttendancePopover = (props) => { 
  
  const {attendance,
         showPeriod,
         showEditAttendance,
         editAttendance,
         userPermissions,
         children,
         showPlaceMap,
       } = props

  const [popoverVisible, setPopoverVisible] = useState(false) 

  const openEditAttendance = () => {
      if (editAttendance !== undefined) {
         editAttendance(attendance.id)
      }
      setPopoverVisible(false)
  }
  
  return (
      <Popover 
        visible={popoverVisible}
        onVisibleChange={visible => setPopoverVisible(visible)}   
        content={
        <AttendancePopoverContent
          attendance={attendance}
          showPeriod={showPeriod}
          showPlaceMap={showPlaceMap}
          setPopoverVisible={setPopoverVisible}
          userPermissions={userPermissions}
          editAttendance={editAttendance}
        />}  
        title={<Row type="flex w-full">
                 <Col>{`Atendimento ${attendance.numero}`}</Col>
                 {showEditAttendance && (
                   <Col style={{ marginLeft: 'auto' }}>
                     <i 
                       onClick={() => openEditAttendance()}                                    
                       className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'}`}
                       style={{ color: 'gray', cursor: 'pointer'}}
                       role="button"
                     />
                 </Col>
                 )}
               </Row>    
              }
      >
        {children}
      </Popover>  
  )
}

AttendancePopover.propTypes = {
  attendance: PropTypes.any,
  showPeriod: PropTypes.bool,
  showEditAttendance: PropTypes.bool,
  userPermissions: PropTypes.array,
  editAttendance: PropTypes.func,
  children: PropTypes.any,
  showPlaceMap: PropTypes.bool,
}

export default AttendancePopover