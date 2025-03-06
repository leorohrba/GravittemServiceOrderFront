import constate from 'constate'
import React, { useState } from 'react'

function useNewAsset() {
  const [editData, setEditData] = useState(null)
  const [alertMessages, setAlertMessages] = useState([])
  const [assetId, setAssetId] = useState(null)
  const [userPermissions, setUserPermissions] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [emptyReasonSource, setEmptyReasonSource] = useState([])
  const [customerSource, setCustomerSource] = useState([])
  const [productSource, setProductSource] = useState([])
  const [tags, setTags] = useState([])
  const refCustomer = React.useRef()
  const ref = React.useRef()

  const [visibleAssetAddressModal, setVisibleAssetAddressModal] = useState(
    false,
  )
  const [visibleServiceOrderModal, setVisibleServiceOrderModal] = useState(
    false,
  )
  const [visibleLinkAssetModal, setVisibleLinkAssetModal] = useState(false)
  const [
    visibleAdditionalWarrantyModal,
    setVisibleAdditionalWarrantyModal,
  ] = useState(false)

  const [visiblePostageModal, setVisiblePostageModal] = useState(false)

  const [
    visibleComplementaryDataModal,
    setVisibleComplementaryDataModal,
  ] = useState(false)

  const [visibleResellerModal, setVisibleResellerModal] = useState(false)

  const [visibleInstallerModal, setVisibleInstallerModal] = useState(false)

  return {
    editData,
    setEditData,
    alertMessages,
    setAlertMessages,
    assetId,
    setAssetId,
    userPermissions,
    setUserPermissions,
    canBeUpdated,
    setCanBeUpdated,
    isSaving,
    setIsSaving,
    loading,
    setLoading,
    emptyReasonSource,
    setEmptyReasonSource,
    customerSource,
    setCustomerSource,
    productSource,
    setProductSource,
    tags,
    setTags,
    ref,
    refCustomer,
    visibleAssetAddressModal,
    setVisibleAssetAddressModal,
    visibleServiceOrderModal,
    setVisibleServiceOrderModal,
    visibleLinkAssetModal,
    setVisibleLinkAssetModal,
    visibleAdditionalWarrantyModal,
    setVisibleAdditionalWarrantyModal,
    visiblePostageModal,
    setVisiblePostageModal,
    visibleResellerModal,
    setVisibleResellerModal,
    visibleInstallerModal,
    setVisibleInstallerModal,
    visibleComplementaryDataModal,
    setVisibleComplementaryDataModal,
  }
}

const [NewAssetProvider, useNewAssetContext] = constate(useNewAsset)

export { NewAssetProvider, useNewAssetContext }
