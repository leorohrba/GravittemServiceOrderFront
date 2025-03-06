import React from 'react'
import SpinCointaner from './SpinContainer'

function ContentLoading({ loading, children }) {
  return (
    <div className="container">
      <SpinCointaner {...{ loading }}>{children}</SpinCointaner>
    </div>
  )
}

export default ContentLoading
