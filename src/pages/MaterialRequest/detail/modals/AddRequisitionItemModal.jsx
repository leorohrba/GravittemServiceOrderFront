/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { apiChecklist, apiMaterialRequest } from '@services/api'
import {
  fieldsValidationToast,
  handleAuthError,
  hasPermission,
  removeNumberFormatting,
} from '@utils'
import { Col, message, Modal, Row, Spin } from 'antd'
import { PropTypes } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import AddRequisitionItemModalForm from './AddRequisitionItemModalForm'
import { SimilarItems } from './SimilarItems'

let requestItem
function AddRequisitionItemModal({
  visible,
  requesterId,
  toogleModalVisible,
  handleSaveItem,
  requestNewItem,
  form,
  canUpdateItem,
  setRequestItem,
  originalRequestItems,
  requestItems,
  userPermissions,
  period,
  isRequisicaoOficina,
}) {
  const [itemSource, setItemSource] = useState([])
  const [documentOriginSource, setDocumentOriginSource] = useState([])
  const [stockLocationSource, setStockLocationSource] = useState([])
  const [statusSource, setStatusSource] = useState([])
  const [reasonSource, setReasonSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingItem, setLoadingItem] = useState(false)
  const [loadingStockLocation, setLoadingStockLocation] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingReason, setLoadingReason] = useState(false)
  const [loadingDocument, setLoadingDocument] = useState(false)
  const [materialLikeCount, setMaterialLikeCount] = useState(0)
  const [modalSimilarItem, setModalSimilarItem] = useState(false)
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [canUpdateStatus, setCanUpdateStatus] = useState(true)
  const [warningMessage, setWarningMessage] = useState(null)
  const [priceLists, setPriceLists] = useState([])
  const [loadingPriceListItem, setLoadingPriceListItem] = useState(false)
  const itemRef = React.useRef()

  useEffect(() => {
    getPriceLists()
  }, [])

  function refreshForm() {
    setLoading(true)
    requestItem = requestNewItem
    clearForm()
    getStatus()
    if (requestItem) {
      getFields()
    } else if (itemRef.current) {
      try {
        itemRef.current.focus()
      } catch {}
    }
  }
  useEffect(() => {
    if (!loading && !requestItem && itemRef.current) {
      try {
        itemRef.current.focus()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  useEffect(() => {
    getQuantityReserved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.getFieldValue('itemId'),
    form.getFieldValue('stockLocationId'),
    form.getFieldValue('documentOriginId'),
  ])

  useEffect(() => {
    if (
      !loadingStatus &&
      !loadingReason &&
      !loadingStockLocation &&
      !loadingDocument
    ) {
      setLoading(false)
    }
  }, [loadingStatus, loadingReason, loadingStockLocation, loadingDocument])

  function canUseReserve() {
    let result
    const documentOriginId = !requestItem
      ? null
      : requestItem.originalDocumentOriginId || requestItem.documentOriginId

    if (!requestItem || (requestItem && requestItem.requestNewItemId === 0)) {
      result = true
    } else if (
      documentOriginId &&
      form.getFieldValue('documentOriginId') &&
      documentOriginId !== form.getFieldValue('documentOriginId')
    ) {
      result = true
    } else if (!requestItem.serviceOrderPartId) {
      result = true
    } else {
      result = false
    }
    return result
  }

  async function getQuantityReserved() {
    let canGetQuantityReserved = canUseReserve()

    if (
      !(
        form.getFieldValue('itemId') &&
        form.getFieldValue('stockLocationId') &&
        form.getFieldValue('documentOriginId')
      )
    ) {
      canGetQuantityReserved = false
    }

    if (!canGetQuantityReserved) {
      form.resetFields(['quantityReserved'])
      return
    }
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/itemAvailableDetail`,
        params: {
          itemId: form.getFieldValue('itemId'),
          stockLocationId: form.getFieldValue('stockLocationId'),
          serviceOrderId: form.getFieldValue('documentOriginId'),
          quantityType: 'Reserved',
        },
      })
      const { data } = response
      if (data.isOk) {
        const quantityReserved = data.itemAvailableDetail.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.quantityReserved,
          0,
        )
        form.setFieldsValue({ quantityReserved })
      } else if (!data.isOk) {
        form.resetFields(['quantityReserved'])
        message.error(data.message)
      }
    } catch (error) {
      form.resetFields(['quantityReserved'])
      handleAuthError(error)
    }
  }

  async function getDocumentOrigin(type, id) {
    setLoadingDocument(true)

    const params = {
      documentType: type,
      documentId: id,
      sequenceNumber: null,
    }

    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/documentOrigin`,
        params,
      })

      setLoadingDocument(false)
      const { data } = response
      if (data.isOk && data.documentOrigin.length > 0) {
        const document = {
          documentId: data.documentOrigin[0].documentId,
          sequenceNumber: data.documentOrigin[0].sequenceNumber,
          customerName: data.documentOrigin[0].customerName,
          inProgress: data.documentOrigin[0].inProgress,
          collaboratorId: data.documentOrigin[0].collaboratorId,
          actStatusCode: data.documentOrigin[0].actStatusCode,
          documentType: data.documentOrigin[0].documentType,
          roadMapDate: data.documentOrigin[0].roadMapDate,
          entryDateFactory: data.documentOrigin[0].entryDateFactory,
        }
        setDocumentOriginSource([document])

        form.setFieldsValue({
          documentOriginId: data.documentOrigin[0].documentId,
          titularName: data.documentOrigin[0].customerName,
        })

        if (!data.documentOrigin[0].inProgress) {
          setCanBeUpdated(false)
          setCanUpdateStatus(requestItem.actStatusCode === 'ESTD')
          setWarningMessage(
            formatMessage({
              id:
                'materialRequest.NewMaterialRequisition.documentNotInProgress',
            }),
          )
        }
      } else if (!data.isOk) {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getPriceLists() {
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/PriceList`,
      })
      const { data } = response
      if (data.isOk) {
        setPriceLists(data.priceList)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getPriceListItem(itemId, priceListId) {
    setLoadingPriceListItem(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/PriceListItem`,
        params: { itemId, priceListId },
      })
      setLoadingPriceListItem(false)
      const { data } = response
      if (data.isOk) {
        const unitValue =
          data.priceListItem.length > 0
            ? data.priceListItem[0].unitValue || 0
            : 0
        form.setFieldsValue({ unitValue })
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function getFields() {
    setCanBeUpdated(canUpdateItem && requestItem.canBeUpdated)
    setCanUpdateStatus((canUpdateItem && requestItem.canBeUpdated) || requestItem.actStatusCode === 'ESTD')

    if (requestItem.documentOriginId) {
      getDocumentOrigin(requestItem.documentType, requestItem.documentOriginId)
    }
    setItemSource([
      {
        id: requestItem.itemId,
        code: requestItem.itemCode,
        description: requestItem.itemDescription,
        measuringUnitId: requestItem.measuringUnitId,
        measuringUnitCode: requestItem.measuringUnitCode,
        canDecimal: requestItem.canDecimal,
        materialLikeCount: requestItem.materialLikeCount,
        returnRequired: requestItem.returnRequired,
      },
    ])

    setMaterialLikeCount(requestItem.materialLikeCount)
    getStockLocation(requestItem.itemId, requestItem.stockLocationId)

    form.setFieldsValue({
      itemCode: requestItem.itemCode,
      measuringUnitCode: requestItem.measuringUnitCode,
      quantityRequested: requestItem.quantityRequested,
      quantityApplied: requestItem.quantityApplied,
      itemId: requestItem.itemId,
      priceListId: requestItem.priceListId,
      unitValue: requestItem.unitValue,
    })
  }

  const handleSubmit = (e, addOther) => {
    e && e.preventDefault()
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        saveItem(addOther)
      }
    })
  }

  function saveItem(addOther) {
    const isInsert = !requestItem
    const item = itemSource.find(x => x.id === form.getFieldValue('itemId'))
    if (!item) {
      message.error('Não foi possível buscar item!')
      return
    }

    const stockLocation = stockLocationSource.find(
      x => x.stockLocationId === form.getFieldValue('stockLocationId'),
    )
    if (!stockLocation) {
      message.error('Não foi possível buscar a localização de estoque!')
      return
    }

    const status = statusSource.find(
      x => x.id === form.getFieldValue('actStatusId'),
    )
    if (!status) {
      message.error('Não foi possível buscar o status!')
      return
    }

    const reason = reasonSource.find(
      x => x.id === form.getFieldValue('actReasonId'),
    )
    if (!reason) {
      message.error('Não foi possível buscar o motivo do status!')
      return
    }

    let document = null
    if (form.getFieldValue('documentOriginId')) {
      document = documentOriginSource.find(
        x => x.documentId === form.getFieldValue('documentOriginId'),
      )
    }

    let actStatusOriginal = null
    if (!isInsert) {
      actStatusOriginal = requestItem.actStatusOriginal
        ? requestItem.actStatusOriginal
        : {
            id: requestItem.actStatusId,
            code: requestItem.actStatusCode,
            description: requestItem.actStatusDescription,
          }
    }

    const newRequestItem = {
      requestNewItemId: isInsert ? 0 : requestItem.requestNewItemId,
      requestNewId: isInsert ? 0 : requestItem.requestNewId,
      itemId: item.id,
      itemCode: item.code,
      itemDescription: item.description,
      stockLocationId: stockLocation.stockLocationId,
      stockLocationDescription: stockLocation.stockLocationDescription,
      measuringUnitId: item.measuringUnitId,
      measuringUnitCode: item.measuringUnitCode,
      canDecimal: item.canDecimal,
      returnRequired: item.returnRequired,
      materialLikeCount: item.materialLikeCount,
      quantityRequested: parseFloat(form.getFieldValue('quantityRequested')),
      quantityApplied: parseFloat(form.getFieldValue('quantityApplied')),
      quantityReservedUsed: parseFloat(
        form.getFieldValue('quantityReservedUsed'),
      ),
      actStatusOldId: isInsert ? -1 : requestItem.actStatusOldId,
      actStatusOriginal,
      actStatusId: status.id,
      actStatusCode: status.code,
      actStatusDescription: status.description,
      actReasonId: reason.id,
      actReasonDescription: reason.description,
      actReasonCode: reason.code,
      documentType: document ? 1 : null,
      documentOriginId: document ? document.documentId : null,
      sequenceNumber: document ? document.sequenceNumber : null,
      customerName: document ? document.customerName : null,
      serviceOrderActStatusCode: document ? document.actStatusCode : null,
      documentInProgress: document ? document.inProgress : null,
      roadMapDate: document ? document.roadMapDate : undefined,
      entryDateFactory: document ? document.entryDateFactory : undefined,
      materialStockId: isInsert ? 0 : requestItem.materialStockId,
      stockAddress: stockLocation.stockAddress,
      quantityReturned: isInsert ? null : requestItem.quantityReturned,
      observationReturned: isInsert ? null : requestItem.observationReturned,
      serviceOrderPartId: isInsert ? 0 : requestItem.serviceOrderPartId,
      originalDocumentOriginId: isInsert
        ? null
        : requestItem.originalDocumentOriginId
        ? requestItem.originalDocumentOriginId
        : requestItem.documentOriginId,
      canBeUpdated: isInsert ? true : requestItem.canBeUpdated,
      key: isInsert ? -1 : requestItem.key,
      priceListId: form.getFieldValue('priceListId'),
      unitValue: removeNumberFormatting(form.getFieldValue('unitValue')),
    }
    setLoading(true)
    handleSaveItem(newRequestItem)
    if (addOther) {
      setLoading(false)
      requestItem = null
      getStatus()
      setRequestItem()
      clearForm()
      if (itemRef.current) {
        try {
          itemRef.current.focus()
        } catch {}
      }
    } else {
      toogleModalVisible()
    }
  }

  function clearForm() {
    setItemSource([])
    setWarningMessage(null)
    setCanBeUpdated(canUpdateItem)
    setCanUpdateStatus(canUpdateItem || requestItem.actStatusCode === 'ESTD')
    setDocumentOriginSource([])
    setStockLocationSource([])
    setMaterialLikeCount(0)
    form.resetFields()
  }

  async function getStatus() {
    setLoadingStatus(true)

    let originalStatus = null
    let currentStatus = null

    if (requestItem) {
      currentStatus = {
        id: requestItem.actStatusId,
        code: requestItem.actStatusCode,
        description: requestItem.actStatusDescription,
      }

      originalStatus = requestItem.actStatusOriginal
    } else {
      currentStatus = {
        id: 0,
        code: 'PEND',
        description: 'Pendente',
      }
    }

    let actStatusId =
      !requestItem || requestItem.requestNewItemId === 0
        ? 0
        : originalStatus
        ? originalStatus.id
        : currentStatus.id || 0

    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/BusinessDocument/StatusByClassDefinition`,
        params: { classDefinition: 'RequestNewItem', actStatusId },
      })
      setLoadingStatus(false)
      const { data } = response

      if (data.IsOK) {
        const statuses = data.statusByClassDefinition
        const source = []

        if (
          originalStatus &&
          statuses.findIndex(x => x.Code === originalStatus.code) === -1
        ) {
          source.push(originalStatus)
        }

        if (
          currentStatus &&
          statuses.findIndex(x => x.Code === currentStatus.code) === -1 &&
          source.findIndex(x => x.code === currentStatus.code) === -1
        ) {
          source.push(currentStatus)
        }

        statuses.map(record =>
          source.push({
            id: record.StatusId,
            code: record.Code,
            description: record.Description,
          }),
        )

        setStatusSource(source)

        const index = currentStatus
          ? source.findIndex(x => x.code === currentStatus.code)
          : source.length > 0
          ? 0
          : -1

        if (index >= 0) {
          actStatusId = source[index].id
          form.setFieldsValue({ actStatusId })

          const reason = !requestItem
            ? null
            : {
                id: requestItem.actReasonId,
                description: requestItem.actReasonDescription,
                code: requestItem.actReasonCode,
              }

          refreshReason(actStatusId, reason)
          refreshCheckboxes(actStatusId, source)
        } else {
          form.resetFields(['actStatusId, actReasonId'])
          setReasonSource([])
        }
      } else {
        setLoadingStatus(false)
        message.error(data.Exception)
      }
    } catch (error) {
      setLoadingStatus(false)
      handleAuthError(error)
    }
  }

  function calculateAvailability(
    itemId,
    stockLocationId,
    documentOriginId,
    quantityAvailable,
    actStatusCode,
    quantityRequested,
    quantityApplied,
    quantityReserved,
  ) {
    if (!itemId || !stockLocationId || !actStatusCode) {
      form.resetFields([
        'quantityAvailableCalculate',
        'quantityReservedUsed',
        'quantityReservedUsedTotal',
      ])
      return
    }

    const quantityOriginalRequested = originalRequestItems
      .filter(
        x =>
          x.itemId === itemId &&
          x.stockLocationId === stockLocationId &&
          (x.actStatusCode === 'PEND' || x.actStatusCode === 'SEPA'),
      )
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityRequested,
        0,
      )

    const quantityOriginalApplied = originalRequestItems
      .filter(
        x =>
          x.itemId === itemId &&
          x.stockLocationId === stockLocationId &&
          x.actStatusCode === 'APLI',
      )
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityApplied,
        0,
      )

    const key = requestItem ? requestItem.key : -1

    const quantityCurrentRequested = requestItems
      .filter(
        x =>
          x.itemId === itemId &&
          x.stockLocationId === stockLocationId &&
          (x.actStatusCode === 'PEND' || x.actStatusCode === 'SEPA') &&
          x.key !== key,
      )
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityRequested,
        0,
      )

    const quantityCurrentApplied = requestItems
      .filter(
        x =>
          x.itemId === itemId &&
          x.stockLocationId === stockLocationId &&
          x.actStatusCode === 'APLI' &&
          x.key !== key,
      )
      .reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantityApplied,
        0,
      )

    const quantityReservedUsedTotal =
      requestItems
        .filter(
          x =>
            x.itemId === itemId &&
            x.stockLocationId === stockLocationId &&
            (x.actStatusCode === 'APLI' ||
              x.actStatusCode === 'PEND' ||
              x.actStatusCode === 'SEPA') &&
            x.quantityReservedUsed &&
            x.documentOriginId &&
            x.key !== key,
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.quantityReservedUsed,
          0,
        ) || 0

    const quantityReservedUsedOthersDocuments =
      requestItems
        .filter(
          x =>
            x.itemId === itemId &&
            x.stockLocationId === stockLocationId &&
            (x.actStatusCode === 'APLI' ||
              x.actStatusCode === 'PEND' ||
              x.actStatusCode === 'SEPA') &&
            x.quantityReservedUsed &&
            x.documentOriginId &&
            x.documentOriginId !== documentOriginId &&
            x.key !== key,
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.quantityReservedUsed,
          0,
        ) || 0

    const quantityReservedUsedThisDocument =
      requestItems
        .filter(
          x =>
            x.itemId === itemId &&
            x.stockLocationId === stockLocationId &&
            (x.actStatusCode === 'APLI' ||
              x.actStatusCode === 'PEND' ||
              x.actStatusCode === 'SEPA') &&
            x.quantityReservedUsed &&
            x.documentOriginId &&
            x.documentOriginId === documentOriginId &&
            x.key !== key,
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.quantityReservedUsed,
          0,
        ) || 0

    const newQuantity =
      actStatusCode === 'APLI'
        ? quantityApplied || 0
        : actStatusCode === 'PEND' || actStatusCode === 'SEPA'
        ? quantityRequested || 0
        : 0

    let result =
      quantityAvailable +
      quantityOriginalRequested +
      quantityOriginalApplied -
      quantityCurrentRequested -
      quantityCurrentApplied -
      newQuantity

    let quantityReservedUsed = 0

    if (documentOriginId && canUseReserve()) {
      result += quantityReservedUsedOthersDocuments + quantityReserved

      if (quantityReserved - quantityReservedUsedThisDocument < newQuantity) {
        quantityReservedUsed =
          quantityReserved - quantityReservedUsedThisDocument
      } else {
        quantityReservedUsed = newQuantity
      }
    } else {
      result += quantityReservedUsedTotal
    }

    form.setFieldsValue({
      quantityAvailableCalculate: result,
      quantityReservedUsed,
      quantityReservedUsedTotal:
        quantityReservedUsed + quantityReservedUsedThisDocument,
    })
    form.validateFieldsAndScroll(['quantityAvailableCalculate'])
  }

  const refreshReason = (nextStatusId, reason) => {
    let actStatusId

    if (!requestItem) {
      actStatusId = 0
    } else if (!requestItem.actStatusOriginal) {
      actStatusId =
        requestItem.actStatusId === nextStatusId
          ? requestItem.actStatusOldId === -1
            ? 0
            : requestItem.actStatusOldId
          : requestItem.actStatusId
    } else if (requestItem.actStatusOriginal.id === nextStatusId) {
      actStatusId =
        requestItem.actStatusOldId === -1 ? 0 : requestItem.actStatusOldId
    } else {
      actStatusId = requestItem.actStatusOriginal.id
    }
    getReason(actStatusId, nextStatusId, reason)
  }

  async function getReason(actStatusId, nextStatusId, reason) {
    setLoadingReason(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/API/Stock/Reason`,
        params: { actStatusId, nextStatusId },
      })
      setLoadingReason(false)
      const { data } = response

      if (data.isOk) {
        const { reasons } = data
        const source = []

        if (reason && reasons.findIndex(x => x.reasonId === reason.id) === -1) {
          source.push(reason)
        }

        reasons.map(record =>
          source.push({
            id: record.reasonId,
            description: record.description,
            code: record.code,
          }),
        )

        setReasonSource(source)
        const index = reason
          ? source.findIndex(x => x.id === reason.id)
          : source.length > 0
          ? 0
          : -1
        if (index >= 0) {
          form.setFieldsValue({ actReasonId: source[index].id })
        } else {
          form.resetFields(['actReasonId'])
        }
      } else {
        setLoadingReason(false)
        message.error(data.Exception)
      }
    } catch (error) {
      setLoadingReason(false)
      handleAuthError(error)
    }
  }

  async function getStockLocation(itemId, stockLocationId) {
    setLoadingStockLocation(true)

    const params = {
      itemAvailableParameters: [
        {
          itemId,
          stockLocationId: null,
        },
      ],
    }

    try {
      const response = await apiMaterialRequest({
        method: 'POST',
        url: `/api/stock/searchItemAvailable`,
        data: params,
        headers: { 'Content-Type': 'application/json' },
      })

      setLoadingStockLocation(false)
      const { data } = response
      if (data.isOk) {
        const index = stockLocationId
          ? data.itemAvailable.findIndex(
              x => x.stockLocationId === stockLocationId,
            )
          : data.itemAvailable.length > 0
          ? 0
          : -1
        setStockLocationSource(data.itemAvailable)
        if (index >= 0) {
          form.setFieldsValue({
            stockLocationId: data.itemAvailable[index].stockLocationId,
            stockAddress: data.itemAvailable[index].stockAddress,
            quantityAvailable: data.itemAvailable[index].quantityAvailable,
          })
        } else {
          form.resetFields([
            'stockLocationId',
            'stockAddress',
            'quantityAvailable',
            'quantityAvailableCalculate',
          ])
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    const status = statusSource.find(
      x => x.id === form.getFieldValue('actStatusId'),
    )
    const actStatusCode = status ? status.code : null
    calculateAvailability(
      form.getFieldValue('itemId'),
      form.getFieldValue('stockLocationId'),
      form.getFieldValue('documentOriginId'),
      parseFloat(form.getFieldValue('quantityAvailable')),
      actStatusCode,
      parseFloat(form.getFieldValue('quantityRequested')),
      parseFloat(form.getFieldValue('quantityApplied')),
      parseFloat(form.getFieldValue('quantityReserved') || 0),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.getFieldValue('itemId'),
    form.getFieldValue('stockLocationId'),
    form.getFieldValue('quantityAvailable'),
    form.getFieldValue('actStatusId'),
    form.getFieldValue('quantityRequested'),
    form.getFieldValue('quantityApplied'),
    form.getFieldValue('quantityReserved'),
    statusSource,
    requestItems,
    originalRequestItems,
    requestNewItem,
  ])

  const onChangeItem = value => {
    const item = itemSource.find(x => x.id === value)
    if (item) {
      setMaterialLikeCount(item.materialLikeCount)
      if (item.materialLikeCount > 0) {
        openSimilarItem()
      }
      let priceListId = form.getFieldValue('priceListId')
      if (!priceListId && priceLists.length > 0) {
        priceListId = priceLists[0].priceListId
      }
      form.setFieldsValue({
        itemCode: item.code,
        measuringUnitCode: item.measuringUnitCode,
        priceListId,
      })
      getStockLocation(value)
      getPriceListItem(value, priceListId)
    } else {
      setMaterialLikeCount(0)
      setStockLocationSource([])
      form.resetFields([
        'stockLocationId',
        'itemCode',
        'measuringUnitCode',
        'stockAddress',
        'quantityAvailable',
        'priceListId',
        'unitValue',
      ])
    }
  }

  const onChangeStockLocation = value => {
    const stockLocation = stockLocationSource.find(
      x => x.stockLocationId === value,
    )
    if (stockLocation) {
      form.setFieldsValue({
        stockAddress: stockLocation.stockAddress,
        quantityAvailable: stockLocation.quantityAvailable,
      })
    } else {
      form.resetFields([
        'stockAddress',
        'quantityAvailable',
        'quantityAvailableCalculate',
      ])
    }
  }

  const onChangeDocumentOrigin = value => {
    const documentOrigin = documentOriginSource.find(
      x => x.documentId === value,
    )
    if (documentOrigin) {
      form.setFieldsValue({ titularName: documentOrigin.customerName })
    } else {
      form.resetFields(['titularName'])
    }
  }

  useEffect(() => {
    const status = statusSource.find(
      x => x.id === form.getFieldValue('actStatusId'),
    )
    if (
      status &&
      status.code === 'APLI' &&
      form.getFieldValue('quantityApplied')
    ) {
      form.validateFieldsAndScroll(['quantityApplied'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.getFieldValue('actStatusId'),
    form.getFieldValue('quantityRequested'),
  ])

  const onChangeStatus = value => {
    const status = statusSource.find(x => x.id === value)
    if (status) {
      if (
        status.code === 'SEPA' &&
        !hasPermission(userPermissions, 'SepararItem')
      ) {
        message.error('Proibido acesso para separar itens!')
        return null
      }
      if (
        status.code === 'APLI' &&
        !hasPermission(userPermissions, 'AplicarItem')
      ) {
        message.error('Proibido acesso para aplicar itens!')
        return null
      }
      refreshReason(value)
      refreshCheckboxes(value, statusSource)
      return value
    }

    return null
  }

  const refreshCheckboxes = (id, source) => {
    const status = source.find(x => x.id === id)
    if (status.code === 'SEPA') {
      form.setFieldsValue({ separate: true, applied: false })
    } else if (status.code === 'APLI') {
      form.setFieldsValue({ separate: true, applied: true })
    } else {
      form.setFieldsValue({ applied: false, separate: false })
    }
  }

  const refreshStock = () => {
    getStockLocation(
      form.getFieldValue('itemId'),
      form.getFieldValue('stockLocationId'),
    )
  }

  const openSimilarItem = () => {
    setModalSimilarItem(true)
  }

  const onSelectMaterialLike = (likeId, stockLocationLikeId) => {
    getItem(likeId, stockLocationLikeId)
  }

  async function getItem(itemId, stockLocationId) {
    setLoadingItem(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/searchItem`,
        params: { itemId },
      })
      setLoadingItem(false)
      const { data } = response

      if (data.isOk && data.items.length > 0) {
        const record = data.items[0]
        setItemSource([
          {
            id: record.itemId,
            code: record.code,
            description: record.description,
            measuringUnitId: record.measuringUnitId,
            measuringUnitCode: record.measuringUnitCode,
            canDecimal: record.canDecimal,
            materialLikeCount: record.materialLikeCount,
            returnRequired: record.returnRequired,
          },
        ])
        setMaterialLikeCount(record.materialLikeCount)
        form.setFieldsValue({
          itemId: record.itemId,
          itemCode: record.code,
          measuringUnitCode: record.measuringUnitCode,
        })
        getStockLocation(record.itemId, stockLocationId)
      } else if (data.isOk && data.items.length === 0) {
        setItemSource([])
        setLoadingStockLocation(false)
        setStockLocationSource([])
        form.resetFields([
          'stockLocationId',
          'itemCode',
          'measuringUnitCode',
          'stockAddress',
          'quantityAvailable',
          'itemId',
          'stockLocationId',
        ])
      } else {
        setLoadingItem(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoadingItem(false)
      setLoadingStockLocation(false)
      handleAuthError(error)
    }
  }

  return (
    <React.Fragment>
      <SimilarItems
        itemId={form.getFieldValue('itemId')}
        modalVisible={modalSimilarItem}
        toogleModalVisible={() => setModalSimilarItem(false)}
        onSelectMaterialLike={onSelectMaterialLike}
      />
      <Modal
        id="modal-add-item"
        title={formatMessage({
          id: `materialRequest.NewMaterialRequisition.${
            !requestNewItem
              ? 'addItem'
              : canBeUpdated || canUpdateStatus
              ? 'editItem'
              : 'queryItem'
          }`,
        })}
        visible={visible}
        width="970px"
        centered
        onCancel={toogleModalVisible}
        onOk={e => handleSubmit(e, false)}
        footer={
          <Row type="flex" gutter={12} className="mb-2">
            {(canBeUpdated || canUpdateStatus) && !loading && (
              <React.Fragment>
                <Col
                  xs={{
                    pull: 7,
                  }}
                  sm={{
                    pull: 0,
                  }}
                >
                  <Button
                    size="default"
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                    }}
                    onClick={e => handleSubmit(e, false)}
                    id="button-save-item"
                  >
                    {formatMessage({
                      id: 'materialRequest.NewMaterialRequisition.save',
                    })}
                  </Button>
                </Col>
                <Col
                  xs={{
                    pull: 2,
                  }}
                  sm={{
                    pull: 0,
                  }}
                >
                  <Button
                    size="default"
                    ghost
                    style={{
                      color: '#4CAF50',
                      border: '1px solid #4CAF50',
                    }}
                    onClick={e => handleSubmit(e, true)}
                    id="button-save-item-2"
                  >
                    {formatMessage({
                      id:
                        'materialRequest.NewMaterialRequisition.saveAndAddAnother',
                    })}
                  </Button>
                </Col>
              </React.Fragment>
            )}
            <Col
              xs={{
                pull: 6,
              }}
              sm={{
                pull: 0,
              }}
              style={{ marginLeft: 'auto' }}
            >
              <Button
                size="default"
                type="secondary"
                onClick={toogleModalVisible}
                id="button-cancel-item"
              >
                {formatMessage({
                  id: 'materialRequest.NewMaterialRequisition.cancel',
                })}
              </Button>
            </Col>
          </Row>
        }
      >
        <Spin size="large" spinning={loading}>
        </Spin>
        <div style={{ display: loading ? 'none' : 'block' }}>
          <AddRequisitionItemModalForm
            form={form}
            onChangeItem={onChangeItem}
            itemSource={itemSource}
            setItemSource={setItemSource}
            onChangeDocumentOrigin={onChangeDocumentOrigin}
            documentOriginSource={documentOriginSource}
            setDocumentOriginSource={setDocumentOriginSource}
            canBeUpdated={canBeUpdated}
            canUpdateStatus={canUpdateStatus}
            loadingItem={loadingItem}
            stockLocationSource={stockLocationSource}
            loadingStockLocation={loadingStockLocation}
            loadingReason={loadingReason}
            onChangeStockLocation={onChangeStockLocation}
            statusSource={statusSource}
            reasonSource={reasonSource}
            onChangeStatus={onChangeStatus}
            visible={visible}
            refreshForm={refreshForm}
            refreshReason={refreshReason}
            refreshStock={refreshStock}
            loading={loading}
            ref={itemRef}
            openSimilarItem={openSimilarItem}
            materialLikeCount={materialLikeCount}
            warningMessage={warningMessage}
            requestNewItem={requestNewItem}
            requesterId={requesterId}
            userPermissions={userPermissions}
            getPriceListItem={getPriceListItem}
            priceLists={priceLists}
            loadingPriceListItem={loadingPriceListItem}
            period={period}
            isRequisicaoOficina={isRequisicaoOficina}
            requestItem={requestItem}
          />
        </div>
      </Modal>
    </React.Fragment>
  )
}

AddRequisitionItemModal.propTypes = {
  form: PropTypes.any,
  handleSaveItem: PropTypes.func,
  visible: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  requestNewItem: PropTypes.object,
  canUpdateItem: PropTypes.bool,
  setRequestItem: PropTypes.func,
  requestItems: PropTypes.array,
  originalRequestItems: PropTypes.array,
  requesterId: PropTypes.number,
  userPermissions: PropTypes.array,
  period: PropTypes.any,
  isRequisicaoOficina: PropTypes.any,
}

const WrappedAddRequisitionItemModal = Form.create({
  name: 'itemForm',
})(AddRequisitionItemModal)

export default WrappedAddRequisitionItemModal
