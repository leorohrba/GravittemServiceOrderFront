/* eslint-disable react/no-unescaped-entities */
import { scheduleTimeOptions, timeTypes } from '@pages/Schedule/enums'
import { isObjEmpty } from '@utils'
import {
  Col,
  Collapse,
  Divider,
  Form,
  Row,
  Select,
  Switch,
  TimePicker,
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import CustomNotificationModal from '../modals/CustomNotificationModal'

const { Panel } = Collapse
const { Option } = Select

export default function ScheduleConfigurationForm({
  form,
  data,
  horaMarcada,
  setHoraMarcada,
  diaInteiro,
  setDiaInteiro,
}) {
  const isEdit = !isObjEmpty(data)

  useEffect(() => {
    if (data && isEdit) {
      const horaMarcada = scheduleTimeOptions.find(
        s =>
          s.time === data.tempoTarefaHoraMarcada &&
          s.timeType === data.padraoTarefaHora,
      )?.description
      const tarefaDiaInteiro = scheduleTimeOptions.find(
        s =>
          s.time === data.tempoTarefaDiaInteiro &&
          s.timeType === data.padraoTarefaDia,
      )?.description

      if (
        !horaMarcada &&
        data.tempoTarefaHoraMarcada !== 0 &&
        data.padraoTarefaHora !== 0
      ) {
        form.setFieldsValue({
          horaMarcada: {
            label: `${scheduleTimeOptions[11].description} - ${
              data.tempoTarefaHoraMarcada
            } ${
              timeTypes.find(t => t.id === data.padraoTarefaHora).name
            } antes`,
            value: scheduleTimeOptions[11].description,
          },
        })
      } else {
        form.setFieldsValue({
          horaMarcada: { label: horaMarcada, value: horaMarcada },
        })
      }
      if (
        !tarefaDiaInteiro &&
        data.tempoTarefaDiaInteiro !== 0 &&
        data.padraoTarefaDia !== 0
      ) {
        form.setFieldsValue({
          tarefaDiaInteiro: {
            label: `${scheduleTimeOptions[11].description} - ${
              data.tempoTarefaDiaInteiro
            } ${timeTypes.find(t => t.id === data.padraoTarefaDia).name} antes`,
            value: scheduleTimeOptions[11].description,
          },
        })
      } else {
        form.setFieldsValue({
          tarefaDiaInteiro: {
            label: tarefaDiaInteiro,
            value: tarefaDiaInteiro,
          },
        })
      }
      form.setFieldsValue({
        notificarEmTela: data.notificarEmTela,
        notificarSuperior: data.notificarSuperior,
        horaTarefaDiaInteiro: moment(data.horaTarefaDiaInteiro) ?? null,
      })
      setHoraMarcada({
        tempo: data.tempoTarefaHoraMarcada,
        tipo: data.padraoTarefaHora,
      })
      setDiaInteiro({
        tempo: data.tempoTarefaDiaInteiro,
        tipo: data.padraoTarefaDia,
      })
    } else {
      form.resetFields()
      setHoraMarcada({
        tempo: scheduleTimeOptions[3].time,
        tipo: scheduleTimeOptions[3].timeType,
      })
      setDiaInteiro({
        tempo: scheduleTimeOptions[3].time,
        tipo: scheduleTimeOptions[3].timeType,
      })
    }
  }, [isEdit])

  const [visibleCustomNotification, setVisibleCustomNotification] = useState(
    false,
  )
  const [customizeNotification, setCustomizeNotification] = useState({
    fieldName: null,
    setNotification: null,
  })

  function handleCustomNotification(fieldName, setNotification, notification) {
    setCustomizeNotification({ fieldName, setNotification, notification })
    setVisibleCustomNotification(true)
  }

  return (
    <Form layout="vertical" form={form}>
      <CustomNotificationModal
        fieldName={customizeNotification.fieldName}
        setNotification={customizeNotification.setNotification}
        notification={customizeNotification.notification}
        isAllDay={customizeNotification.fieldName === 'tarefaDiaInteiro'}
        {...{
          visibleCustomNotification,
          setVisibleCustomNotification,
          form,
        }}
      />
      <Collapse>
        <Panel header={<b>Tarefa hora marcada</b>} key="1" forceRender>
          <Form.Item
            label="Notificação padrão"
            name="horaMarcada"
            className="w-full md:w-1/2"
            initialValue={scheduleTimeOptions[3].description}
          >
            <Select
              onSelect={(e, opt) => {
                opt.tipo === 0
                  ? handleCustomNotification(
                      'horaMarcada',
                      setHoraMarcada,
                      horaMarcada,
                    )
                  : setHoraMarcada({ tempo: opt.tempo, tipo: opt.tipo })
              }}
              labelInValue
            >
              {scheduleTimeOptions.map(s => (
                <Option value={s.description} tempo={s.time} tipo={s.timeType}>
                  {s.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Panel>
      </Collapse>
      <Collapse className="mt-5">
        <Panel header={<b>Tarefa dia inteiro</b>} key="2" forceRender>
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                label="Notificação padrão"
                name="tarefaDiaInteiro"
                initialValue={scheduleTimeOptions[3].description}
              >
                <Select
                  onSelect={(e, opt) => {
                    opt.tipo === 0
                      ? handleCustomNotification(
                          'tarefaDiaInteiro',
                          setDiaInteiro,
                          diaInteiro,
                        )
                      : setDiaInteiro({ tempo: opt.tempo, tipo: opt.tipo })
                  }}
                  labelInValue
                >
                  {scheduleTimeOptions
                    .filter(s => s.isAllDay)
                    .map(s => (
                      <Option
                        value={s.description}
                        tempo={s.time}
                        tipo={s.timeType}
                      >
                        {s.description}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Horário"
                name="horaTarefaDiaInteiro"
                rules={[
                  {
                    required: diaInteiro?.tipo !== 1,
                    message: formatMessage({ id: 'requiredFieldMessage' }),
                  },
                ]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
      </Collapse>
      <Collapse className="mt-5">
        <Panel header={<b>Notificação</b>} key="3" forceRender>
          <Form.Item
            noStyle
            name="notificarEmTela"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch size="small" className="mr-3 switch-green" />
          </Form.Item>
          <span>Apresentar pop-up de notificação em tela</span>
          <Divider className="my-4" />
          <Form.Item
            noStyle
            name="notificarSuperior"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch size="small" className="mr-3 switch-green" />
          </Form.Item>
          <span>Apresentar notificação para usuário "Superior"</span>
        </Panel>
      </Collapse>
    </Form>
  )
}
