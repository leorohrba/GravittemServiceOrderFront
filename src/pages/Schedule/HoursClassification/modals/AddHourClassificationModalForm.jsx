import { Form, Input, TimePicker } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewEnum from '@components/NewFormComponents/NewEnum'
import moment from 'moment'

const { RangePicker } = TimePicker

export default function AddHourClassificationModalForm({ canBeUpdated, enums, form, editData }) {

  const getTime = (value) => {
    const m = moment().startOf('day')
    const t = value.split(':')
    if (t.length < 2) {
      return m
    }
    m.add(parseInt(t[0]), 'hours')
    m.add(parseInt(t[1]), 'minutes')
    return m
  }

  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        label="Descrição"
        name="descricao"
        initialValue={editData?.descricao}
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <Input disabled={!canBeUpdated} autoFocus />
      </Form.Item>

      <NewEnum
        enums={enums}
        entity="ConfiguracaoHoraDia"
        property="Dia"
        defaultValue={!editData ? [] : editData.dias.map(d => d.dia)}
        fieldName="dias"
        label="Dias"
        required
        mode="multiple"
        disabled={!canBeUpdated}
      /> 
	  
      <Form.Item
        label="Horários"
        name="horario"
        initialValue={!editData ? [] : [getTime(editData?.horaInicial || '00:00'), getTime(editData?.horaFinal || '00:00')]}
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <RangePicker format="HH:mm" disabled={!canBeUpdated} />
      </Form.Item>
    </Form>
  )
}
