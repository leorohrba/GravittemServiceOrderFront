import { Checkbox, Col, DatePicker, Form, Input, Row } from 'antd'
import moment from 'moment'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewCalendarContext } from '../context/NewCalendarContext'
import NewEnum from '@components/NewFormComponents/NewEnum'

export default function AddSpecialDateModalForm({ form, editSpecialDate }) {
  
  const { enums, canBeUpdated } = useNewCalendarContext()

  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        label="Descrição"
        name="descricao"
        classname="mb-1"
        initialValue={editSpecialDate?.descricao}
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <Input autoFocus disabled={!canBeUpdated} />
      </Form.Item>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Data"
            name="data"
            initialValue={editSpecialDate ? moment(editSpecialDate.data) : null}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
            ]}
          >
            <DatePicker disabled={!canBeUpdated} format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <NewEnum
            enums={enums}
            entity="DataEspecial"
            property="Tipo"
            defaultValue={editSpecialDate?.tipo}
            fieldName="tipo"
            label="Tipo"
            required
            disabled={!canBeUpdated}
          /> 
        </Col>
        <Form.Item
          name="recorrente"
          valuePropName="checked"
          initialValue={!editSpecialDate ? false : editSpecialDate.recorrente}
          style={{ marginBottom: 0, marginLeft: '8px' }}
        >
          <Checkbox disabled={!canBeUpdated}>Permanente/recorrente</Checkbox>
        </Form.Item>
      </Row>
    </Form>
  )
}
