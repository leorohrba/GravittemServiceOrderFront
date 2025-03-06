import { Button } from 'antd'
import React from 'react'

function StyledButton(props) {
  const { name, icon, onClickFunction, selected } = props

  return (
    <Button
      style={{
        color: '#1890ff',
        border: `1px solid #1890ff`,
        width: '100%',
      }}
      onClick={() => onClickFunction()}
    >
      <i className={icon} />
      {`${name} ${selected}`}
    </Button>
  )
}

export default StyledButton
