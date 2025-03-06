import { Form } from '@ant-design/compatible'
import { defaultStatus } from '@pages/financial/enums'
import { Button, Col, Divider, Dropdown, Input, Menu, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import DataProviderModal from '../modals/DataProviderModal'
import DocumentsModal from '../modals/DocumentsModal'
import MultipleEditModal from '../modals/MultipleEditModal'
import NetworkRegionModal from '../modals/NetworkRegionModal'
import PriceListModal from '../modals/PriceListModal'
import SearchParticipantModal from '../modals/SearchParticipantModal'

const { Option } = Select

export default function NewNetworkForm({
  form,
  selectedRows,
  participantsData,
  setParticipantsData,
}) {
  const { getFieldDecorator } = form

  const [documentsModal, setDocumentsModal] = useState(false)
  const [providerModal, setProviderModal] = useState(false)
  const [priceListModal, setPriceListModal] = useState(false)
  const [regionModal, setRegionModal] = useState(false)
  const [participantModal, setParticipantModal] = useState(false)
  const [multipleEditModal, setMultipleEditModal] = useState(false)

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setProviderModal(true)}>
        Fornecedor de dados
      </Menu.Item>
      <Menu.Item onClick={() => setDocumentsModal(true)}>Documentos</Menu.Item>
      <Menu.Item onClick={() => setPriceListModal(true)}>
        Lista de preços
      </Menu.Item>
      <Menu.Item onClick={() => setRegionModal(true)}>Regiões</Menu.Item>
    </Menu>
  )

  return (
    <div>
      <div className="flex">
        <h2>Rede</h2>
        <Dropdown overlay={menu}>
          <Button className="iconButton ml-auto">
            <i className="fa fa-ellipsis-v" aria-hidden="true" />
          </Button>
        </Dropdown>
      </div>
      <Divider className="mt-0" />

      <SearchParticipantModal
        {...{
          form,
          participantModal,
          setParticipantModal,
          setParticipantsData,
        }}
      />
      <MultipleEditModal
        {...{ form, multipleEditModal, setMultipleEditModal }}
        data={participantsData}
        selectedData={selectedRows}
        setData={setParticipantsData}
      />
      <DataProviderModal {...{ providerModal, setProviderModal }} />
      <DocumentsModal {...{ documentsModal, setDocumentsModal }} type="Rede" />
      <PriceListModal {...{ priceListModal, setPriceListModal }} />
      <NetworkRegionModal {...{ regionModal, setRegionModal }} />

      <Form layout="vertical">
        <Row type="flex" gutter={16}>
          <Col span={10}>
            <Form.Item label="Nome da rede">
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Status">
              {getFieldDecorator('status', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'requiredFieldMessage',
                    }),
                  },
                ],
              })(
                <Select>
                  {defaultStatus.map(s => (
                    <Option value={s.id}>{s.name}</Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className="flex">
        {selectedRows.length === 0 ? (
          <Button type="primary" onClick={() => setParticipantModal(true)}>
            Adicionar participantes
          </Button>
        ) : (
          <Button className="mr-2" onClick={() => setMultipleEditModal(true)}>
            <i
              className="fa fa-pencil-square-o fa-lg mr-3"
              aria-hidden="true"
            />
            Editar em lote ({selectedRows.length})
          </Button>
        )}
      </div>
    </div>
  )
}

NewNetworkForm.propTypes = {
  form: PropTypes.any,
  participantsData: PropTypes.array,
  setParticipantsData: PropTypes.func,
  selectedRows: PropTypes.shape({
    length: PropTypes.number,
  }),
}
