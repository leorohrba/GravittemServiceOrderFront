import SuspenseGravittem from '@components/gravittemComponents/SuspenseGravittem'
import React from 'react'
import ContentComponent from './ContentComponent'

function SuspenseComponent({ children }) {
  return (
    <SuspenseGravittem>
      <ContentComponent>{children}</ContentComponent>
    </SuspenseGravittem>
  )
}

export default SuspenseComponent
