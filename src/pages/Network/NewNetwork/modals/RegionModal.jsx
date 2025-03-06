import { Form } from '@ant-design/compatible'
import { Button, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import RegionModalForm from './RegionModalForm'

function RegionModal({ form, regionModal, setRegionModal }) {
  const regions = [{ id: 1, region: 'Teste' }]

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
      title="Região do participante"
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
      <RegionModalForm
        {...{
          form,
          regions,
        }}
      />
    </Modal>
  )
}

RegionModal.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func,
  }),
  regionModal: PropTypes.bool,
  setRegionModal: PropTypes.func,
}

const WrappedRegionModal = Form.create()(RegionModal)
export default WrappedRegionModal
