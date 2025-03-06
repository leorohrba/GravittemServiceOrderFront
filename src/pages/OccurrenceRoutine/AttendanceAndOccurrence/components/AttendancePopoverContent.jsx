/* eslint-disable import/no-cycle */
import { Badge, Row, Col, Popover } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { minuteToHourMinute, hasPermission } from '@utils'
import moment from 'moment' 
import NewAttendancePlaceMapModal from '../modals/NewAttendancePlaceMapModal'
import PersonGroupPopover from '../../PersonGroup/components/PersonGroupPopover'

const AttendancePopoverContent = (props) => { 
   
  const {attendance,
         showPeriod,
         showNumber,
         showEditAttendance,
         userPermissions,
         showPlaceMap,
         setPopoverVisible,
         editAttendance,
       } = props
  
  const [placeMapModalVisible, setPlaceMapModalVisible] = useState(false)

  const getTooltipCustomer = (d) => {
    if (d.telefone || d.email) {
      return (
        <span> 
          {d.telefone && (
            <Row type="flex">
              <b>Telefone:</b><span className="ml-2">{d.telefone}</span>
            </Row>  
          )}
          {d.email && (
            <Row>
              <b>E-mail:</b><span className="ml-2">{d.email}</span>
            </Row>  
          )}      
        </span>
      )
    }
      return null
  }    
  
  const openPlaceModal = () => {
     setPlaceMapModalVisible(true)    
     setPopoverVisible(false)
  }
  
  const defaultPosition = attendance.latitude && attendance.longitude ? [attendance.latitude, attendance.longitude] : undefined
  
  const openEditAttendance = (id) => {
     editAttendance(id)
     setPlaceMapModalVisible(false)
  }
  
  return (  
   <React.Fragment>

      <NewAttendancePlaceMapModal
        placeMapModalVisible={placeMapModalVisible}
        setPlaceMapModalVisible={setPlaceMapModalVisible}
        defaultPlace={attendance.localAtendimento}
        defaultPosition={defaultPosition}
        readOnly
        userPermissions={userPermissions}
        showAttendancePopover
        attendance={attendance}
        editAttendance={(id) => openEditAttendance(id)}
      />  
   
     <div style={{maxWidth: '500px'}}>
       {(showNumber || showEditAttendance) && (
         <Row type="flex w-full" gutter={6}>
           <Col><b>Atendimento:</b></Col>
           <Col>{attendance.numero}</Col>
           {showEditAttendance && editAttendance !== undefined && (
             <Col>              
                <i 
                  onClick={() => editAttendance(attendance.id)}
                  style={{ color: 'gray', cursor: 'pointer' }} 
                  role="button"
                  className={`fa fa-${ userPermissions && hasPermission(userPermissions,'Alter') ? 'pencil' : 'search'}`}
                />
             </Col>
           )}            
       </Row>
       )}  
       {attendance.nomeSolicitante && (       
         <Row type="flex" gutter={6}>
           <Col><b>Solicitante:</b></Col>
           <Col>{attendance.nomeSolicitante}</Col>
         </Row>
       )}
       {attendance.nomeCliente && (
         <Row type="flex" gutter={6}>
           <Col><b>Cliente:</b></Col>
           <Col>{attendance.nomeCliente}</Col>
           {(attendance.telefone || attendance.email) && (
             <Col style={{marginLeft: 'auto'}}>
               <Popover content={getTooltipCustomer(attendance)}>
                 <i style={{ color: 'gray' }} className="fa fa-info-circle" />
               </Popover>  
             </Col>
           )}
         </Row>
       )}
       {attendance.descricaoClassificacaoAtendimento && (
         <Row type="flex" gutter={6}>
           <Col><b>Classificação:</b></Col>
           <Col>{attendance.descricaoClassificacaoAtendimento}</Col>
         </Row>
       )}       
       {attendance.descricaoCategoriaAtendimento && (
         <Row type="flex" gutter={6}>
           <Col><b>Categoria:</b></Col>
           <Col>{attendance.descricaoCategoriaAtendimento}</Col>
         </Row>
       )}       
       {attendance.nomeResponsavelAtendimento && (
         <Row type="flex" gutter={6} align="middle">
           <Col><b>Responsável:</b></Col>
           <Col>{attendance.nomeResponsavelAtendimento}</Col>
           {attendance.idGrupoColaborador && (
             <div className="ml-2">
               <PersonGroupPopover personGroupId={attendance.idGrupoColaborador} />
             </div>  
           )}
         </Row>
       )}       
       {attendance.localAtendimento && (
         <Row type="flex" gutter={6}>
           <Col><b>Local:</b></Col>
           <Col>{attendance.localAtendimento}</Col>
           {showPlaceMap && (
             <Col>
                <i 
                  role="button"
                  onClick={() => openPlaceModal()}
                  className="ml-2 fa fa-globe"
                  style={{ color: '#4CAF50', cursor: 'pointer' }}
                /> 
             </Col>
           )}
         </Row>
       )}       
       {attendance.dataAgendamento && (
         <Row type="flex" gutter={6}>
           <Col><b>Data de agendamento:</b></Col>
           {(attendance.duracao && attendance.horarioAgendamento && showPeriod) ? (
              <Col>{`${moment(attendance.dataAgendamento).format('DD/MM/YY HH:mm')} ~ ${moment(attendance.dataAgendamento).add(attendance.duracao, 'minutes').format('DD/MM/YY HH:mm')}`}</Col>
              ) : (
              <Col>{moment(attendance.dataAgendamento).format(attendance.horarioAgendamento ? 'DD/MM/YY HH:mm' : 'DD/MM/YY')}</Col>
           )}
         </Row>
       )}       
       {!!attendance.duracao && (
         <Row type="flex" gutter={6}>
           <Col><b>Duração:</b></Col>
           <Col>{minuteToHourMinute(attendance.duracao)}</Col>
         </Row>
       )}       
       {attendance.descricaoPrioridade && (
         <Row type="flex" gutter={6} align="middle">
           <Col><b>Prioridade:</b></Col>
           <Col>
              <div>
                <i
                  className="fa fa-exclamation-circle mr-2"
                  style={{
                    color: `${attendance.corPrioridade}`,
                  }}
                />
                <span>{attendance.descricaoPrioridade}</span>
              </div>
           </Col>
         </Row>
       )}
       <Row type="flex" gutter={6} align="middle">
         <Col><b>Status:</b></Col>
         <Col><Badge color={attendance.corStatus} /><span>{attendance.descricaoStatus}</span></Col>  
       </Row>
       {attendance.descricaoMotivo && (
         <Row type="flex" gutter={6}>
           <Col><b>Motivo:</b></Col>
           <Col>{attendance.descricaoMotivo}</Col> 
         </Row>
       )}
       {attendance.descricao && (
         <Row type="flex" gutter={6}>
           <Col><b>Descrição:</b></Col>
           <Col className="truncate" style={{ maxWidth: '400px'}}>
             {attendance.descricao}
           </Col> 
         </Row>
       )}
       {attendance.idOrdemServico && (
         <Row type="flex" gutter={6}>
           <Col><b>Ordem de serviço:</b></Col>
           <Col>{attendance.numeroOrdemServico}</Col>
         </Row>
       )}
       
     </div>
   </React.Fragment>  
  ) 
}

AttendancePopoverContent.propTypes = {
  attendance: PropTypes.any,
  showNumber: PropTypes.bool,
  showPeriod: PropTypes.bool,
  showEditAttendance: PropTypes.bool,
  userPermissions: PropTypes.array,
  showPlaceMap: PropTypes.bool,
  setPopoverVisible: PropTypes.func,
  editAttendance: PropTypes.func,
}

export default AttendancePopoverContent
