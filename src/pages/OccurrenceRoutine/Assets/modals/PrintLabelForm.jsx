import { Form } from '@ant-design/compatible'
import { Checkbox, Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function PrintLabelForm({ form }) {
  const [showMaintainerFields, setShowMaintainerFields] = useState(false)

  const { getFieldDecorator } = form
  return (
    <Form layout="vertical">
      <p>Selecione abaixo quais os campos que serão impressos na etiqueta.</p>
      <div className="my-4">
        {getFieldDecorator('qrCode', {
          initialValue: false,
        })(<Checkbox className="mb-2">QR Code</Checkbox>)}
        <br />
        {getFieldDecorator('owner', {
          initialValue: false,
        })(<Checkbox className="mb-2">Proprietário</Checkbox>)}
        <br />
        {getFieldDecorator('modelAndSerial', {
          initialValue: false,
        })(<Checkbox className="mb-2">Modelo e n° de série</Checkbox>)}
        <br />
        {getFieldDecorator('patrimony', {
          initialValue: false,
        })(<Checkbox className="mb-2">Patrimônio</Checkbox>)}
        <br />
        {getFieldDecorator('maintainer', {
          initialValue: false,
        })(
          <Checkbox
            onChange={() => setShowMaintainerFields(!showMaintainerFields)}
          >
            Mantenedor
          </Checkbox>,
        )}
      </div>
      {showMaintainerFields && (
        <Row type="flex" gutter={16}>
          <Col span={14}>
            <Form.Item label="Nome">
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Contato">
              {getFieldDecorator('contact', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ],
              })(
                <InputMask
                  mask="(99) 9999-9999"
                  maskChar="_"
                  className="ant-input"
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item label="Tamanho">
        {getFieldDecorator('size', {
          initialValue: 1,
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'requiredFieldMessage',
              }),
            },
          ],
        })(
          <Select>
            <Option value={1}>Pequeno (99 x 25,4 mm)</Option>
            <Option value={2}>Grande (99 x 33,9 mm)</Option>
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
}

PrintLabelForm.propTypes = {
  form: PropTypes.any,
}
