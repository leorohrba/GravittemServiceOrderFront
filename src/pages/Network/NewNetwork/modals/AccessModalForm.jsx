import { Form } from '@ant-design/compatible'
import { Alert, AutoComplete, Button, Radio, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const { Option } = Select

export default function AccessModalForm({
  selectedAccess,
  setSelectedAccess,
  selectedEmail,
  setSelectedEmail,
}) {
  const [visibleSendPassword, setVisibleSendPassword] = useState(true)

  const emails = [{ id: 1, email: 'teste@teste.com' }]

  function sendPassword() {
    selectedEmail && setVisibleSendPassword(false)
  }

  return (
    <Form layout="vertical">
      <Form.Item label="Acesso">
        <Radio.Group
          buttonStyle="solid"
          defaultValue={selectedAccess}
          onChange={e => setSelectedAccess(e.target.value)}
        >
          <Radio.Button
            value
            style={
              selectedAccess
                ? { backgroundColor: '#1976d2', borderColor: '#1976d2' }
                : { backgroundColor: 'white' }
            }
          >
            Liberado
          </Radio.Button>
          <Radio.Button
            value={false}
            style={
              !selectedAccess
                ? {
                    backgroundColor: '#ed3636',
                    borderColor: '#ed3636',
                    boxShadow: '-1px 0 0 0 #ed3636',
                  }
                : { backgroundColor: 'white' }
            }
          >
            Bloqueado
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Usuário (e-mail)" style={{ marginBottom: 0 }}>
        <AutoComplete
          onSelect={e => setSelectedEmail(e)}
          dataSource={emails.map(e => (
            <Option key={e.id} value={e.email}>
              {e.email}
            </Option>
          ))}
        />
      </Form.Item>
      {visibleSendPassword ? (
        <Button type="link" className="px-0" onClick={sendPassword}>
          Enviar senha
        </Button>
      ) : (
        <Alert
          message={
            <React.Fragment>
              <span>Enviamos um e-mail para </span>
              <b>{selectedEmail}</b>
              <span> com instruções de senha.</span>
            </React.Fragment>
          }
          type="success"
          closable
        />
      )}
    </Form>
  )
}

AccessModalForm.propTypes = {
  selectedAccess: PropTypes.bool,
  selectedEmail: PropTypes.string,
  setSelectedAccess: PropTypes.func,
  setSelectedEmail: PropTypes.func,
}
