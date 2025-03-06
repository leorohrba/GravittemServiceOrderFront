import { Button, Modal, Row } from 'antd'
import React from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import AuditHistoryModalTimeline from './AuditHistoryModalTimeline'

export default function AuditHistoryModal() {
  const {
    visibleAuditHistoryModal,
    setVisibleAuditHistoryModal,
  } = useNewServiceOrderContext()

  return (
    <Modal
      title="Histórico de auditoria"
      visible={visibleAuditHistoryModal}
      centered
      onCancel={() => setVisibleAuditHistoryModal(false)}
      footer={
        <Row>
          <Button onClick={() => setVisibleAuditHistoryModal(false)}>
            Voltar
          </Button>
        </Row>
      }
    >
      <AuditHistoryModalTimeline />
    </Modal>
  )
}
