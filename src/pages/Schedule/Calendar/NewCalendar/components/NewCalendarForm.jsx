import { Col, Form, Input, Row, Switch } from 'antd'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewCalendarContext } from '../context/NewCalendarContext'
import NewSelect from '@components/NewFormComponents/NewSelect'
import NewEnum from '@components/NewFormComponents/NewEnum'

export default function NewCalendarForm() {
  
  const { canBeUpdated, form , timeZones, editData, enums } = useNewCalendarContext()
  const refInput = React.useRef()

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus()
    }
  },[canBeUpdated])

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={8}>
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
            <Input ref={refInput} autoFocus disabled={!canBeUpdated} />
          </Form.Item>
        </Col>
        <Col span={7}>
          <NewSelect
            form={form}
            options={timeZones}
            optionValue="id"
            optionLabel="descricao"
            defaultValue={editData?.fusoHorarioId}
            fieldName="fusoHorarioId"
            optionLabelProp="label"
            label="Fuso horário"
            required
            disabled={!canBeUpdated}
          />
        </Col>
        <Col span={3}>
          <Form.Item 
            valuePropName="checked"
            name="horarioVerao"
            label="Horário de verão"
            initialValue={editData ? editData.horarioVerao : false}
          >
            <Switch disabled={!canBeUpdated} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <NewEnum
            enums={enums}
            entity="Calendario"
            property="Status"
            defaultValue={editData?.status}
            getFirstEnumValue
            fieldName="status"
            label="Status"
            required
            disabled={!canBeUpdated}
          /> 
        </Col>
      </Row>
    </Form>
  )
}
