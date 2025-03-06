import { Form, Select, Tag } from 'antd'

export default function NewTaskModalParticipants({ form, tags, setTags }) {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item label="Participantes">
        <Select suffixIcon={<i className="fa fa-search" />} showSearch />
      </Form.Item>
      {tags.map(tag => (
        <Tag closable color="blue">
          {tag.nome}
        </Tag>
      ))}
    </Form>
  )
}
