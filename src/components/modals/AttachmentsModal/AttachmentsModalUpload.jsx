import { Button, message, Upload } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const fileLimiteSizeForUpload = 50

const beforeUpload = file => {
  const isBig = file.size / 1024 / 1024 > fileLimiteSizeForUpload
  if (isBig) {
    message.error(`Arquivo deve ser menor que ${fileLimiteSizeForUpload}MB!`)
  }
  return !isBig
}

export function AttachmentsModalUpload({
  getAttachments,
  offlineFilesList,
  setOfflineFilesList,
  token,
  uploadConfig,
  offline,
  fileList,
  setFileList,
  externalFileList,
  setExternalFileList,
  uploadingFile,
  setUploadingFile,
  canEdit,
}) {
  const onChangeFile = info => {
    const { file } = info
    let removeFile = false
    if (
      offline &&
      file.status !== 'removed' &&
      file.status !== null &&
      file.status !== undefined
    ) {
      setUploadingFile(false)
      file.status = 'done'
    } else if (file.response && file.response.isOk) {
      removeFile = true
      getAttachments()
      setUploadingFile(false)
    } else if (
      file.status === 'removed' ||
      file.status === null ||
      file.status === undefined
    ) {
      offlineFilesList &&
        setOfflineFilesList(
          offlineFilesList.filter(o => o.file.name !== file.name),
        )
      removeFile = true
      setUploadingFile(false)
    } else if (file.status === 'uploading') {
      setUploadingFile(true)
    } else {
      message.error('Ocorreu algum erro ao efetuar o upload!')
      setUploadingFile(false)
    }

    if (removeFile) {
      externalFileList
        ? setExternalFileList(
            externalFileList.filter(e => e.name !== file.name),
          )
        : setFileList([])
    } else {
      externalFileList
        ? setExternalFileList([...externalFileList, file])
        : setFileList([file])
    }
  }
  function customRequest(value) {
    setOfflineFilesList([...offlineFilesList, value])
  }
  return (
    <Upload
      headers={{
        Authorization: token,
      }}
      onChange={onChangeFile}
      fileList={externalFileList ?? fileList}
      customRequest={offline ? customRequest : null}
      beforeUpload={beforeUpload}
      {...uploadConfig}
    >
      <Button disabled={!canEdit || uploadingFile} hidden={!canEdit}>
        <i
          className="fa fa-upload fa-lg mr-3"
          style={{
            color: 'gray',
          }}
          aria-hidden="true"
        />
        Anexar arquivo
      </Button>
    </Upload>
  )
}

AttachmentsModalUpload.propTypes = {
  fileList: PropTypes.array,
  getAttachments: PropTypes.func,
  uploadingFile: PropTypes.bool,
  proposalId: PropTypes.string,
  setFileList: PropTypes.func,
  setUploadingFile: PropTypes.func,
  token: PropTypes.string,
  uploadConfig: PropTypes.object,
}
