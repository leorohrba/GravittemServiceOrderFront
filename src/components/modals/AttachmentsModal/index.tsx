import Button from '@components/Button'
import { apiAttachment } from '@services/api'
import { getAuthToken, handleAuthError } from '@utils'
import { message } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import AttachmentsModal from './AttachmentsModal'
import { AttachmentsModalContent } from './AttachmentsModalContent'
import { ICreateWithId } from '@Interfaces/CreateWithIdInterface'

const AttachmentsModalConfig = ({
  entityId,
  isTable,
  hideModal,
  offline,
  externalFileList,
  setExternalFileList,
  buttonClassName,
  offlineFilesList,
  setOfflineFilesList,
  setAttachmentsQuantity,
  openModal,
  setOpenModal,
  canEdit = true,
  createWithId = {
    condition: false,
    entityId: null,
  },
}): { createWithId: ICreateWithId } => {
  const [attachments, setAttachments] = useState([])
  const [fileList, setFileList] = useState([])
  const [attachmentsModalVisible, setAttachmentsModalVisible] = useState(false)
  const [loadingAttachments, setLoadingAttachments] = useState(true)
  const [uploadingFile, setUploadingFile] = useState(false)
  const uploadConfig = {
    action: createWithId?.condition
      ? `${process.env.UMI_API_SERVICE}/api/CriarAnexoOrdemServico/${createWithId?.entityId}`
      : `${process.env.UMI_API_HOST_ATTACHMENT}/api/Anexo/${entityId}`,
  }

  useEffect(() => {
    getAuthToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (openModal) {
      setAttachmentsModalVisible(true)
    }
  }, [])

  useEffect(() => {
    if (entityId) {
      getAttachments()
    } else {
      setAttachments([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId])

  const getAttachments = async () => {
    setLoadingAttachments(true)
    try {
      const response = await apiAttachment.get(`/api/Anexo/${entityId}`)
      const { data } = response
      setAttachments(data.arquivos)
      hideModal && setAttachmentsQuantity(data.arquivos.length || 0)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os anexos')
    }
    setLoadingAttachments(false)
  }

  return (
    <React.Fragment>
      {hideModal ? (
        <AttachmentsModalContent
          {...{
            offline,
            uploadConfig,
            offlineFilesList,
            setOfflineFilesList,
            getAttachments,
            loadingAttachments,
            attachmentsModalVisible,
            setAttachmentsModalVisible,
            uploadingFile,
            setUploadingFile,
            fileList,
            setFileList,
            externalFileList,
            setExternalFileList,
            attachments,
            entityId,
            setAttachments,
            setLoadingAttachments,
            canEdit,
          }}
        />
      ) : (
        <React.Fragment>
          <Button
            disabled={!entityId}
            className={buttonClassName}
            onClick={() => setAttachmentsModalVisible(true)}
            quantity={attachments.length}
            shape={isTable && 'circle'}
          >
            <i
              className={`fa fa-paperclip fa-lg ${!isTable && attachments.length > 0 ? 'mr-3' : 'mr-1'
                }`}
            />
            {!isTable && 'Anexos'}
          </Button>
          <AttachmentsModal
            {...{
              uploadConfig,
              attachmentsModalVisible,
              setAttachmentsModalVisible,
              fileList,
              setFileList,
              setUploadingFile,
              attachments,
              getAttachments,
              loadingAttachments,
              setLoadingAttachments,
              setAttachments,
              entityId,
              openModal,
              setOpenModal,
              canEdit,
            }}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

AttachmentsModalConfig.propTypes = {
  attachments: PropTypes.array,
  buttonClassName: PropTypes.string,
  entityId: PropTypes.string,
  fileList: PropTypes.array,
  hideModal: PropTypes.bool,
  setAttachments: PropTypes.func,
  setFileList: PropTypes.func,
  setAttachmentsQuantity: PropTypes.func,
  setVisibleAttachmentsModal: PropTypes.func,
  visibleAttachmentsModal: PropTypes.bool,
  isTable: PropTypes.bool,
}

export default AttachmentsModalConfig
