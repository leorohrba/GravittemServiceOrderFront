/* eslint-disable consistent-return */
import React, { useRef } from 'react'
import { Form, DatePicker } from 'antd'
import { formatDateInput } from '@utils/components'
import moment from 'moment'

const NewDateAutoComplete = props => {
  const {
    form,
    label,
    fieldName,
    dateParam = moment(),
    desablePreviosDate,
    initialValue,
    disabled = false,
    onChange
  } = props

  const dateRef = useRef(null)

  const handleChangeDate = current => {
    const showDate = desablePreviosDate
      ? current < moment(dateParam, 'YYYY-MM-DD')
      : current > moment(dateParam, 'YYYY-MM-DD')

    if (desablePreviosDate !== undefined && showDate) {
      return showDate
    }
  }

  const handleOnChange = value => {
    if (onChange) {
      onchange()
    }
  }

  return (
    <React.Fragment>
      <Form.Item
        label={label}
        name={fieldName}
        onChange={e =>
          formatDateInput(e.target.value, form, fieldName, dateRef)
        }
        initialValue={initialValue}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          ref={dateRef}
          disabledDate={current => handleChangeDate(current)}
          disabled={disabled}
          onChange={handleOnChange}
        />
      </Form.Item>
    </React.Fragment>
  )
}
export default NewDateAutoComplete
