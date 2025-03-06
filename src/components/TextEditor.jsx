import PropTypes from 'prop-types'
import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function TextEditor({ textContent, onEditorStateChange }) {
  return (
    <Editor
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      editorState={textContent}
      onEditorStateChange={onEditorStateChange}
      localization={{
        locale: 'pt',
      }}
      toolbar={{
        image: {
          uploadCallback: uploadImageCallBack,
        },
        options: [
          'colorPicker',
          'link',
          // 'image',
          // 'embedded',
          'remove',
          'history',
          'inline',
          'blockType',
          'fontSize',
          'fontFamily',
          'list',
          'textAlign',
        ],
      }}
    />
  )
}

TextEditor.propTypes = {
  textContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onEditorStateChange: PropTypes.func,
}

function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://api.imgur.com/3/image')
    xhr.setRequestHeader('Authorization', 'Client-ID 546c25a59c58ad7')
    const data = new FormData()
    data.append('image', file)
    xhr.send(data)
    xhr.addEventListener('load', () => {
      const response = JSON.parse(xhr.responseText)
      resolve(response)
    })
    xhr.addEventListener('error', () => {
      const error = JSON.parse(xhr.responseText)
      reject(error)
    })
  })
}
