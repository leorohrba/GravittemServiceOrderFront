import { Button, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import moment from 'moment'

export default function EditAttendanceFooter({
  handleSave,
  hideLinkedAttendanceButton,
  hideServiceOrderButton,
  isSaving,
  formChanged,
  canBeUpdated,
  confirmCreateLinkedAttendance,
  editData,
  openServiceOrder,
  returnAttendances,
}) {

  return (
    <React.Fragment>
      {editData && !hideLinkedAttendanceButton && (
        <React.Fragment>
          <Row type="flex" justify="end">
            <h5 style={{ color: 'gray' }}>{`Atendimento criado em ${moment(editData.dataInclusao).format('DD/MM/YYYY HH:mm')} por ${editData.nomeUsuarioInclusao}`}</h5>
          </Row>    
          {editData.dataAlteracao && (
            <Row type="flex" justify="end">
              <h5 style={{ color: 'gray' }}>{`Última alteração feita em ${moment(editData.dataAlteracao).format('DD/MM/YYYY HH:mm')} por ${editData.nomeUsuarioAlteracao}`}</h5>
            </Row>
          )}      
        </React.Fragment>        
      )}  
      <Row type="flex">
        {canBeUpdated && (
          <React.Fragment>
            <Button
              className="mr-2"
              loading={isSaving}
              disabled={!formChanged}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
              onClick={(e) => handleSave(false, false)}
            >
              {formatMessage({ id: 'saveButton' })}
            </Button>
            {!hideLinkedAttendanceButton && (
              <Button
                className="mr-2"
                ghost
                onClick={() =>
                  confirmCreateLinkedAttendance()
                }
                style={{
                  color: '#4CAF50',
                  border: '1px solid #4CAF50',
                }}
              >
                {formatMessage({
                  id:
                    'occurrenceRoutine.attendanceAndOccurrence.createLinkedAttendance',
                })}
              </Button>
            )}
            {!hideServiceOrderButton && (
              <Button
                className="mr-2"
                ghost
                style={{
                  color: '#4CAF50',
                  border: '1px solid #4CAF50',
                }}
                onClick={() => openServiceOrder()}
              >
                {formatMessage({
                  id: 'occurrenceRoutine.attendanceAndOccurrence.createServiceOrder',
                })}
              </Button>
            )}
          </React.Fragment>
        )} 
        <Button
          type="secondary"
          onClick={() =>
            returnAttendances()
          }
        >
          {formatMessage({ id: 'cancelButton' })}
        </Button>
      </Row>
    </React.Fragment>
  )
}

EditAttendanceFooter.propTypes = {
  handleSave: PropTypes.func,
  hideLinkedAttendanceButton: PropTypes.bool,
  hideServiceOrderButton: PropTypes.bool,
  isSaving: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
  confirmCreateLinkedAttendance: PropTypes.func,
  editData: PropTypes.any,
  formChanged: PropTypes.bool,
  openServiceOrder: PropTypes.func,
  returnAttendances: PropTypes.func,
}
