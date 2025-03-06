import { Form } from '@ant-design/compatible'
import { Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import InputMask from 'react-input-mask'

const { Option } = Select

export default function AssetAddressModalForm({ form, marker, setMarker }) {
  const { getFieldDecorator, setFieldsValue } = form

  useEffect(() => {
    setFieldsValue({ lat: marker.lat, lng: marker.lng })
  }, [marker, setFieldsValue])

  return (
    <Form layout="vertical">
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Tipo de endereço">
            {getFieldDecorator('addressType', {
              initialValue: '',
            })(
              <Select>
                <Option value={1}>Endereço comercial</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="CEP">
            {getFieldDecorator('cep', {
              initialValue: '',
            })(
              <InputMask mask="99999-999" maskChar="_" className="ant-input" />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={18}>
          <Form.Item label="Endereço">
            {getFieldDecorator('address', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Número">
            {getFieldDecorator('number', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Bairro">
            {getFieldDecorator('neighborhood', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Complemento">
            {getFieldDecorator('complement', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Referência">
            {getFieldDecorator('reference', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Município">
            {getFieldDecorator('city', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Estado">
            {getFieldDecorator('state', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="País">
            {getFieldDecorator('country', {
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Latitude">
            {getFieldDecorator('lat', {
              initialValue: marker.lat || 0,
            })(
              <Input
                onChange={e =>
                  setMarker({ lat: e.target.value, lng: marker.lng })
                }
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Longitude">
            {getFieldDecorator('lng', {
              initialValue: marker.lng || 0,
            })(
              <Input
                onChange={e =>
                  setMarker({ lat: marker.lat, lng: e.target.value })
                }
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

AssetAddressModalForm.propTypes = {
  form: PropTypes.any,
  marker: PropTypes.any,
  setMarker: PropTypes.any,
}
