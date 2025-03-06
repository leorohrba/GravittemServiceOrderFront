/**
 * breadcrumb: Novo ativo
 */
import React from 'react'
import { router } from 'umi'
import { withWrapper } from 'with-wrapper'
import NewAssetFooter from './components/NewAssetFooter'
import NewAssetForm from './components/NewAssetForm'
import NewAssetHeader from './components/NewAssetHeader'
import { NewAssetProvider, useNewAssetContext } from './context/NewAssetContext'

function NewAsset() {
  const { form, tags, setTags } = useNewAssetContext()
  return (
    <div className="container">
      <div className="mb-4">
        <a onClick={() => router.goBack()}>Ativo</a>
        <span>{' > Novo ativo'}</span>
      </div>
      <NewAssetHeader />
      <NewAssetForm {...{ form, tags, setTags }} />
      <NewAssetFooter />
    </div>
  )
}

const WrapperAssetWithProvider = withWrapper((element, props) => (
  <div className="container">{element}</div>
))(props => {
  return (
    <NewAssetProvider>
      <NewAsset />
    </NewAssetProvider>
  )
})

export default WrapperAssetWithProvider
