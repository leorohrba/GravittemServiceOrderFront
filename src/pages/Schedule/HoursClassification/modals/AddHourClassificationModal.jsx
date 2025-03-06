/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, message, Modal, Row, Alert, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useHourClassificationContext } from '../context/HourClassificationContext'
import AddHourClassificationModalForm from './AddHourClassificationModalForm'
import { hasPermission, handleAuthError } from '@utils'
import { apiSchedule } from '@services/api'

export default function AddHourClassificationModal() {
  const [form] = Form.useForm()
  const {
    getData,
    enums,
    userPermissions,
    editData,
    visibleHourClassificationModal,
    setVisibleHourClassificationModal,
  } = useHourClassificationContext()

  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [loading, setLoading] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])
  const refAlert = React.useRef()

  function handleSave() {
    setAlertMessages([])
    form.validateFields().then(values => {
      save(values)
    })
    .catch(errorInfo => {
        form.scrollToField(errorInfo.errorFields[0].name[0])
        message.error('Preencha o(s) campo(s) demarcado(s) corretamente!')
    })
  }

  async function save(values) {
    setLoading(true)
    const body = {
      id: editData?.id,
      descricao: values.descricao,
      horaInicial: values.horario[0].format('HH:mm'),
      horaFinal: values.horario[1].format('HH:mm'),
      dias: []
    }
    values.dias.map((d) => {
      const id = editData && editData.dias.find(x => x.dia === d)?.id
      body.dias.push({ id, dia: d })
      return true
    })
    try {
      const response = await apiSchedule({
        method: 'POST',
        url: `/api/ConfiguracaoHora`,
        data: body,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        handleClose()
        getData()
      } else {
        setAlertMessages(data.notificacoes)
        message.error('Operação não realizada!')
      }
    } catch (error) {
      handleAuthError(error)
    }
  }  

  useEffect(() => {
    if (alertMessages.length > 0 && refAlert.current) {
      refAlert.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [alertMessages])

  useEffect(() => {
    setCanBeUpdated((editData && hasPermission(userPermissions, 'Alter')) || (!editData && hasPermission(userPermissions, 'Include')))
  }, [userPermissions, editData])

  useEffect(() => {
    if (visibleHourClassificationModal) {
	  setAlertMessages([])	
      form.resetFields()
    }
  }, [visibleHourClassificationModal])

  function handleClose() {
    setVisibleHourClassificationModal(false)
  }

  return (
    <Modal
      title={
        editData ? 'Editar classificação de horas' : 'Nova classificação de horas'
      }
      destroyOnClose
      centered
      width={500}
      visible={visibleHourClassificationModal}
      onCancel={handleClose}
      footer={
        <Row>
          <Button
            disabled={!canBeUpdated}
            loading={loading}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => handleSave()}
          >
            Salvar
          </Button>
          <Button type="secondary" className="ml-3" onClick={handleClose}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <Spin spinning={loading} size="large">

        <div ref={refAlert}>
            {alertMessages.map((message, index) => (
              <Alert
                type="error"
                message={message.mensagem}
                key={index}
                showIcon
                className="mb-2"
              />
            ))}
        </div>

        <AddHourClassificationModalForm {...{ canBeUpdated, enums, form, editData }} />
      </Spin>
    </Modal>
  )
}
