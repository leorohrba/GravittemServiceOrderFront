import { Spin } from 'antd'
import React, { Fragment } from 'react'
import Loading from '@assets/images/softin/gravittinhoLoading.svg'
import { LoadingOutlined } from '@ant-design/icons'
import robotoBold from '@assets/fonts/Roboto-Bold.ttf'

function SpinGravittem({ children, loading }) {
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />

  return (
    <Fragment>
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" indicator={antIcon}>
            <div className="flex flex-col py-24 ml-3">
              <img src={Loading} />
              <h1 className="ml-24" style={{ fontFamily: robotoBold }}>
                Gravittem
              </h1>
            </div>
          </Spin>
        </div>
      ) : (
        children
      )}
    </Fragment>
  )
}

export default SpinGravittem
