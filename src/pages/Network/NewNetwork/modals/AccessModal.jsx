import { Button, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import AccessModalForm from './AccessModalForm'

function AccessModal({ accessModal, setAccessModal }) {
  const [selectedAccess, setSelectedAccess] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState('')

  function handleSave() {
    // eslint-disable-next-line no-unused-vars
    const body = {
      access: selectedAccess,
      email: selectedEmail,
    }
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    setAccessModal(false)
  }

  return (
    <Modal
      title="Acesso do participante"
      visible={accessModal}
      onCancel={() => setAccessModal(false)}
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
            onClick={() => setAccessModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <AccessModalForm
        {...{
          selectedAccess,
          setSelectedAccess,
          selectedEmail,
          setSelectedEmail,
        }}
      />
    </Modal>
  )
}

AccessModal.propTypes = {
  accessModal: PropTypes.bool,
  setAccessModal: PropTypes.func,
}

export default AccessModal
