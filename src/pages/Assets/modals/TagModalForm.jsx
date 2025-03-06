import { Form, Select, Tag, Tooltip } from 'antd'
import React from 'react'
import { useAssetContext } from '../context/AssetContext'

const { Option } = Select

export default function TagModalForm({ selectedTags, setSelectedTags }) {
  const { registeredTags } = useAssetContext()

  function handleSelect(value, tag) {
    const newTag = {
      id: value,
      descricao: tag.children,
    }
    setSelectedTags([...selectedTags, { ...newTag }])
  }

  const removeTag = tag => {
    const newTags = selectedTags.filter(x => x !== tag)
    setSelectedTags(newTags)
  }

  return (
    <Form layout="vertical">
      <Form.Item label="Tag" name="tag">
        <Select
          suffixIcon={<i className="fa fa-search" />}
          showSearch
          onSelect={handleSelect}
        >
          {registeredTags.map(d => (
            <Option value={d.id}>{d.descricao}</Option>
          ))}
        </Select>
      </Form.Item>
      {selectedTags.map(tag => {
        const isLongTag = tag.descricao.length > 20
        const tagElem = (
          <Tag
            key={tag.id}
            closable
            onClose={() => removeTag(tag)}
            color="blue"
          >
            {isLongTag ? `${tag.descricao.slice(0, 20)}...` : tag.descricao}
          </Tag>
        )
        return isLongTag ? (
          <Tooltip title={tag.descricao} key={tag.id}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        )
      })}
    </Form>
  )
}
