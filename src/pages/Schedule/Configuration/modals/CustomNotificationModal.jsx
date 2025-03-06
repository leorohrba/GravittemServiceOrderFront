import { Button, Modal, Row } from 'antd'
import React, { useEffect } from 'react'
import { scheduleTimeOptions, timeTypes } from '../../enums'
import CustomNotificationModalForm from './CustomNotificationModalForm'

export default function CustomNotificationModal({
  visibleCustomNotification,
  setVisibleCustomNotification,
  form,
  fieldName,
  notification,
  setNotification,
  isAllDay,
}) {
  useEffect(() => {
    form.resetFields(['time', 'type'])
  }, [visibleCustomNotification])

  function handleSubmit() {
    setNotification({
      tempo: form.getFieldValue('time'),
      tipo: form.getFieldValue('type'),
    })
    const label = `${form.getFieldValue('time')} ${
      timeTypes.find(t => t.id === form.getFieldValue('type')).name
    } antes`

    form.setFieldsValue({
      [fieldName]: {
        label: `Personalizado - ${label}`,
        value: 0,
      },
    })

    handleClose()
  }

  function handleClose() {
    setVisibleCustomNotification(false)
  }

  function handleCancel() {
    form.setFieldsValue({
      [fieldName]: {
        label: scheduleTimeOptions.find(
          n =>
            n.time === notification.tempo && n.timeType === notification.tipo,
        )?.description,
        value: scheduleTimeOptions.find(
          n =>
            n.time === notification.tempo && n.timeType === notification.tipo,
        )?.description,
      },
    })
    setVisibleCustomNotification(false)
  }

  return (
    <Modal
      title="Personalizar notificação"
      visible={visibleCustomNotification}
      destroyOnClose
      onCancel={handleClose}
      footer={
        <Row type="flex">
          <Button className="formButton" onClick={e => handleSubmit(e)}>
            Salvar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </Row>
      }
    >
      <CustomNotificationModalForm {...{ form, timeTypes, isAllDay }} />
    </Modal>
  )
}
