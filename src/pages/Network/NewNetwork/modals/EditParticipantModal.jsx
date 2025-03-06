import { Form } from '@ant-design/compatible'
import { Button, message, Modal } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import EditParticipantModalForm from './EditParticipantModalForm'

function EditParticipantModal({
  form,
  editModal,
  setEditModal,
  participantsData,
  setParticipantsData,
  editData,
}) {
  function handleSave() {
    form.validateFields((err, values) => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )

        const index = participantsData.findIndex(d => d.id === editData.id)
        setParticipantsData(
          update(participantsData, {
            [index]: {
              participante: { $set: values.participante },
              credenciamento: { $set: values.credenciamento },
              descredenciamento: { $set: values.descredenciamento },
              status: { $set: values.status },
            },
          }),
        )

        setEditModal(false)
      }
    })
  }
  return (
    <Modal
      title="Editar participante"
      visible={editModal}
      destroyOnClose
      onCancel={() => setEditModal(false)}
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
            onClick={() => setEditModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <EditParticipantModalForm {...{ form, editData }} />
    </Modal>
  )
}

EditParticipantModal.propTypes = {
  editData: PropTypes.any,
  editModal: PropTypes.bool,
  form: PropTypes.shape({
    validateFields: PropTypes.func,
  }),
  participantsData: PropTypes.array,
  setParticipantsData: PropTypes.func,
  setEditModal: PropTypes.func,
}

const WrappedEditParticipantModal = Form.create()(EditParticipantModal)
export default WrappedEditParticipantModal
