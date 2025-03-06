import { Button, Form, message, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'
import AssetAddressModalForm from './AssetAddressModalForm'
import AssetAddressModalMap from './AssetAddressModalMap'

export default function AssetAddressModal() {
  const {
    visibleAssetAddressModal,
    setVisibleAssetAddressModal,
  } = useNewAssetContext()

  const [form] = Form.useForm()
  const [marker, setMarker] = useState({
    lat: -15.79753,
    lng: -47.89489,
  })

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
      setVisibleAssetAddressModal(false)
    })
  }

  return (
    <Modal
      title="Endereço do ativo"
      visible={visibleAssetAddressModal}
      onCancel={() => setVisibleAssetAddressModal(false)}
      destroyOnClose
      footer={
        <Row type="flex" justify="space-between">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            style={{
              marginRight: 'auto',
            }}
            onClick={() => setVisibleAssetAddressModal(false)}
          >
            Cancelar
          </Button>
          <Button style={{ color: 'red', borderColor: 'red' }}>Excluir</Button>
        </Row>
      }
    >
      <AssetAddressModalForm
        form={form}
        marker={marker}
        setMarker={setMarker}
      />
      <AssetAddressModalMap marker={marker} setMarker={setMarker} />
    </Modal>
  )
}
