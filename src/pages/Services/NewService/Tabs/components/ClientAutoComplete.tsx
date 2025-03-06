import React from 'react'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import { NewAutoComplete } from '@components/refactored'
import { hasPermission } from '@utils'
import { apiCRM } from '@services/api'
const { Option } = Select

function ClientAutoComplete(props) {
  const {
    form,
    clients,
    setClients,
    handleSelectClient,
    openNewPersonModal,
    userPermissions,
    editCRMPerson,
    handleSelectClientContact,
    contactsClient,
    resetedForm,
    handleContactName,
    hasSelectedPerson
  } = props

  return (
    <Row wrap={true} justify="center" gutter={6}>
      <Col flex={11}>
        <NewAutoComplete
          form={form}
          source={clients}
          setSource={setClients}
          fieldName="finalCustomerId"
          placeholder="Digite o nome do cliente"
          serviceApi={apiCRM}
          api="api/CRM/Person"
          defaultParams={{ getPersonDetails: true }}
          paramName="name"
          label="Cliente"
          required
          recordId="customerId"
          recordDescription="name"
          nameList="person"
          onChange={e => handleSelectClient(e)}
        />
      </Col>
      {hasPermission(userPermissions, 'Include') ? (
        <Row
          wrap={true}
          align="bottom"
          justify="center"
          gutter={3}
          className=""
        >
          <Col className="mt-3">
            <Button
              size="small"
              className="mb-6"
              icon
              onClick={() => openNewPersonModal()}
            >
              <i className=" fa fa-file-text-o" aria-hidden="true"></i>
            </Button>
          </Col>

          <Col flex={1} className="mt-3 mb-6">
            <Button disabled={!hasSelectedPerson} icon size="small">
              <i
                className="fa fa-pencil"
                onClick={() => editCRMPerson('Client')}
                aria-hidden="true"
              ></i>
            </Button>
          </Col>
        </Row>
      ) : null}

      <Col className="ml-1" flex={11}>
        <Form.Item
          label="Contato Principal"
          name="clientContact"
          rules={[{ required: true }]}
        >
          <Select
            onSelect={e => handleSelectClientContact(e)}
            disabled={!hasSelectedPerson}
          >
            {contactsClient
              ?.filter(
                client =>
                  client.cellPhoneId > 0 ||
                  client.phoneId > 0 ||
                  client.emailId > 0,
              )
              .map(contact => (
                <Option value={contact?.contactId} key={contact?.contactId}>
                  {contact?.contactName}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Col>
      <Col className="ml-1" style={{ paddingTop: '1.9rem' }} flex={11}>
        <Form.Item>
          <Input
            disabled
            value={resetedForm ? '' : handleContactName()}
            placeholder="Telefone, Celular ou E-mail do Contato"
          />
        </Form.Item>
      </Col>
    </Row>
  )
}

export default ClientAutoComplete
