/* eslint-disable react/button-has-type */
import { getAuthToken } from '@utils'
import { Skeleton } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { AttachmentsModalItems } from './AttachmentsModalItems'
import { AttachmentsModalUpload } from './AttachmentsModalUpload'

export function AttachmentsModalContent({
  uploadConfig,
  fileList,
  setFileList,
  externalFileList,
  setExternalFileList,
  offline,
  attachments,
  offlineFilesList,
  setOfflineFilesList,
  entityId,
  loadingAttachments,
  setLoadingAttachments,
  uploadingFile,
  setUploadingFile,
  getAttachments,
  canEdit,
}) {
  useEffect(() => {
    getAuthToken()
    getTokenForUpload()
    if (offline) {
      setLoadingAttachments(false)
    } else {
      getAttachments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [token, setToken] = useState(null)

  function getTokenForUpload() {
    const tokenData =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('token')
        : null

    const authTokenData =
      tokenData !== null ? tokenData : localStorage.getItem('token')

    setToken(authTokenData)
  }

  const attachmentsSortedByDateAsc = attachments
    .slice()
    .sort((a, b) => moment(b.dataEnvio).unix() - moment(a.dataEnvio).unix())

  return (
    <React.Fragment>
      <AttachmentsModalUpload
        {...{
          entityId,
          offline,
          offlineFilesList,
          setOfflineFilesList,
          getAttachments,
          token,
          fileList,
          setFileList,
          externalFileList,
          setExternalFileList,
          uploadConfig,
          uploadingFile,
          setUploadingFile,
          canEdit,
        }}
      />
      <div className="ml-3 mt-3">
        <Skeleton
          className="px-4"
          loading={loadingAttachments}
          paragraph={{ rows: 5 }}
          active
        >
          {attachmentsSortedByDateAsc.map(record => {
            return (
              <AttachmentsModalItems
                record={record}
                entityId={entityId}
                getAttachments={getAttachments}
                canEdit={canEdit}
                setLoadingAttachments={setLoadingAttachments}
              />
            )
          })}
        </Skeleton>
      </div>
    </React.Fragment>
  )
}

AttachmentsModalContent.propTypes = {
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
  uploadConfig: PropTypes.object,
}
