import { Button, Form, message, Modal, Row, Tabs } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-locale'
import { useScheduleContext } from '../context/ScheduleContext'
import NewTaskModalForm from './NewTaskModalForm'
import NewTaskModalParticipants from './NewTaskModalParticipants'
import NewTaskModalPlace from './NewTaskModalPlace'

const { TabPane } = Tabs

export default function NewTaskModal() {
  const {
    events,
    setEvents,
    visibleNewTaskModal,
    setVisibleNewTaskModal,
    taskType,
  } = useScheduleContext()
  const [form] = Form.useForm()
  const [tags, setTags] = useState([])

  const title =
    taskType === 'tarefa'
      ? 'Nova tarefa'
      : taskType === 'compromisso' && 'Novo compromisso'

  function handleSave() {
    form.validateFields().then(values => {
      const newEvent = {
        title: values.assunto,
        start: values.data.toDate(),
        end: values.data.toDate(),
        status: values.status,
        tipo: values.tipo,
        horario: values.horario,
        turno: values.turno,
        duracao: values.duracao,
        allDay: taskType === 'tarefa',
      }
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      setEvents([...events, newEvent])
      setVisibleNewTaskModal(false)
    })
  }

  return (
    <Modal
      title={title}
      visible={visibleNewTaskModal}
      onCancel={() => setVisibleNewTaskModal(false)}
      bodyStyle={{ paddingTop: 0 }}
      footer={
        <Row>
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            onClick={() => setVisibleNewTaskModal(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <Tabs type="card">
        <TabPane tab="Geral" key="1">
          <NewTaskModalForm {...{ form, taskType }} />
        </TabPane>
        <TabPane tab="Participantes" key="2">
          <NewTaskModalParticipants {...{ form, tags, setTags }} />
        </TabPane>
        <TabPane tab="Local" key="3">
          <NewTaskModalPlace {...{ form }} />
        </TabPane>
      </Tabs>
    </Modal>
  )
}
