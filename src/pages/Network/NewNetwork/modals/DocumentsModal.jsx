import { Form } from '@ant-design/compatible'
import { Button, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import DocumentsModalForm from './DocumentsModalForm'

function DocumentsModal({ form, type, documentsModal, setDocumentsModal }) {
  const documents = [
    { id: 1, document: 'Ordem de serviço standard' },
    { id: 2, document: 'Ordem de serviço eletrodoméstico' },
  ]

  function handleSave() {
    form.validateFields((err, values) => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        setDocumentsModal(false)
      }
    })
  }

  return (
    <Modal
      title={
        type === 'Rede' ? 'Documentos da rede' : 'Documentos do participante'
      }
      visible={documentsModal}
      bodyStyle={{ paddingBottom: 0 }}
      onCancel={() => setDocumentsModal(false)}
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
            onClick={() => setDocumentsModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <DocumentsModalForm {...{ form, documents }} />
    </Modal>
  )
}

DocumentsModal.propTypes = {
  documentsModal: PropTypes.bool,
  form: PropTypes.func,
  setDocumentsModal: PropTypes.func,
  type: PropTypes.string,
}

const WrappedDocumentsModal = Form.create()(DocumentsModal)
export default WrappedDocumentsModal
