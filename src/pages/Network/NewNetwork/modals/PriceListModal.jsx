import { Form } from '@ant-design/compatible'
import { Button, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import PriceListModalForm from './PriceListModalForm'

function PriceListModal({ form, priceListModal, setPriceListModal }) {
  const priceList = [{ id: 1, name: 'Lista 1' }]

  function handleSave() {
    form.validateFields((err, values) => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        setPriceListModal(false)
      }
    })
  }

  return (
    <Modal
      title="Lista de preço"
      visible={priceListModal}
      onCancel={() => setPriceListModal(false)}
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
            onClick={() => setPriceListModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <PriceListModalForm {...{ form, priceList }} />
    </Modal>
  )
}

PriceListModal.propTypes = {
  form: PropTypes.any,
  priceListModal: PropTypes.bool,
  setPriceListModal: PropTypes.func,
}

const WrappedPriceListModal = Form.create()(PriceListModal)
export default WrappedPriceListModal
