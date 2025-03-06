/* eslint-disable no-console */
import { Form } from '@ant-design/compatible'
import { apiChecklist, apiMaterialRequest } from '@services/api'
import {
  fieldsValidationToast,
  handleAuthError,
  hasPermission,
  removeNumberFormatting,
} from '@utils'
import { Alert, Button, message, Modal, Row, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { SimilarItems } from '../../pages/MaterialRequest/detail/modals/SimilarItems'
import NewItemStage1 from '../../pages/ServiceOrder/ServiceOrderParts/components/NewItemStage1'
import NewItemStage2 from '../../pages/ServiceOrder/ServiceOrderParts/components/NewItemStage2'

function NewItem({
  form,
  newItemModal,
  setNewItemModal,
  serviceOrderPartId,
  serviceOrder,
  onChangeServiceOrderPart,
  userPermissions,
  software,
  screen,
  createOSStatusId,
}) {
  const [stage, setStage] = useState(1)
  const [canUpdateItem, setCanUpdateItem] = useState(true)
  const [alertMessages, setAlertMessages] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedOption, setSelectedOption] = useState(1)
  const [itemsCount, setItemsCount] = useState(0)
  const [data, setData] = useState([])
  const [kit, setKit] = useState([])
  const [catalog, setCatalog] = useState([])
  const [keyTable, setKeyTable] = useState(0)
  const [statusSource, setStatusSource] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [stockLocationSource, setStockLocationSource] = useState([])
  const [loadingStockLocation, setLoadingStockLocation] = useState(true)
  const [serviceSource, setServiceSource] = useState([])
  const [loadingService, setLoadingService] = useState(true)
  const [productSource, setProductSource] = useState([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [pieceDefectSource, setPieceDefectSource] = useState([])
  const [loadingPieceDefect, setLoadingPieceDefect] = useState(true)
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [itemSource, setItemSource] = useState([])
  const [loadingItem, setLoadingItem] = useState(true)
  const [modalSimilarItem, setModalSimilarItem] = useState(false)
  const [priceListSource, setPriceListSource] = useState([])
  const [loadingPriceList, setLoadingPriceList] = useState(true)
  const [loadingPriceListItem, setLoadingPriceListItem] = useState(false)
  const [purchaseOrderSource, setPurchaseOrderSource] = useState([])
  const [currentItem, setCurrentItem] = useState(null)
  const [kitQuantity, setKitQuantity] = useState(1)
  const [newStatus, setNewStatus] = useState(false)
  const query = new URLSearchParams(window.location.search)
  const receiptBy = query.get('receiptBy')
  const ref = React.useRef()
  const [defaultStatus, setDefaultStatus] = useState({})
  useEffect(() => {
    if (newItemModal) {
      setCanBeUpdated(
        ((serviceOrderPartId && hasPermission(userPermissions, 'Alter')) ||
          (!serviceOrderPartId && hasPermission(userPermissions, 'Include'))) &&
          serviceOrder.inProgress,
      )
      setCanUpdateItem(
        ((serviceOrderPartId && hasPermission(userPermissions, 'Alter')) ||
          (!serviceOrderPartId && hasPermission(userPermissions, 'Include'))) &&
          serviceOrder.inProgress,
      )
      getPriceList()
      if (!serviceOrderPartId && screen !== 'CreateOS') {
        getStatus()
        getService()
        getProduct()
        getPieceDefect()
        getDefaultStatus()
        setLoadingItem(false)
        setLoadingStockLocation(false)
      } else {
        getServiceOrderPart()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newItemModal])

  useEffect(() => {
    form.resetFields(['priceListId'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceListSource])

  useEffect(() => {
    if (
      software?.sigla === 'ESSF' &&
      statusSource.find(x => x.code === 'PDIA')
    ) {
      setStatusSource(statusSource.filter(x => x.code !== 'PDIA'))
    } else if (
      software?.sigla === 'ESWD' &&
      statusSource.find(x => x.code === 'SUGE')
    ) {
      setStatusSource(statusSource.filter(x => x.code !== 'SUGE'))
    }
  }, [software, statusSource])

  useEffect(() => {
    if (
      !loadingStatus &&
      !loadingPieceDefect &&
      !loadingProduct &&
      !loadingService &&
      !loadingPriceList &&
      !loadingItem &&
      !loadingStockLocation
    ) {
      setLoading(false)
    }
  }, [
    loadingStatus,
    loadingPieceDefect,
    loadingProduct,
    loadingService,
    loadingPriceList,
    loadingItem,
    loadingStockLocation,
  ])

  useEffect(() => {
    screen === 'CreateOS' && getStatus()
  }, [screen])

  async function getServiceOrderPart() {
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/services/serviceOrderPart`,
        params: { serviceOrderPartId },
      })
      const { data } = response
      if (screen !== 'CreateOS') {
        if (data.isOk && data.serviceOrderParts.length > 0) {
          const record = data.serviceOrderParts[0]

          if (record.finalCustomerProductId === 0) {
            record.finalCustomerProductId = null
          }

          if (record.receiptBy === '0') {
            record.receiptBy = null
          }

          if (record.finalCustomerProductId === 0) {
            record.finalCustomerProductId = null
          }

          if (record.serviceId === 0) {
            record.serviceId = null
          }

          if (record.pieceDefectId === 0) {
            record.pieceDefectId = null
          }

          if (record.stockLocationId === 0) {
            record.stockLocationId = null
          }

          const currentStatus = {
            id: record.actStatusId,
            code: record.actStatusCode,
            description: record.actStatusDescription,
          }
          getStatus(currentStatus)
          getDefaultStatus()

          const currentService = {
            serviceId: record.serviceId,
            serviceName: record.serviceName,
          }
          getService(currentService)

          const currentProduct = {
            finalCustomerProductId: record.finalCustomerProductId,
            productName: record.productName,
          }
          getProduct(currentProduct)

          const currentPieceDefect = {
            pieceDefectId: record.pieceDefectId,
            description: record.pieceDefectDescription,
          }

          getPieceDefect(currentPieceDefect)

          if (record.purchaseOrderId) {
            setPurchaseOrderSource([
              {
                purchaseOrderId: record.purchaseOrderId,
                sequenceNumber: record.purchaseOrderSequenceNumber,
                supplierName: record.supplierName,
              },
            ])
          }

          if (record.partId > 0) {
            getItem(
              record.partId,
              record.stockLocationId,
              record.stockLocationDescription,
              record.usedMeasuringUnitId
                ? {
                    id: record.usedMeasuringUnitId,
                    code: record.usedMeasuringUnitCode,
                  }
                : null,
              record.unitValue,
            )
          } else {
            setItemSource([
              {
                id: record.partId,
                code: record.partCode,
                description: record.partDescription,
                measuringUnitId: record.usedMeasuringUnitId,
                measuringUnitCode: record.usedMeasuringUnitCode,
                canDecimal: false,
                materialLikeCount: 0,
                returnRequired: record.isDevolutionMandatory,
                unitValue: record.unitValue,
              },
            ])
            setStockLocationSource([
              {
                stockLocationId: record.stockLocationId,
                stockLocationDescription: record.stockLocationDescription,
                quantityAvailable: null,
                measuringUnitCode: null,
              },
            ])
            setLoadingItem(false)
            setLoadingStockLocation(false)
          }
          setCanBeUpdated(
            hasPermission(userPermissions, 'Alter') &&
              serviceOrder.inProgress &&
              record.actStatusCode !== 'CANC',
          )
          setCanUpdateItem(
            hasPermission(userPermissions, 'Alter') &&
              serviceOrder.inProgress &&
              ((serviceOrderPartId && record.partId === 0) ||
                !(
                  record.actStatusCode === 'CANC' ||
                  record.actStatusCode === 'AGUA' ||
                  record.actStatusCode === 'FALT' ||
                  record.actStatusCode === 'REQU' ||
                  record.actStatusCode === 'RESE' ||
                  record.actStatusCode === 'UTLZ'
                )),
          )
          setItemsCount(1)
          setCurrentItem(record)
          setSelectedRows([record])
          setStage(2)
        } else if (data.isOk && data.serviceOrderParts.length === 0) {
          message.error('Registro não encontrado!')
          setNewItemModal(false)
        } else {
          message.error(data.message)
          setNewItemModal(false)
        }
      } else {
        setLoading(false)
      }
    } catch (error) {
      setNewItemModal(false)
      handleAuthError(error)
    }
  }

  async function getStatus(currentStatus) {
    setLoadingStatus(true)
    const actStatusId = currentStatus ? currentStatus.id : 0
    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/BusinessDocument/StatusByClassDefinition`,
        params: {
          classDefinition:
            screen === 'CreateOS'
              ? 'ServiceOrderPartSTD'
              : serviceOrder.classDefinitionServiceOrderPart,
          actStatusId: screen === 'CreateOS' ? 0 : actStatusId,
        },
      })

      const { data } = response

      if (data.IsOK) {
        const statuses = data.statusByClassDefinition
        setLoadingStatus(false)
        const source = []

        if (
          currentStatus &&
          !statuses.find(x => x.StatusId === currentStatus?.id)
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
      } else {
        setLoadingStatus(false)
        message.error(data.Exception)
      }
    } catch (error) {
      setLoadingStatus(false)
      handleAuthError(error)
    }
  }

  async function getDefaultStatus() {
    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/BusinessDocument/StatusByClassDefinition`,
        params: {
          classDefinition: serviceOrder.classDefinitionServiceOrderPart,
          actStatusId: 0,
        },
      })

      const { data } = response

      if (data.IsOK) {
        setDefaultStatus(data?.statusByClassDefinition)
      }
    } catch (error) {
      message.error(error)
    }
  }

  async function getStockLocation(
    itemId,
    stockLocationId,
    stockLocationDescription,
  ) {
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
        const source = data.itemAvailable
        if (
          stockLocationId &&
          stockLocationDescription !== undefined &&
          !source.find(x => x.stockLocationId === stockLocationId)
        ) {
          source.splice(0, 0, {
            stockLocationId,
            stockLocationDescription,
            quantityAvailable: 0,
          })
        }
        const index = stockLocationId
          ? source.findIndex(x => x.stockLocationId === stockLocationId)
          : source.length > 0
          ? 0
          : -1

        setStockLocationSource(source)
        if (index >= 0) {
          form.setFieldsValue({
            stockLocationId: source[index].stockLocationId,
            stockAddress: source[index].stockAddress,
            quantityAvailable: source[index].quantityAvailable,
            receiptBy: receiptBy,
          })
        } else {
          form.setFieldsValue({
            stockLocationId: null,
            stockAddress: null,
            quantityAvailable: null,
            receiptBy: receiptBy,
          })
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingStockLocation(false)
      handleAuthError(error)
    }
  }

  async function getPriceList() {
    setLoadingPriceList(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/PriceList`,
      })
      setLoadingPriceList(false)
      const { data } = response
      if (data.isOk) {
        setPriceListSource(data.priceList)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingPriceList(false)
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
        let unitValue = 0
        if (data.priceListItem.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          unitValue = data.priceListItem[0].unitValue
        }
        form.setFieldsValue({ unitValue })
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingPriceListItem(false)
      setLoadingPriceList(false)
      handleAuthError(error)
    }
  }

  async function getService(currentService) {
    setLoadingService(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/services/ServiceOrderService`,
        params: { serviceOrderId: serviceOrder.serviceOrderId },
      })
      setLoadingService(false)
      const { data } = response
      if (data.isOk) {
        const source = data.serviceOrderService
        if (
          currentService &&
          currentService.serviceId &&
          !data.serviceOrderService.find(
            x => x.serviceId === currentService.serviceId,
          )
        ) {
          source.splice(0, 0, currentService)
        }
        setServiceSource(source)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingService(false)
      handleAuthError(error)
    }
  }

  async function getProduct(currentProduct) {
    setLoadingProduct(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/services/ServiceOrderProduct`,
        params: { serviceOrderId: serviceOrder.serviceOrderId },
      })
      setLoadingProduct(false)
      const { data } = response
      if (data.isOk) {
        const source = data.serviceOrderProduct
        if (
          currentProduct &&
          currentProduct.finalCustomerProductId &&
          !data.serviceOrderProduct.find(
            x =>
              x.finalCustomerProductId ===
              currentProduct.finalCustomerProductId,
          )
        ) {
          source.splice(0, 0, currentProduct)
        }
        setProductSource(source)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingProduct(false)
      handleAuthError(error)
    }
  }

  async function getPieceDefect(currentPieceDefect) {
    setLoadingPieceDefect(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/PieceDefect`,
      })
      setLoadingPieceDefect(false)
      const { data } = response
      if (data.isOk) {
        const source = data.pieceDefect
        if (
          currentPieceDefect &&
          currentPieceDefect.pieceDefectId &&
          !data.pieceDefect.find(
            x => x.pieceDefectId === currentPieceDefect.pieceDefectId,
          )
        ) {
          source.splice(0, 0, currentPieceDefect)
        }
        setPieceDefectSource(source)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingPieceDefect(false)
      handleAuthError(error)
    }
  }

  useEffect(() => {
    setKeyTable(keyTable + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const onChangeOption = value => {
    setSelectedOption(value)
    setData([])
    setSelectedRows([])
    if (value === 2) {
      getKit(null, true, false)
    } else if (value === 3) {
      getCatalog(null, true, false)
    }
  }

  async function getKit(id, fillSource, fillTable) {
    setLoading(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/partKit`,
        params: { partKitId: id, getPartKitParts: fillTable },
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        if (fillSource) {
          setKit(data.partKit)
        }
        if (fillTable) {
          setData(data.partKit.length > 0 ? data.partKit[0].partKitParts : [])
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getCatalog(id, fillSource, fillTable) {
    setLoading(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/productCatalog`,
        params: { productCatalogId: id, getProductCatalogItems: fillTable },
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        if (fillSource) {
          setCatalog(data.productCatalog)
        }
        if (fillTable) {
          setData(
            data.productCatalog.length > 0
              ? data.productCatalog[0].productCatalogItems
              : [],
          )
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getItemFromSearch(codeDescription) {
    setLoading(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/searchItem`,
        params: { code: codeDescription, description: codeDescription },
      })
      const { data } = response

      if (data.isOk) {
        const source = []
        if (data.items.length === 0) {
          message.error(
            formatMessage({
              id: 'serviceOrder.serviceOrderParts.itemNotFound',
            }),
          )
        }
        data.items.map(d =>
          source.push({
            partId: d.itemId,
            partCode: d.code,
            partDescription: d.description,
            measuringUnitId: d.measuringUnitId,
            measuringUnitCode: d.measuringUnitCode,
            returnRequired: d.returnRequired,
            canDecimal: d.canDecimal,
            priceListId: d.priceListId,
            priceListDescription: d.priceListDescription,
            priceListItemId: d.priceListItemId,
            unitValue: d.unitValue,
            materialLikeCount: d.materialLikeCount,
            quantityAvailable: d.quantityAvailable,
            quantity: 1,
          }),
        )
        setData(source)
        setLoading(false)
      } else {
        setLoading(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const onChangeKit = value => {
    getKit(value, false, true)
  }

  const onChangeCatalog = value => {
    getCatalog(value, false, true)
  }

  function search() {
    form.validateFieldsAndScroll(
      [
        'searchItemsField',
        'partsQuantity',
        'searchKitField',
        'searchCatalogField',
      ],
      (err, values) => {
        if (err) {
          fieldsValidationToast(err)
        } else if (selectedOption === 1) {
          getItemFromSearch(form.getFieldValue('searchItemsField'))
        } else if (selectedOption === 2) {
          getKit(form.getFieldValue('searchKitField'), false, true)
        } else if (selectedOption === 3) {
          getCatalog(form.getFieldValue('searchCatalogField'), false, true)
        }
      },
    )
  }

  function handleSave() {
    setAlertMessages([])
    form.validateFieldsAndScroll(
      [
        'itemId',
        'stockLocationId',
        'quantity',
        'unitValue',
        'discountValue',
        'requestNewItemId',
        'actStatusId',
        'finalCustomerProductId',
        'serviceId',
        'fctao',
        'pieceDefectId',
        'receiptBy',
        'isFromOthers',
        'returnRequired',
        'measuringUnitId',
        'purchaseOrderId',
        'totalValue',
      ],
      { force: true },
      (err, values) => {
        if (err) {
          fieldsValidationToast(err)
        } else {
          saveServiceOrderPart()
        }
      },
    )
  }

  async function saveServiceOrderPart() {
    setIsSaving(true)
    setLoading(true)
    const serviceOrderPartBody = {
      serviceOrderPart: [
        {
          serviceOrderPartId,
          serviceOrderId: serviceOrder.serviceOrderId,
          partId: form.getFieldValue('itemId'),
          partCode: form.getFieldValue('itemCode'),
          partDescription: form.getFieldValue('itemDescription'),
          stockLocationId: form.getFieldValue('stockLocationId'),
          quantity: form.getFieldValue('quantity'),
          unitValue:
            removeNumberFormatting(form.getFieldValue('unitValue')) || 0,
          priceListId: form.getFieldValue('priceListId'),
          discountValue:
            removeNumberFormatting(form.getFieldValue('discountValue')) || 0,
          requestNewItemId: form.getFieldValue('requestNewItemId'),
          actStatusId:
            screen === 'CreateOS'
              ? createOSStatusId
              : form.getFieldValue('actStatusId'),
          finalCustomerProductId: form.getFieldValue('finalCustomerProductId'),
          serviceId: form.getFieldValue('serviceId'),
          fctao: form.getFieldValue('fctao'),
          pieceDefectId: form.getFieldValue('pieceDefectId'),
          receiptBy: form.getFieldValue('receiptBy'),
          isFromOthers: form.getFieldValue('isFromOthers'),
          isDevolutionMandatory: form.getFieldValue('returnRequired'),
          usedMeasuringUnitId: form.getFieldValue('measuringUnitId'),
          purchaseOrderId: form.getFieldValue('purchaseOrderId'),
        },
      ],
    }
    try {
      const response = await apiMaterialRequest({
        method: 'POST',
        url: `/api/services/serviceOrderPart`,
        data: serviceOrderPartBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.status === 400) {
        message.error('Ocorreu um erro de dados ao salvar o item!')
      }

      if (data.isOk) {
        handleSaveOk()
      } else {
        setAlertMessages(data.validationMessageList)
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      handleAuthError(error)
    }
  }

  function handleSaveOk() {
    onChangeServiceOrderPart()
    if (itemsCount < selectedRows.length) {
      nextStage(itemsCount + 1, selectedRows)
    } else {
      setNewItemModal(false)
      setStage(1)
      setData([])
    }
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
  }

  const onChangeItem = value => {
    const item = itemSource.find(x => x.id === value)
    if (item) {
      form.setFieldsValue({
        itemCode: item.code,
        measuringUnitCode: item.measuringUnitCode,
        measuringUnitId: item.measuringUnitId,
        materialLikeCount: item.materialLikeCount,
        returnRequired: item.returnRequired,
        unitValue: item.unitValue,
        itemDescription: item.description,
      })
      if (item.materialLikeCount > 0) {
        openSimilarItem()
      }
      getStockLocation(value)
      getPriceListItem(value, form.getFieldValue('priceListId'))
    } else {
      setStockLocationSource([])
      form.setFieldsValue({
        stockLocationId: null,
        itemCode: null,
        measuringUnitCode: null,
        measuringUnitId: null,
        stockAddress: null,
        quantityAvailable: null,
        unitValue: null,
        returnRequired: null,
        materialLikeCount: null,
      })
    }
  }

  const openSimilarItem = () => {
    setModalSimilarItem(true)
  }

  const onSelectMaterialLike = (likeId, stockLocationLikeId) => {
    getItem(likeId, stockLocationLikeId)
  }

  async function getItem(
    itemId,
    stockLocationId,
    stockLocationDescription,
    usedMeasuringUnit,
    unitValue,
  ) {
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
            measuringUnitId: usedMeasuringUnit
              ? usedMeasuringUnit.id
              : record.measuringUnitId,
            measuringUnitCode: usedMeasuringUnit
              ? usedMeasuringUnit.code
              : record.measuringUnitCode,
            canDecimal: record.canDecimal,
            materialLikeCount: record.materialLikeCount,
            returnRequired: record.returnRequired,
            unitValue: unitValue !== undefined ? unitValue : record.unitValue,
          },
        ])

        form.setFieldsValue({
          itemId: record.itemId,
          itemCode: record.code,
          measuringUnitId: usedMeasuringUnit
            ? usedMeasuringUnit.id
            : record.measuringUnitId,
          measuringUnitCode: usedMeasuringUnit
            ? usedMeasuringUnit.code
            : record.measuringUnitCode,
          materialLikeCount: record.materialLikeCount,
          returnRequired: record.returnRequired,
          unitValue: unitValue !== undefined ? unitValue : record.unitValue,
        })

        getStockLocation(
          record.itemId,
          stockLocationId,
          stockLocationDescription,
        )
      } else if (data.isOk && data.items.length === 0) {
        setLoadingStockLocation(false)
        setItemSource([])
        setStockLocationSource([])
        form.setFieldsValue({
          stockLocationId: null,
          itemCode: null,
          measuringUnitId: null,
          measuringUnitCode: null,
          stockAddress: null,
          quantityAvailable: null,
          itemId: null,
          materialLikeCount: null,
          returnRequired: null,
          itemDescription: null,
        })
      } else {
        setLoadingStockLocation(false)
        setLoadingItem(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoadingStockLocation(false)
      setLoadingItem(false)
      handleAuthError(error)
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
      form.setFieldsValue({ stockAddress: null, quantityAvailable: null })
    }
  }

  const refreshStock = () => {
    getStockLocation(
      form.getFieldValue('itemId'),
      form.getFieldValue('stockLocationId'),
    )
  }

  const onChangePurchaseOrder = value => {
    const purchaseOrder = purchaseOrderSource.find(
      x => x.purchaseOrderId === value,
    )
    if (purchaseOrder) {
      form.setFieldsValue({ supplierName: purchaseOrder.supplierName })
    } else {
      form.setFieldsValue({ supplierName: null })
    }
  }

  const nextStage = (newCount, selectedRows) => {
    if (newCount > 0 && newCount <= selectedRows.length) {
      const itemWork = selectedRows[newCount - 1]
      const source = [
        {
          id: itemWork.partId,
          code: itemWork.partCode,
          description: itemWork.partDescription,
          measuringUnitId: itemWork.measuringUnitId,
          measuringUnitCode: itemWork.measuringUnitCode,
          canDecimal: itemWork.canDecimal,
          materialLikeCount: itemWork.materialLikeCount,
          returnRequired: itemWork.returnRequired,
        },
      ]

      setItemSource(source)
      setItemsCount(newCount)
      setCurrentItem(itemWork)
      setStage(2)
      getStockLocation(itemWork.partId, itemWork.stockLocationId)
    }
  }
  const onChangePriceList = value => {
    getPriceListItem(form.getFieldValue('itemId'), value)
  }

  useEffect(() => {
    if (serviceOrderPartId && !newStatus) {
      form.getFieldValue('itemCode') !== currentItem?.partCode &&
        setNewStatus(true)
    }
  }, [form])

  useEffect(() => {
    if (newStatus) {
      message.info(
        "O status da peça foi alterado para 'Pré-diagnóstico'. Favor, analisar novamente a aplicação da peça!",
      )
      const statusDiagnostId = defaultStatus?.filter(r => r?.Code === 'PDIA')
      setStatusSource([
        {
          id: statusDiagnostId[0]?.StatusId,
          code: 'PDIA',
          description: 'Pré-diagnóstico',
        },
      ])
      form.setFieldsValue({ actStatusId: statusDiagnostId[0]?.StatusId })
    }
  }, [newStatus])

  useEffect(() => {
    !newItemModal && setNewStatus(false)
  }, [newItemModal])

  function showSaveButton() {
    if (screen === 'CreateOS') {
      return true
    } else {
      return canBeUpdated && (!loading || (loading && isSaving))
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
        title={formatMessage({
          id: !serviceOrderPartId
            ? 'serviceOrder.serviceOrderParts.newItem'
            : canBeUpdated
            ? 'serviceOrder.serviceOrderParts.editItem'
            : 'serviceOrder.serviceOrderParts.queryItem',
        })}
        width={1050}
        visible={newItemModal}
        centered
        destroyOnClose
        onCancel={() => setNewItemModal(false)}
        footer={
          stage === 1 ? (
            <Row type="flex">
              {!loading && (
                <Button
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                  }}
                  disabled={selectedRows.length === 0}
                  onClick={() => nextStage(1, selectedRows)}
                >
                  {formatMessage({ id: 'continueButton' })}
                </Button>
              )}
              <Button
                type="secondary"
                className={loading ? '' : 'ml-3'}
                style={{
                  marginRight: 'auto',
                }}
                onClick={() => setNewItemModal(false)}
              >
                {formatMessage({ id: 'cancelButton' })}
              </Button>
            </Row>
          ) : (
            <Row type="flex">
              {showSaveButton() && (
                <Button
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                  }}
                  onClick={handleSave}
                  loading={isSaving}
                >
                  {itemsCount === selectedRows.length
                    ? formatMessage({ id: 'saveButton' })
                    : formatMessage({ id: 'nextButton' })}
                </Button>
              )}
              <Button
                type="secondary"
                className={
                  canBeUpdated && (!loading || (loading && isSaving))
                    ? 'ml-3'
                    : ''
                }
                style={{
                  marginRight: 'auto',
                }}
                onClick={() => setNewItemModal(false)}
              >
                {formatMessage({ id: 'cancelButton' })}
              </Button>
              <div style={{ marginLeft: 'auto' }}>
                {itemsCount}
                {formatMessage({ id: 'serviceOrder.modals.newItem.of' })}
                {selectedRows.length}
                {formatMessage({ id: 'serviceOrder.modals.newItem.items' })}
              </div>
            </Row>
          )
        }
      >
        <Spin size="large" spinning={loading}>
          <div ref={ref}>
            {alertMessages.map((message, index) => (
              <Alert
                type="error"
                message={message}
                key={index}
                showIcon
                className="mb-2"
              />
            ))}
          </div>

          <Skeleton
            loading={loading && serviceOrderPartId && !isSaving}
            paragraph={{ rows: 13 }}
            active
          />

          <div
            style={{
              display:
                loading && serviceOrderPartId && !isSaving ? 'none' : 'block',
            }}
          >
            {stage === 1 ? (
              <NewItemStage1
                form={form}
                selectedOption={selectedOption}
                onChangeOption={onChangeOption}
                search={search}
                data={data}
                catalog={catalog}
                kit={kit}
                onChangeKit={onChangeKit}
                onChangeCatalog={onChangeCatalog}
                keyTable={keyTable}
                kitQuantity={kitQuantity}
                setKitQuantity={setKitQuantity}
                nextStage={nextStage}
                setLoading={setLoading}
                setSelectedRows={setSelectedRows}
                selectedRows={selectedRows}
              />
            ) : (
              <NewItemStage2
                form={form}
                selectedRows={selectedRows}
                itemsCount={itemsCount}
                loadingStockLocation={loadingStockLocation}
                statusSource={statusSource}
                productSource={productSource}
                serviceSource={serviceSource}
                pieceDefectSource={pieceDefectSource}
                stockLocationSource={stockLocationSource}
                canBeUpdated={canBeUpdated}
                itemSource={itemSource}
                setItemSource={setItemSource}
                openSimilarItem={openSimilarItem}
                refreshStock={refreshStock}
                onChangeStockLocation={onChangeStockLocation}
                purchaseOrderSource={purchaseOrderSource}
                setPurchaseOrderSource={setPurchaseOrderSource}
                onChangePurchaseOrder={onChangePurchaseOrder}
                priceListSource={priceListSource}
                loadingItem={loadingItem}
                onChangeItem={onChangeItem}
                selectedOption={selectedOption}
                currentItem={currentItem}
                kitQuantity={kitQuantity}
                canUpdateItem={canUpdateItem}
                refreshPriceListItem={() =>
                  getPriceListItem(
                    form.getFieldValue('itemId'),
                    form.getFieldValue('priceListId'),
                  )
                }
                onChangePriceList={onChangePriceList}
                loadingPriceListItem={loadingPriceListItem}
                screen={screen}
                actStatusId={createOSStatusId}
              />
            )}
          </div>
        </Spin>
      </Modal>
    </React.Fragment>
  )
}

NewItem.propTypes = {
  form: PropTypes.any,
  newItemModal: PropTypes.bool,
  setNewItemModal: PropTypes.any,
  serviceOrderPartId: PropTypes.number,
  serviceOrder: PropTypes.any,
  onChangeServiceOrderPart: PropTypes.func,
  userPermissions: PropTypes.array,
  software: PropTypes.string,
}

const WrappedNewItem = Form.create()(NewItem)
export default WrappedNewItem
