import { Form } from '@ant-design/compatible'
import { hasPermission } from '@utils'
import { Alert, Badge, Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

export default function NewGroupForm({
  form,
  userPermissions,
  alertMessages,
  editData,
}) {
  const { getFieldDecorator } = form
  const refAlert = React.useRef()

  useEffect(() => {
    if (alertMessages.length > 0 && refAlert.current) {
      refAlert.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertMessages])

  return (
    <Form layout="vertical">
      <div ref={refAlert}>
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message.mensagem}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}
      </div>

      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item label="Nome do grupo">
            {getFieldDecorator('description', {
              initialValue: editData?.descricao,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(
              <Input
                readOnly={!hasPermission(userPermissions, 'Alter')}
                autoFocus
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Status">
            {getFieldDecorator('status', {
              initialValue: editData?.status || 1,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(
              <Select
                disabled={!hasPermission(userPermissions, 'Alter')}
                placeholder={formatMessage({ id: 'select' })}
              >
                <Option value={1}>
                  <Badge
                    style={{ color: 'green' }}
                    color="green"
                    text="Ativo"
                  />
                </Option>
                <Option value={2}>
                  <Badge style={{ color: 'red' }} color="red" text="Inativo" />
                </Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

NewGroupForm.propTypes = {
  form: PropTypes.any,
  userPermissions: PropTypes.array,
  editData: PropTypes.any,
  alertMessages: PropTypes.array,
}
