import { cleanup, fireEvent, render } from '@testing-library/react'
import { Select } from 'antd'
import React from 'react'

const { Option } = Select

afterEach(cleanup)

it('renders select', async () => {
  const { getByRole } = render(<Select />)
  const select = getByRole('combobox')

  expect(select).toBeInTheDocument()
})

it('handle selection', async () => {
  const options = [{ label: 'first', value: 1 }, { label: 'second', value: 2 }]
  const { getByRole, getByLabelText } = render(
    <Select>
      {options.map(o => (
        <Option value={o.label}>{o.label}</Option>
      ))}
    </Select>,
  )

  const select = getByRole('combobox')
  fireEvent.mouseDown(select)

  const selected = getByLabelText('first')

  expect(selected).toBeInTheDocument()
})
