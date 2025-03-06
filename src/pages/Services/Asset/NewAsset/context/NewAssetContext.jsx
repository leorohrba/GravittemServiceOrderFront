import { Form } from 'antd'
import constate from 'constate'
import { useState } from 'react'

function useNewAsset() {
  const [form] = Form.useForm()

  const [tags, setTags] = useState([])

  return {
    form,
    tags,
    setTags,
  }
}

const [NewAssetProvider, useNewAssetContext] = constate(useNewAsset)

export { NewAssetProvider, useNewAssetContext }
