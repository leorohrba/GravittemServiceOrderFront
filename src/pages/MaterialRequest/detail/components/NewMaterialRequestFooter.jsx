import Button from '@components/Button'
import { Modal, Row, Col } from 'antd'
import { PropTypes } from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'

const { confirm } = Modal

export function NewMaterialRequestFooter({ 
  handleSubmit, 
  canBeUpdated, 
  isSaving, 
  userUpdate, 
  dateUpdate, 
  formChanged, 
  requestNewId, 
  refreshRequest 
 }) {
  
  const handleRefreshRequest = () => {  
    if (!formChanged) {
      refreshRequest()
      return
    }
    
    confirm({
      title: formatMessage({
          id: 'materialRequest.NewMaterialRequisition.attention',
        }),
      content: formatMessage({
          id: 'materialRequest.NewMaterialRequisition.refreshWithoutSave',
        }),
      onOk: refreshRequest,
      okType: 'danger',
      cancelText: formatMessage({
        id: 'globalComponents.confirmModal.no',
      }),
      okText: formatMessage({
        id: 'globalComponents.confirmModal.yes',
      }),
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  }
  const confirmModal = () => {
    const show = () =>
      confirm({
        title: formatMessage({
          id: 'globalComponents.confirmModal.saveChanges',
        }),
        content: formatMessage({
          id: 'globalComponents.confirmModal.loseChangesWithoutSave',
        }),
        onOk: () => handleSubmit(null, false, false),
        onCancel: () => router.push('/MaterialRequest'),
        cancelText: formatMessage({
          id: 'globalComponents.confirmModal.no',
        }),
        okText: formatMessage({
          id: 'globalComponents.confirmModal.yes',
        }),
        okButtonProps: { size: 'large' },
        cancelButtonProps: { size: 'large' },
      })
      
    return (
      <Button
        size="default"
        type="secondary"
        onClick={() => {
                         if (canBeUpdated && formChanged) {
                            show()
                         }
                         else {
                            router.push('/MaterialRequest') 
                         }
                       }
        }
        id="button-cancel-requisition"
      >
        {formatMessage({
          id: 'materialRequest.NewMaterialRequisition.return',
        })}
      </Button>
    )
  }
  return (
    <div>
     {userUpdate && dateUpdate && (
       <Row>
         <Col style={{ color: 'gray' }}>
           <small>
             <i>
               {`Última atualização realizada por ${userUpdate} em ${dateUpdate.format('DD/MM/YYYY HH:mm')}`}
             </i>
           </small>
         </Col>
       </Row>       
     )}
     <Row className="mt-5" type="flex">
       <Col>
         {canBeUpdated && (
          <React.Fragment>  
            <Button
              size="default"
              className="mr-3"
              loading={isSaving}
              disabled={!formChanged}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
              onClick={(e) => handleSubmit(e, false, true)}
              id="button-save-requisition"
            >
              {formatMessage({
                id: 'materialRequest.NewMaterialRequisition.save',
              })}
            </Button>
            <Button
              size="default"
              className="mr-3"
              loading={isSaving}
              disabled={!formChanged}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
              onClick={(e) => handleSubmit(e, false, false)}
              id="button-save-requisition"
            >
              {formatMessage({
                id: 'materialRequest.NewMaterialRequisition.saveAndReturn',
              })}
            </Button>
          </React.Fragment>  
         )}
       </Col>
       {requestNewId && (
       <Col>
         <Button
           size="default"
           type="secondary"
           className="mr-3"
           onClick={() => handleRefreshRequest()}
           id="button-refresh-requisition"
         >
           {formatMessage({
             id: 'materialRequest.NewMaterialRequisition.refreshRequest',
           })}
         </Button>
       </Col> 
       )}
       <Col>       
        {confirmModal()}
       </Col>
     </Row>  
    </div>
  )
}

NewMaterialRequestFooter.propTypes = {
  handleSubmit: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  isSaving: PropTypes.bool,
  userUpdate: PropTypes.string,
  dateUpdate: PropTypes.object,
  formChanged: PropTypes.bool,
  refreshRequest: PropTypes.func,
  requestNewId: PropTypes.number,
}
