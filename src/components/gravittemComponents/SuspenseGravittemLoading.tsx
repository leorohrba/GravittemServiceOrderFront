import SpinCointaner from '@components/generics/SpinContainer'
import React from 'react'
import SuspenseGravittem from './SuspenseGravittem'

function SuspenseGravittemLoading({ loading, children }) {
  return (
    <SuspenseGravittem>
      <SpinCointaner {...{ loading }}>{children}</SpinCointaner>
    </SuspenseGravittem>
  )
}

export default SuspenseGravittemLoading
