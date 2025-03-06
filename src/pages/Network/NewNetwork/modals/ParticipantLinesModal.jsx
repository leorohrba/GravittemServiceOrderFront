import { Form } from '@ant-design/compatible'
import { Button, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import ParticipantLinesModalForm from './ParticipantLinesModalForm'

function ParticipantLinesModal({ form, linesModal, setLinesModal }) {
  const lines = [
    { id: 1, line: 'Refrigeração' },
    { id: 2, line: 'Lavanderia' },
  ]

  function handleSave() {
    form.validateFields((err, values) => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        setLinesModal(false)
      }
    })
  }

  return (
    <Modal
      title="Linhas do participante"
      visible={linesModal}
      bodyStyle={{ paddingBottom: 0 }}
      onCancel={() => setLinesModal(false)}
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
            onClick={() => setLinesModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <ParticipantLinesModalForm {...{ form, lines }} />
    </Modal>
  )
}

ParticipantLinesModal.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func,
  }),
  linesModal: PropTypes.bool,
  setLinesModal: PropTypes.func,
}

const WrappedParticipantLinesModal = Form.create()(ParticipantLinesModal)
export default WrappedParticipantLinesModal
