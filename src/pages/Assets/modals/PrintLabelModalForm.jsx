import { Checkbox, Col, Form, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function PrintLabelForm({ form }) {
  const [showMaintainerFields, setShowMaintainerFields] = useState(false)
  const checkboxStyle = {
    display: 'block',
    marginLeft: 0,
  }
  return (
    <Form layout="vertical" form={form}>
      <p>Selecione abaixo quais os campos que serão impressos na etiqueta.</p>
      <Form.Item noStyle>
        <Checkbox.Group>
          <Checkbox value="qrCode" className="mb-3" style={checkboxStyle}>
            QR Code
          </Checkbox>
          <Checkbox value="proprietario" className="mb-3" style={checkboxStyle}>
            Proprietário
          </Checkbox>
          <Checkbox value="modeloNSerie" className="mb-3" style={checkboxStyle}>
            Modelo e n° de série
          </Checkbox>
          <Checkbox value="patrimonio" className="mb-3" style={checkboxStyle}>
            Patrimônio
          </Checkbox>
          <Checkbox
            value="mantenedor"
            className="mb-3"
            style={checkboxStyle}
            onChange={() => setShowMaintainerFields(!showMaintainerFields)}
          >
            Mantenedor
          </Checkbox>
        </Checkbox.Group>
      </Form.Item>
      {showMaintainerFields && (
        <Row type="flex" gutter={16}>
          <Col span={14}>
            <Form.Item
              label="Nome"
              name="nome"
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Contato"
              name="contato"
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ]}
            >
              <InputMask
                mask="(99) 9999-9999"
                maskChar="_"
                className="ant-input"
              />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Form.Item
        label="Tamanho"
        name="tamanho"
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <Select>
          <Option value={1}>Pequeno (99 x 25,4 mm)</Option>
          <Option value={2}>Grande (99 x 33,9 mm)</Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

PrintLabelForm.propTypes = {
  form: PropTypes.any,
}
