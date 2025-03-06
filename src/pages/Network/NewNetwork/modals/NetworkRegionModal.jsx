import { Form } from '@ant-design/compatible'
import { Button, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NetworkRegionModalForm from './NetworkRegionModalForm'

function NetworkRegionModal({ form, regionModal, setRegionModal }) {
  function handleSave() {
    form.validateFields((err, values) => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        setRegionModal(false)
      }
    })
  }
  return (
    <Modal
      title="Regiões da rede"
      visible={regionModal}
      onCancel={() => setRegionModal(false)}
      footer={
        <div className="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            onClick={() => setRegionModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <NetworkRegionModalForm {...{ form }} />
    </Modal>
  )
}

NetworkRegionModal.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func,
  }),
  regionModal: PropTypes.bool,
  setRegionModal: PropTypes.func,
}

const WrappedNetworkRegionModal = Form.create()(NetworkRegionModal)
export default WrappedNetworkRegionModal
