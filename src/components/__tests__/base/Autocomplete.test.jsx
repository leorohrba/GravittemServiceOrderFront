import { cleanup, fireEvent, render } from '@testing-library/react'
import { AutoComplete } from 'antd'
import React from 'react'

const { Option } = AutoComplete

afterEach(cleanup)

it('renders autocomplete list', async () => {
  const options = [
    { label: 'testing', value: '1' },
    { label: 'value', value: '2' },
    { label: 'testando', value: '3' },
  ]
  const { getByRole } = render(
    <AutoComplete>
      {options.map((o, index) => (
        <Option value={o.value} key={index}>
          {o.label}
        </Option>
      ))}
    </AutoComplete>,
  )
  const autoComplete = getByRole('combobox')

  fireEvent.mouseDown(autoComplete)

  const list = document.querySelectorAll('.ant-select-item-option')
  expect(list.length).toBe(3)
})

it('renders autocomplete search', async () => {
  const options = [
    { label: 'testing', value: '1' },
    { label: 'value', value: '2' },
    { label: 'testando', value: '3' },
  ]
  const { getByRole } = render(
    <AutoComplete
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {options.map((o, index) => (
        <Option value={o.value} key={index}>
          {o.label}
        </Option>
      ))}
    </AutoComplete>,
  )
  const autoComplete = getByRole('combobox')
  fireEvent.mouseDown(autoComplete)
  fireEvent.change(autoComplete, {
    target: { value: 'test' },
  })

  const list = document.querySelectorAll('.ant-select-item-option')
  expect(list.length).toBe(2)
})
