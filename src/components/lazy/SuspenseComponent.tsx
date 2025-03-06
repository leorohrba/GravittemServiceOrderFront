import { Spin } from 'antd'
import React, { Suspense } from 'react'
function SuspenseComponent({ children }) {
  return (
    <Suspense
      fallback={
        <Spin
          className="flex justify-center h-screen items-center"
          size="large"
        />
      }
    >
      {children}
    </Suspense>
  )
}

export default SuspenseComponent
