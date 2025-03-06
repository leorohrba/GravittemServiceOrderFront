import { Spin } from 'antd'
import React, { Fragment, Suspense } from 'react'
import Loading from '@assets/images/softin/gravittinhoLoading.svg'
import { LoadingOutlined } from '@ant-design/icons'
import robotoBold from '@assets/fonts/Roboto-Bold.ttf'

function SuspenseGravittem({ children }) {
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />

  const LoadingComponent = () => {
    return (
      <div className="flex justify-center">
        <Spin size="large" indicator={antIcon}>
          <div className="flex flex-col py-24 ml-3">
            <img src={Loading} alt="gravittinho" />
            <h1 className="ml-24" style={{ fontFamily: robotoBold }}>
              Gravittem
            </h1>
          </div>
        </Spin>
      </div>
    )
  }

  return (
    <Fragment>
      {<Suspense fallback={<LoadingComponent />}>{children}</Suspense>}{' '}
    </Fragment>
  )
}

export default SuspenseGravittem
