import { cleanup, fireEvent, render } from '@testing-library/react'
import { DatePicker } from 'antd'
import moment from 'moment'
import React from 'react'

const { RangePicker } = DatePicker

afterEach(cleanup)

it('renders rangepicker insert', async () => {
  const { getByTestId } = render(
    <RangePicker data-testid="rangepicker-test-id" />,
  )
  const newDate = [moment(), moment()]
  const rangePicker = getByTestId('rangepicker-test-id')
  const rangePickerStart = rangePicker.querySelectorAll('input')[0]
  const rangePickerEnd = rangePicker.querySelectorAll('input')[1]
  fireEvent.focus(rangePickerStart)
  fireEvent.change(rangePickerStart, { target: { value: newDate[0] } })
  fireEvent.focus(rangePickerEnd)
  fireEvent.change(rangePickerEnd, { target: { value: newDate[1] } })
  const inputValue = [
    moment(rangePickerStart.value).format('DD/MM/YYYY'),
    moment(rangePickerEnd.value).format('DD/MM/YYYY'),
  ]
  expect(inputValue).toStrictEqual([
    newDate[0].format('DD/MM/YYYY'),
    newDate[1].format('DD/MM/YYYY'),
  ])
})
