import React from 'react'
import NumberFormat from 'react-number-format'

function SimpleNumberInput(props) {
  const { disabled, defaultValue } = props
  return (
    <NumberFormat
      className="ant-input"
      maxLength={15}
      allowLeadingZeros
      allowNegative={false}
      disabled={disabled}
      defaultValue={defaultValue}
    />
  )
}

export default SimpleNumberInput
