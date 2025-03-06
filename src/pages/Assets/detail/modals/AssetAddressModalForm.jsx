import { Col, Form, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import InputMask from 'react-input-mask'

const { Option } = Select

export default function AssetAddressModalForm({ form, marker, setMarker }) {
  useEffect(() => {
    form.setFieldsValue({ lat: marker.lat, lng: marker.lng })
  }, [marker])

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Tipo de endereço">
            <Select>
              <Option value={1}>Endereço comercial</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="CEP">
            <InputMask mask="99999-999" maskChar="_" className="ant-input" />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={18}>
          <Form.Item label="Endereço">
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Número">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Bairro">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Complemento">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Referência">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Município">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Estado">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="País">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Latitude" name="lat">
            <Input
              onChange={e =>
                setMarker({ lat: e.target.value, lng: marker.lng })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Longitude" name="lng">
            <Input
              onChange={e =>
                setMarker({ lat: marker.lat, lng: e.target.value })
              }
            />
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
