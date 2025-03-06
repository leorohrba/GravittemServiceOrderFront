import { cleanup, fireEvent, render } from '@testing-library/react'
import { InputNumber } from 'antd'
import React from 'react'

afterEach(cleanup)

it('render inputNumber', async () => {
  const value = '1'
  const { getByTestId } = render(
    <InputNumber data-testid="inputNumber-test-id" value={value} />,
  )
  const input = getByTestId('inputNumber-test-id')

  expect(input.value).toBe(value)
})

it('validate inputNumber', async () => {
  const value = 'A'
  const { getByTestId } = render(
    <InputNumber data-testid="inputNumber-test-id" />,
  )
  const input = getByTestId('inputNumber-test-id')
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value } })
  fireEvent.blur(input)

  expect(input.value).not.toBe(value)
})
