import { Form } from '@ant-design/compatible'
import { getLocaleDateFormat } from '@utils'
import { Button, Col, DatePicker, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

export default function AdditionalWarrantyModalForm({
  form,
  saveWarranty,
  editData,
}) {
  const { getFieldDecorator } = form

  return (
    <Form layout="vertical">
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Data de compra">
            {getFieldDecorator('purchaseDate', {
              initialValue: editData ? editData.purchaseDate : '',
            })(
              <DatePicker
                format={getLocaleDateFormat()}
                style={{
                  width: '100%',
                }}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Término de garantia (original)">
            {getFieldDecorator('originalWarrantyDate', {
              initialValue: editData ? editData.originalWarrantyDate : '',
            })(
              <DatePicker
                format={getLocaleDateFormat()}
                style={{
                  width: '100%',
                }}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Tipo">
        {getFieldDecorator('type', {
          initialValue: editData ? editData.type : '',
        })(
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option key={1}>Extensão de garantia</Option>
            <Option key={2}>Garantia complementar</Option>
          </Select>,
        )}
      </Form.Item>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Término de garantia">
            {getFieldDecorator('endDate', {
              initialValue: editData ? editData.endDate : '',
            })(
              <DatePicker
                format={getLocaleDateFormat()}
                style={{
                  width: '100%',
                }}
              />,
            )}
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

AdditionalWarrantyModalForm.propTypes = {
  editData: PropTypes.object,
  form: PropTypes.any,
  saveWarranty: PropTypes.func,
}
