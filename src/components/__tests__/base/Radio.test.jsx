import { cleanup, fireEvent, render } from '@testing-library/react'
import { Radio } from 'antd'
import React from 'react'

afterEach(cleanup)

it('renders radio', async () => {
  const { getByRole } = render(<Radio />)
  const radio = getByRole('radio')

  expect(radio).toBeInTheDocument()
})

it('handle check radio', async () => {
  const { getByRole } = render(<Radio />)
  const radio = getByRole('radio')
  fireEvent.click(radio)

  expect(radio).toBeChecked()
})
