import { getLocaleDateFormat } from '@utils'
import { Button, Col, DatePicker, Form, Row, Select } from 'antd'
import React, { useEffect } from 'react'

const { Option } = Select

export default function AdditionalWarrantyModalForm({
  form,
  saveWarranty,
  editData,
}) {
  useEffect(() => {
    form.setFieldsValue(editData)
  }, [editData])

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Data de compra"
            name="dataCompra"
            initialValue={editData ? editData.dataCompra : ''}
          >
            <DatePicker
              format={getLocaleDateFormat()}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Término de garantia (original)"
            name="terminoGarantiaOriginal"
            initialValue={editData ? editData.terminoGarantiaOriginal : ''}
          >
            <DatePicker
              format={getLocaleDateFormat()}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Tipo"
        name="tipo"
        initialValue={editData ? editData.tipo : ''}
      >
        <Select
          labelInValue
          style={{
            width: '100%',
          }}
        >
          <Option key={1}>Extensão de garantia</Option>
          <Option key={2}>Garantia complementar</Option>
        </Select>
      </Form.Item>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Término de garantia"
            name="terminoGarantia"
            initialValue={editData ? editData.terminoGarantia : ''}
          >
            <DatePicker
              format={getLocaleDateFormat()}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Button
            type="primary"
            style={{
              marginTop: '29px',
            }}
            onClick={saveWarranty}
          >
            {editData ? 'Atualizar' : 'Adicionar garantia'}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
