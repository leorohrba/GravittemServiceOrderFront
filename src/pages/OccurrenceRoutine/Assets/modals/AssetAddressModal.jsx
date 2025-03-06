import { Form } from '@ant-design/compatible'
import { Button, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import AssetAddressModalForm from './AssetAddressModalForm'
import AssetAddressModalMap from './AssetAddressModalMap'

function AssetAddressModal({ form }) {
  const [marker, setMarker] = useState({
    lat: -15.79753,
    lng: -47.89489,
  })

  return (
    <Modal
      title="Endereço do ativo"
      visible={false}
      footer={
        <Row type="flex" justify="space-between">
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            Salvar
          </Button>
          <Button
            type="secondary"
            style={{
              marginRight: 'auto',
            }}
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

AssetAddressModal.propTypes = {
  form: PropTypes.any,
}

const WrappedAssetAddressModal = Form.create()(AssetAddressModal)
export default WrappedAssetAddressModal
