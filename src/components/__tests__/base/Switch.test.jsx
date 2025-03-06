import { cleanup, fireEvent, render } from '@testing-library/react'
import { Switch } from 'antd'
import React from 'react'

afterEach(cleanup)

it('renders switch', async () => {
  const { getByRole } = render(<Switch />)
  const switchButton = getByRole('switch')

  expect(switchButton).toBeInTheDocument()
})

it('handle check switch', async () => {
  const { getByRole } = render(<Switch />)
  const switchButton = getByRole('switch')
  fireEvent.click(switchButton)

  expect(switchButton).toBeChecked()
})
