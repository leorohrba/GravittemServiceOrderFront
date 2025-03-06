import { useState } from 'react'

function useConfigurationModal() {
  const [visibleConfigurationModal, setVisibleConfigurationModal] =
    useState(false)

  return { visibleConfigurationModal, setVisibleConfigurationModal }
}

export default useConfigurationModal
