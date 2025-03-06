/**
 * breadcrumb: Ativos
 * type: Menu
 */
import { Spin } from 'antd'
import React from 'react'
import { withWrapper } from 'with-wrapper'
import AssetsHeader from './components/AssetsHeader'
import AssetsTable from './components/AssetsTable'
import { AssetProvider, useAssetContext } from './context/AssetContext'

function Assets() {
  const { loading } = useAssetContext()

  return (
    <div className="container">
      <Spin spinning={loading} size="large">
        <AssetsHeader />
        <AssetsTable />
      </Spin>
    </div>
  )
}

export const WrapperAssets = withWrapper((element, props) => (
  <AssetProvider>{element}</AssetProvider>
))(props => {
  return <Assets />
})

export default WrapperAssets
