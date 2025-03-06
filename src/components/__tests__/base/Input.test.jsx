import { cleanup, render } from '@testing-library/react'
import { Input } from 'antd'
import React from 'react'

afterEach(cleanup)

it('render input', async () => {
  const value = 'A'
  const { getByTestId } = render(
    <Input data-testid="input-test-id" value={value} />,
  )
  const input = getByTestId('input-test-id')

  expect(input.value).toBe('A')
})

it('validate input', async () => {
  const value = 'AB'
  const { getByTestId } = render(
    <Input data-testid="input-test-id" value={value} />,
  )
  const input = getByTestId('input-test-id')

  expect(input.value).not.toBe('A')
})
