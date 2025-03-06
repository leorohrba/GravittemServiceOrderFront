import { Spin } from 'antd'
import React, { Fragment } from 'react'

function SpinLoading({ children, loading }) {
  return (
    <Fragment>
      {loading ? (
        <Spin className="container flex h-screen justify-center" size="large" />
      ) : (
        children
      )}
    </Fragment>
  )
}

export default SpinLoading
