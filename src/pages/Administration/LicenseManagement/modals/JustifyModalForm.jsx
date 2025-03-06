import { Form, Input } from 'antd'
import { formatMessage } from 'umi-plugin-locale'

export default function JustifyModalForm({ form }) {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        label="Descrição"
        name="descricao"
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'requiredFieldMessage',
            }),
          },
        ]}
      >
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
      </Form.Item>
    </Form>
  )
}
