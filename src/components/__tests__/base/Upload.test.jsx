import { cleanup, fireEvent, render } from '@testing-library/react'
import { Button, message, Upload } from 'antd'
import React from 'react'

afterEach(cleanup)

const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      // eslint-disable-next-line no-console
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

it('renders upload', async () => {
  render(
    <Upload {...props}>
      <Button>Click to Upload</Button>
    </Upload>,
  )
  const uploader = document.querySelector('input[type="file"]')
  expect(uploader).toBeInTheDocument()
})

it('handle upload', async () => {
  const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
  render(
    <Upload {...props}>
      <Button>Click to Upload</Button>
    </Upload>,
  )
  const input = document.querySelector('input[type="file"]')
  fireEvent.change(input, { target: { files: [file] } })
  expect(input.files).toHaveLength(1)
  expect(input.files[0]).toStrictEqual(file)
})
