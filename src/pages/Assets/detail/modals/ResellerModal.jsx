import { Button, Form, message, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'
import ResellerModalForm from './ResellerModalForm'

export default function ResellerModal() {
  const { visibleResellerModal, setVisibleResellerModal } = useNewAssetContext()

  const [form] = Form.useForm()
  const [searchValue, setSearchValue] = useState()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
      setVisibleResellerModal(false)
    })
  }

  return (
    <Modal
      title="Revendedor"
      visible={visibleResellerModal}
      onCancel={() => setVisibleResellerModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button onClick={() => setVisibleResellerModal(false)}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <ResellerModalForm {...{ form, searchValue, setSearchValue }} />
    </Modal>
  )
}
