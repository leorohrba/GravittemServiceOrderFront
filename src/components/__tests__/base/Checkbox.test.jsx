import { cleanup, fireEvent, render } from '@testing-library/react'
import { Checkbox } from 'antd'
import React from 'react'

afterEach(cleanup)

it('renders checkbox', async () => {
  const { getByRole } = render(<Checkbox />)
  const checkbox = getByRole('checkbox')

  expect(checkbox).toBeInTheDocument()
})

it('handle check', async () => {
  const { getByRole } = render(<Checkbox />)
  const checkbox = getByRole('checkbox')
  fireEvent.click(checkbox)

  expect(checkbox).toBeChecked()
})
