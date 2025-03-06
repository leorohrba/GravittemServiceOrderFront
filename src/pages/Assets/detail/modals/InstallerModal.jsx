import { Button, Form, message, Modal, Row } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'
import InstallerModalForm from './InstallerModalForm'

export default function InstallerModal() {
  const {
    visibleInstallerModal,
    setVisibleInstallerModal,
  } = useNewAssetContext()
  const [form] = Form.useForm()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
      setVisibleInstallerModal(false)
    })
  }

  return (
    <Modal
      title="Instalador"
      visible={visibleInstallerModal}
      onCancel={() => setVisibleInstallerModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button onClick={() => setVisibleInstallerModal(false)}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <InstallerModalForm {...{ form }} />
    </Modal>
  )
}
