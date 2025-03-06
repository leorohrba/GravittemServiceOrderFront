import { cleanup, fireEvent, render } from '@testing-library/react'
import { Button } from 'antd'
import React from 'react'

afterEach(cleanup)

it('clicks button', async () => {
  const onClick = jest.fn()
  const { getByRole } = render(<Button onClick={onClick}>Button</Button>)
  fireEvent.click(getByRole('button'))

  expect(onClick).toHaveBeenCalledTimes(1)
})
