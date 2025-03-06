import { PlusOutlined } from '@ant-design/icons'
import { getLocaleDateFormat, isObjEmpty } from '@utils'
import { Col, DatePicker, Form, Input, Row, Select, Tag, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'

export default function NewAssetForm({
  form,
  tags,
  setTags,
  editData = {},
  isModal = false,
}) {
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const refTag = React.useRef()

  const isEdit = !isObjEmpty(editData)

  useEffect(() => {
    if (inputVisible && refTag.current) {
      refTag.current.focus()
    }
  }, [inputVisible])

  function handleInputConfirm() {
    let newTags = tags
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue]
    }
    setTags(newTags)
    setInputValue('')
    setInputVisible(false)
  }

  const removeTag = tag => {
    const newTags = tags.filter(x => x !== tag)
    setTags(newTags)
  }

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={isModal ? 12 : 9}>
          <Form.Item label="Cliente">
            <Select suffixIcon={<i className="fa fa-search" />} showSearch />
          </Form.Item>
        </Col>
        <Col span={isModal ? 12 : 9}>
          <Form.Item
            label={
              <React.Fragment className="flex items-baseline">
                <div>Produto</div>
                <a className="font-normal ml-3">
                  Detalhes do produto <i className="fa fa-external-link ml-1" />
                </a>
              </React.Fragment>
            }
          >
            <Select suffixIcon={<i className="fa fa-search" />} showSearch />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item label="Versão">
            <Input />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item
            label={
              <div className="flex items-baseline">
                <div>Data de compra</div>
                <a className="font-normal ml-3">Revendedor</a>
              </div>
            }
            extra={!isEdit && editData.vendedor}
          >
            <DatePicker
              format={getLocaleDateFormat()}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item label="Término de garantia">
            <DatePicker
              format={getLocaleDateFormat()}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item label="Número de série">
            <Input />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item label="Número de nota fiscal">
            <Input />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item label="Identificação">
            <Input />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item label="Número de patrimônio">
            <Input />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item
            label={
              <div className="flex items-baseline">
                <div>Data de instalação</div>
                <a className="font-normal ml-3">Instalador</a>
              </div>
            }
            extra={!isEdit && editData.tecnico}
          >
            <DatePicker
              format={getLocaleDateFormat()}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item label="Status">
            <Select />
          </Form.Item>
        </Col>
        <Col span={isModal ? 8 : 6}>
          <Form.Item label="Motivo">
            <Select />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Tags" className="mb-0 mt-2">
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20
          const tagElem = (
            <Tag key={tag} color="blue" closable onClose={() => removeTag(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          )
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          )
        })}
        {inputVisible ? (
          <Input
            type="text"
            size="small"
            style={{
              width: 120,
            }}
            value={inputValue}
            ref={refTag}
            onChange={e => setInputValue(e.target.value)}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag
            onClick={() => setInputVisible(true)}
            style={{
              background: '#fff',
              borderStyle: 'dashed',
            }}
          >
            <PlusOutlined /> Nova tag
          </Tag>
        )}
      </Form.Item>
    </Form>
  )
}
