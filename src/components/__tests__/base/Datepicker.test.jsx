import { cleanup, fireEvent, render } from '@testing-library/react'
import { DatePicker } from 'antd'
import moment from 'moment'
import React from 'react'

afterEach(cleanup)

it('renders datepicker insert', async () => {
  const { getByTestId } = render(
    <DatePicker data-testid="datepicker-test-id" />,
  )
  const newDate = moment()
  const datePicker = getByTestId('datepicker-test-id')
  fireEvent.focus(datePicker)
  fireEvent.change(datePicker, { target: { value: newDate } })
  const inputValue = moment(datePicker.value).format('DD/MM/YYYY')
  expect(inputValue).toBe(newDate.format('DD/MM/YYYY'))
})
