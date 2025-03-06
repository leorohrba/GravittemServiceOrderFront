import { Button, Form, message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import React from 'react'
import { formatMessage } from 'umi-plugin-locale'
import { useLicenseManagementContext } from '../context/LicenseManagementContext'
import JustifyModalForm from './JustifyModalForm'

export default function JustifyModal() {
  const {
    visibleJustifyModal,
    setVisibleJustifyModal,
    selectedRows,
    setSelectedRows,
    setSelectedRowKeys,
    data,
    setData,
  } = useLicenseManagementContext()
  const [form] = Form.useForm()

  function handleSave() {
    form.validateFields().then(values => {
      selectedRows.forEach(row => {
        const index = data.findIndex(d => d.id === row.id)
        const updateData = data.find(d => d.id === row.id)
        setData(
          update(data, {
            [index]: {
              status: {
                $set: updateData.status === 'ativo' ? 'inativo' : 'ativo',
              },
            },
          }),
        )
      })
      form.resetFields()
      setSelectedRowKeys([])
      setSelectedRows([])
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      setVisibleJustifyModal(false)
    })
  }

  return (
    <Modal
      title="Justificativa"
      visible={visibleJustifyModal}
      centered
      destroyOnClose
      onCancel={() => setVisibleJustifyModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button onClick={() => setVisibleJustifyModal(false)}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <JustifyModalForm {...{ form }} />
    </Modal>
  )
}
