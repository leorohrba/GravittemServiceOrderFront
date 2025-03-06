import { Spin } from 'antd'
import React, { Fragment } from 'react'

function SpinHeader({ children, loading }) {
  return (
    <Fragment>
      {loading ? (
        <Spin className="flex justify-center h-screen py-10" size="large" />
      ) : (
        children
      )}
    </Fragment>
  )
}

export default SpinHeader
