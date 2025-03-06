import { Form } from '@ant-design/compatible'
import { Button, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import DataProviderModalForm from './DataProviderModalForm'

function DataProviderModal({ form, providerModal, setProviderModal }) {
  const providers = [
    { id: 1, provider: 'Whirlpool' },
    { id: 2, provider: 'Electrolux' },
  ]

  function handleSave() {
    form.validateFields((err, values) => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        setProviderModal(false)
      }
    })
  }

  return (
    <Modal
      title="Fornecedor de dados"
      visible={providerModal}
      bodyStyle={{ paddingBottom: 0 }}
      onCancel={() => setProviderModal(false)}
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
            onClick={() => setProviderModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <DataProviderModalForm {...{ form, providers }} />
    </Modal>
  )
}

DataProviderModal.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func,
  }),
  providerModal: PropTypes.bool,
  setProviderModal: PropTypes.func,
}

const WrappedDataProviderModal = Form.create()(DataProviderModal)
export default WrappedDataProviderModal
