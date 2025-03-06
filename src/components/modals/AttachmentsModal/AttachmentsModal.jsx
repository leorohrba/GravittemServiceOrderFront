import { Button, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { AttachmentsModalContent } from './AttachmentsModalContent'

const AttachmentsModal = ({
  uploadConfig,
  attachmentsModalVisible,
  setAttachmentsModalVisible,
  getAttachments,
  setUploadingFile,
  fileList,
  setFileList,
  attachments,
  setAttachments,
  loadingAttachments,
  entityId,
  openModal,
  setOpenModal,
  canEdit,
}) => {
  const handleCancel = () => {
    if (openModal) {
      setAttachmentsModalVisible(false)
      setOpenModal(false)
    } else {
      setAttachmentsModalVisible(false)
    }
  }

  return (
    <Modal
      id="modal-attachments"
      title="Anexos"
      style={{ top: '50px' }}
      width="33%"
      visible={attachmentsModalVisible}
      onCancel={handleCancel}
      footer={
        <Row type="flex" justify="space-between" align="middle">
          <Button
            id="button-cancel-attachment"
            type="secondary"
            onClick={handleCancel}
          >
            Voltar
          </Button>
          <p className="mb-0">{attachments.length} anexos</p>
        </Row>
      }
    >
      <AttachmentsModalContent
        {...{
          uploadConfig,
          getAttachments,
          loadingAttachments,
          attachmentsModalVisible,
          setAttachmentsModalVisible,
          fileList,
          setFileList,
          attachments,
          entityId,
          setAttachments,
          setUploadingFile,
          canEdit,
        }}
      />
    </Modal>
  )
}

AttachmentsModal.propTypes = {
  attachments: PropTypes.array,
  attachmentsModalVisible: PropTypes.bool,
  entityId: PropTypes.string,
  fileList: PropTypes.array,
  getAttachments: PropTypes.func,
  loadingAttachments: PropTypes.bool,
  setAttachments: PropTypes.func,
  setAttachmentsModalVisible: PropTypes.func,
  setFileList: PropTypes.func,
  setLoadingAttachments: PropTypes.func,
  setVisibleAttachmentsModal: PropTypes.func,
  uploadConfig: PropTypes.object,
  visibleAttachmentsModal: PropTypes.bool,
}

export default AttachmentsModal
