import { PlusOutlined } from '@ant-design/icons'
import TextEditor from '@components/TextEditor'
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tag,
  Tooltip,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useNotificationManagementDataContext } from '../context/NotificationManagementData'

const { Option } = Select

export default function NewNotificationModalForm({
  form,
  tags,
  setTags,
  textContent,
  setTextContent,
}) {
  const {
    setDocumentsModal,
    linkedDocuments,
  } = useNotificationManagementDataContext()

  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const refTag = React.useRef()

  const onEditorStateChange = editorState => {
    setTextContent(editorState)
  }

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
        <Col span={12}>
          <Form.Item label="Remetente" name="remetente">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Destinatário" name="destinatario">
            <AutoComplete>
              <Input.Search />
            </AutoComplete>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Assunto" name="assunto">
        <Input />
      </Form.Item>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Tipo" name="tipo">
            <Select placeholder="Selecionar">
              <Option value={1}>Tarefa</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Prioridade" name="prioridade">
            <Select placeholder="Selecionar">
              <Option value={1}>Alta</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <TextEditor {...{ textContent, onEditorStateChange }} />
      <Button
        className="iconButton my-3"
        onClick={() => setDocumentsModal(true)}
      >
        <i className="fa fa-link mr-2" /> Vincular documento
      </Button>
      {linkedDocuments.map(d => (
        <div>
          <i className="fa fa-link ml-1 mr-2" /> {d.ordemServico}
        </div>
      ))}
      <Form.Item label="Tags" className="mb-0 mt-2">
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20
          const tagElem = (
            <Tag key={tag} closable onClose={() => removeTag(tag)}>
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

NewNotificationModalForm.propTypes = {
  form: PropTypes.any,
  linkedDocuments: PropTypes.array,
  setTags: PropTypes.func,
  setDocumentsModal: PropTypes.func,
  setTextContent: PropTypes.func,
  tags: PropTypes.shape({
    filter: PropTypes.func,
    indexOf: PropTypes.func,
    map: PropTypes.func,
  }),
  textContent: PropTypes.any,
}
