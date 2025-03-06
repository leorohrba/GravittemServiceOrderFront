import { Form, Input } from 'antd'

export default function NewTaskModalPlace({ form }) {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item label="Local/endereço" name="local">
        <Input />
      </Form.Item>
    </Form>
  )
}
