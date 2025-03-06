import React, { useState } from 'react'
import { Row, Button, Modal } from 'antd'
import { useNewServiceContext } from '../context/newServiceContext'
import PrintButton from './PrintButton'
import ServiceOrderParts from '@pages/ServiceOrder/ServiceOrderParts/$id$'

const Header = () => {
  const {
    loadingSave,
    isSaved,
    handleSave,
    generatedOSId,
    actStatusId,
    validateSchedule,
    isSchedule,
    activeKey,
  } = useNewServiceContext()
  const [visibleItemScreenModal, setVisibleItemScreenModal] = useState(false)
  return (
    <React.Fragment>
      <Row gutter={16} className="mb-3 gap-3">
        {!isSchedule && activeKey === '1' ? (
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '3px',
            }}
            onClick={() => handleSave()}
            loading={loadingSave}
          >
            {isSaved ? 'Salvar atualização' : 'Salvar'}
          </Button>
        ) : (
          <Button
            disabled={!isSaved}
            onClick={() => validateSchedule()}
            type="primary"
            icon={<i className="fa fa-calendar-check-o fa-lg mr-3" />}
          >
            Agendamento
          </Button>
        )}
        <Button
          disabled={!isSaved}
          onClick={() => setVisibleItemScreenModal(true)}
        >
          + Itens
        </Button>
        <PrintButton />
        <Modal
          title="Consultar Item"
          visible={visibleItemScreenModal}
          width="100%"
          onOk={() => setVisibleItemScreenModal(false)}
          onCancel={() => setVisibleItemScreenModal(false)}
        >
          <ServiceOrderParts
            screen={'CreateOS'}
            match={generatedOSId}
            actStatusId={actStatusId}
          />
        </Modal>
      </Row>
    </React.Fragment>
  )
}
export default Header
