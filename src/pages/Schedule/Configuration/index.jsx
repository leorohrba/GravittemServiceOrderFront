/**
 * breadcrumb: Configuração de agenda
 *
 */
import { apiNotification } from '@services/api'
import {
  fieldsValidationToast,
  handleAuthError,
  sendDataToServer,
} from '@utils'
import { Form, message, Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import ScheduleConfigurationFooter from './components/ScheduleConfigurationFooter'
import ScheduleConfigurationForm from './components/ScheduleConfigurationForm'

export default function ScheduleConfiguration() {
  const [data, setData] = useState({})
  const [horaMarcada, setHoraMarcada] = useState()
  const [diaInteiro, setDiaInteiro] = useState()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  async function getData() {
    setLoading(true)
    try {
      const response = await apiNotification.get(`/api/Configuracao`)
      const { data } = response
      setData(data)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter as informações')
    }
    setLoading(false)
  }
  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSave() {
    form
      .validateFields()
      .then(values => {
        if (horaMarcada.tipo === 0 || diaInteiro.tipo === 0) {
          message.warning('Selecione um horário personalizado de notificação')
          return
        }

        const body = {
          id: data.id ?? null,
          tempoTarefaHoraMarcada: horaMarcada.tempo,
          padraoTarefaHora: horaMarcada.tipo,
          tempoTarefaDiaInteiro: diaInteiro.tempo,
          padraoTarefaDia: diaInteiro.tipo,
          notificarEmTela: values.notificarEmTela,
          notificarSuperior: values.notificarSuperior,
          horaTarefaDiaInteiro:
            values.horaTarefaDiaInteiro &&
            moment(values.horaTarefaDiaInteiro).format(),
        }
        saveData(body)
      })
      .catch(err => fieldsValidationToast(err))
  }

  async function saveData(body) {
    setLoading(true)
    try {
      const serverReturnSuccess = await sendDataToServer(
        apiNotification,
        data.id ? 'put' : 'post',
        '/api/Configuracao',
        'Não foi possível salvar as informações',
        body,
        true,
      )
      if (serverReturnSuccess) {
        getData()
      }
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível salvar as informações')
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <Spin spinning={loading}>
        <ScheduleConfigurationForm
          {...{
            form,
            data,
            horaMarcada,
            setHoraMarcada,
            diaInteiro,
            setDiaInteiro,
          }}
        />
        <ScheduleConfigurationFooter {...{ handleSave }} />
      </Spin>
    </div>
  )
}
