import { cleanup, fireEvent, render } from '@testing-library/react'
import { Modal } from 'antd'
import React from 'react'

afterEach(cleanup)

it('renders modal', async () => {
  const { getByRole } = render(<Modal visible />)
  const modal = getByRole('dialog')
  expect(modal).toBeInTheDocument()
})

it('renders modal data', async () => {
  const { getByText } = render(<Modal visible>Modal data</Modal>)
  const data = getByText('Modal data')

  expect(data).toBeVisible()
})

it('closes modal', async () => {
  const handleClose = jest.fn()
  const { getByLabelText } = render(<Modal visible onCancel={handleClose} />)
  const closeButton = getByLabelText('Close')
  fireEvent.click(closeButton)
  expect(handleClose).toHaveBeenCalledTimes(1)
})
