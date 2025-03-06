import { Button, Upload } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function NewAttendanceModalImages({ fileList, setFileList }) {
  const uploadConfig = {
    listType: 'picture',
    className: 'upload-list-inline',
    onRemove: file => {
      setFileList(list => {
        const index = list.indexOf(file)
        const newFileList = list.slice()
        newFileList.splice(index, 1)
        return [...newFileList]
      })
    },
    beforeUpload: file => {
      setFileList(list => [...list, file])
      return false
    },
    ...fileList,
  }
  return (
    <Upload {...uploadConfig}>
      <Button className="iconButton">
        <i className="fa fa-upload mr-3" aria-hidden="true" />
        {formatMessage({
          id: 'attachFile',
        })}
      </Button>
    </Upload>
  )
}

NewAttendanceModalImages.propTypes = {
  fileList: PropTypes.array,
  setFileList: PropTypes.any,
}
