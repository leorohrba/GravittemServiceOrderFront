import { Spin } from 'antd'
import React from 'react'

function SpinCointaner({ loading, children }) {
  return (
    <Spin
      className="container flex h-screen justify-center"
      size="large"
      spinning={loading}
    >
      {children}
    </Spin>
  )
}

export default SpinCointaner
