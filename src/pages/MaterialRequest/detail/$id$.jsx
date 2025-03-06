/* eslint-disable prefer-destructuring */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from '@ant-design/compatible'
import { apiChecklist, apiMaterialRequest } from '@services/api'
import { fieldsValidationToast, handleAuthError, hasPermission } from '@utils'
import {
  PermissionProvider,
  usePermissionContext,
} from '@utils/context/Permission'
import { ComponentWithPermission } from '@utils/HOF'
import { Alert, message, Modal, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import { withWrapper } from 'with-wrapper'
import { NewMaterialRequestFooter } from './components/NewMaterialRequestFooter'
import NewMaterialRequestForm from './components/NewMaterialRequestForm'
import { NewMaterialRequestHeader } from './components/NewMaterialRequestHeader'
import NewMaterialRequestTable from './components/NewMaterialRequestTable'
import NewMaterialRequestTableHeader from './components/NewMaterialRequestTableHeader'
import AddRequisitionItemModal from './modals/AddRequisitionItemModal'
import RequiredDevolution from './modals/RequiredDevolution'

const { confirm } = Modal
let request

const NewMaterialRequisition = props => {
  const { permissions } = usePermissionContext()

  const { form, match } = props
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [loading, setLoading] = useState(true)
  const [itemReasonSource, setItemReasonSource] = useState([])
  const [itemStatusSource, setItemStatusSource] = useState([])
  const [canChangeItemStatus, setCanChangeItemStatus] = useState(false)
  const [requestNewId, setRequestNewId] = useState(match.params.id)
  const [modalState, setModalState] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [requestItems, setRequestItems] = useState([])
  const [originalRequestItems, setOriginalRequestItems] = useState([])
  const [requestItem, setRequestItem] = useState(null)
  const [keyAddRequisitionItem, setKeyAddRequisitionItem] = useState(0)
  const [requesterSource, setRequesterSource] = useState([])
  const [statusSource, setStatusSource] = useState([])
  const [reasonSource, setReasonSource] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingReason, setLoadingReason] = useState(false)
  const [sequenceNumber, setSequenceNumber] = useState(null)
  const [alertMessages, setAlertMessages] = useState([])
  const [keyTable, setKeyTable] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [canUpdateItems, setCanUpdateItems] = useState(true)
  const [userUpdate, setUserUpdate] = useState(null)
  const [dateUpdate, setDateUpdate] = useState(null)
  const [formChanged, setFormChanged] = useState(false)
  const [dataExport, setDataExport] = useState([])
  const [modalDevolution, setModalDevolution] = useState(false)
  const [keyModalDevolution, setKeyModalDevolution] = useState(0)
  const [canBeReturned, setCanBeReturned] = useState(true)
  const [manual, setManual] = useState(false)

  const ref = React.useRef()
  const refHome = React.useRef()

  useEffect(() => {
    clearForm()
    getItemStatus()
    if (requestNewId) {
      getRequest(requestNewId)
    } else {
      getStatus()
    }
    if (refHome.current) {
      refHome.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])

  function clearForm() {
    setDataExport([])
    setCanBeUpdated(true)
    setCanBeReturned(true)
    setFormChanged(false)
    setCanUpdateItems(true)
    setUserUpdate(null)
    setDateUpdate(null)
    request = null
    form.resetFields()
  }

  async function getItemStatus() {
    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/BusinessDocument/StatusByClassDefinition`,
        params: { classDefinition: 'RequestNewItem' },
      })

      const { data } = response

      if (data.IsOK) {
        const statuses = data.statusByClassDefinition
        const source = []

        statuses.map(record =>
          source.push({
            id: record.StatusId,
            code: record.Code,
            description: record.Description,
          }),
        )

        setItemStatusSource(source)

        loadItemReason(source, 'PEND', 'APLI')
        loadItemReason(source, 'PEND', 'SEPA')
        loadItemReason(source, 'SEPA', 'APLI')
        loadItemReason(source, 'PEND', 'CANC')
        loadItemReason(source, 'SEPA', 'CONC')

        loadItemReason(source, null, 'APLI')
        loadItemReason(source, null, 'CANC')
        loadItemReason(source, null, 'CONC')
        loadItemReason(source, null, 'PEND')
        loadItemReason(source, null, 'SEPA')
      } else {
        message.error(data.Exception)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function loadItemReason(source, code, nextCode) {
    const statusFrom = source.find(x => x.code === code)
    const statusTo = source.find(x => x.code === nextCode)

    if (statusFrom && statusTo) {
      addItemReason(statusFrom.id, statusTo.id, statusFrom.code, statusTo.code)
    }
  }

  useEffect(() => {
    if (
      itemReasonSource.find(x => x.code === 'PEND' && x.nextCode === 'SEPA') &&
      itemReasonSource.find(x => x.code === 'PEND' && x.nextCode === 'APLI') &&
      itemReasonSource.find(x => x.code === 'SEPA' && x.nextCode === 'APLI') &&
      itemReasonSource.find(x => x.code === 'PEND' && x.nextCode === 'CANC') &&
      itemReasonSource.find(x => x.code === 'SEPA' && x.nextCode === 'CONC')
    ) {
      setCanChangeItemStatus(true)
    }
  }, [itemReasonSource])

  async function addItemReason(
    actStatusId,
    nextStatusId,
    actStatusCode,
    nextStatusCode,
  ) {
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/API/Stock/Reason`,
        params: { actStatusId, nextStatusId },
      })

      const { data } = response

      if (data.isOk) {
        const { reasons } = data
        reasons.map(record =>
          itemReasonSource.push({
            id: record.reasonId,
            description: record.description,
            code: actStatusCode,
            nextCode: nextStatusCode,
          }),
        )

        setItemReasonSource([...itemReasonSource])
      } else {
        message.error(data.Exception)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getRequest(id, devolution) {
    setLoading(true)
    setAlertMessages([])
    try {
      const response = await apiMaterialRequest({
        method: 'POST',
        url: `/api/stock/getRequest`,
        data: { requestNewId: id, getRequestItems: true },
        headers: { 'Content-Type': 'application/json' },
      })

      const { data } = response
      if (data.isOk) {
        if (data.request.length === 0) {
          message.error('Requisição não encontrada!')
          router.push('/materialRequest')
        } else {
          request = data.request[0]
          devolution && setManual(false)
          devolution && doDevolution(null, true)
          setFields()
          if (request.isBlocked) {
            setAlertMessages([
              'Requisição bloqueada para alteração ou inclusão de novos itens',
            ])
            setCanUpdateItems(false)
          }
          buildDataExport()
        }
      } else {
        message.error(data.message)
        router.push('/materialRequest')
      }
    } catch (error) {
      handleAuthError(error)
      router.push('/materialRequest')
    }
  }

  function setFields() {
    setFormChanged(false)
    setSequenceNumber(request.sequenceNumber)
    setCanBeUpdated(request.canBeUpdated)
    setCanBeReturned(request.canBeReturned)
    setCanUpdateItems(
      !(request.actStatusCode === 'CONC' || request.actStatusCode === 'CANC'),
    )
    setOriginalRequestItems(request.requestItems.slice(0))
    setRequestItems(request.requestItems)
    getStatus()
    setRequesterSource([
      {
        id: request.requesterId,
        name: request.requesterName,
        isServicoExterno: request.isTecnicoServicoExterno,
        isServicoInterno: request.isTecnicoServicoInterno,
      },
    ])
    setUserUpdate(request.lastUpdateUserName || request.createUserName)
    setDateUpdate(
      request.lastUpdateDateTime
        ? moment(request.lastUpdateDateTime)
        : request.createDateTime
        ? moment(request.createDateTime)
        : null,
    )
    form.setFieldsValue({
      requesterId: request.requesterId,
      period: [moment(request.initialDate), moment(request.finalDate)],
      isBlocked: request.isBlocked,
      observation: request.observation,
      isRequisicaoOficina: request.isRequisicaoOficina ? 1 : 2,
    })
  }

  async function getStatus() {
    setLoadingStatus(true)
    let currentStatus = null

    if (request) {
      currentStatus = {
        id: request.actStatusId,
        code: request.actStatusCode,
        description: request.actStatusDescription,
      }
    } else {
      currentStatus = {
        id: 0,
        code: 'PEND',
        description: 'Pendente',
      }
    }
    let actStatusId = !request ? 0 : currentStatus.id || 0

    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/BusinessDocument/StatusByClassDefinition`,
        params: { classDefinition: 'RequestNew', actStatusId },
      })

      setLoadingStatus(false)

      const { data } = response

      if (data.IsOK) {
        const statuses = data.statusByClassDefinition
        const source = []

        if (
          currentStatus &&
          statuses.findIndex(x => x.Code === currentStatus.code) === -1
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

          const reason = !request
            ? null
            : {
                id: request.actReasonId,
                description: request.actReasonDescription,
              }

          refreshReason(actStatusId, reason)
        } else {
          setLoading(false)
          form.resetFields(['actStatusId, actReasonId'])
          setReasonSource([])
        }
      } else {
        setLoadingStatus(false)
        setLoading(false)
        message.error(data.Exception)
      }
    } catch (error) {
      setLoadingStatus(false)
      setLoading(false)
      handleAuthError(error)
    }
  }

  const refreshReason = (nextStatusId, reason) => {
    let actStatusId

    if (!request) {
      actStatusId = 0
    } else if (request.actStatusId === nextStatusId) {
      actStatusId = request.actStatusOldId
    } else {
      actStatusId = request.actStatusId
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
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        const { reasons } = data
        const source = []

        if (reason && reasons.findIndex(x => x.reasonId === reason.id) === -1) {
          source.push(reason)
        }

        reasons.map(record =>
          source.push({ id: record.reasonId, description: record.description }),
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
        setLoading(false)
        message.error(data.Exception)
      }
    } catch (error) {
      setLoadingReason(false)
      setLoading(false)
      handleAuthError(error)
    }
  }

  const toogleModalVisible = e => {
    setModalState(false)
  }

  const handleSubmit = (e, print, notReturnRequests) => {
    e && e.preventDefault()
    setAlertMessages([])
    if (requestItems.length > 0 && !periodOk()) {
      return
    }
    form.validateFields((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else if (requestItems.length === 0) {
        message.error('Requisição não possui itens!')
      } else {
        verifyStatusAndSave(print, notReturnRequests)
      }
    })
  }

  const periodOk = () => {
    if (requestNewId > 0) {
      return true
    }
    let result = true
    let msg = ''
    const period = form.getFieldValue('period')
    requestItems.map(d => {
      if (
        form.getFieldValue('isRequisicaoOficina') !== 1 &&
        d.documentOriginId &&
        !d.roadMapDate
      ) {
        result = false
        msg = `Documento ${d.sequenceNumber} não está roteirizado!`
      } else if (
        form.getFieldValue('isRequisicaoOficina') === 1 &&
        d.documentOriginId &&
        !d.entryDateFactory
      ) {
        result = false
        msg = `Documento ${d.sequenceNumber} não possui data de entrada de oficina!`
      } else if (
        form.getFieldValue('isRequisicaoOficina') !== 1 &&
        d.documentOriginId &&
        d.roadMapDate &&
        !(
          moment(d.roadMapDate).format('YYYY-MM-DD') >=
            period[0].format('YYYY-MM-DD') &&
          moment(d.roadMapDate).format('YYYY-MM-DD') <=
            period[1].format('YYYY-MM-DD')
        )
      ) {
        msg = `Documento ${d.sequenceNumber} está agendado fora do período da requisição!`
        result = false
      } else if (
        form.getFieldValue('isRequisicaoOficina') === 1 &&
        d.documentOriginId &&
        d.entryDateFactory &&
        !(
          moment(d.entryDateFactory).format('YYYY-MM-DD') >=
            period[0].format('YYYY-MM-DD') &&
          moment(d.entryDateFactory).format('YYYY-MM-DD') <=
            period[1].format('YYYY-MM-DD')
        )
      ) {
        msg = `Documento ${d.sequenceNumber} está com data de entrada de oficina fora do período da requisição!`
        result = false
      }
      return true
    })
    msg && message.error(msg)
    return result
  }

  function verifyStatusAndSave(print, notReturnRequests) {
    const status = statusSource.find(
      x => x.id === form.getFieldValue('actStatusId'),
    )
    if (
      status?.code !== 'CANC' &&
      status?.code !== 'CONC' &&
      requestItems.filter(
        x => x.actStatusCode === 'SEPA' || x.actStatusCode === 'PEND',
      ).length === 0 &&
      requestItems?.length > 0
    ) {
      confirm({
        title: 'Deseja concluir a requisição?',
        onOk: () => {
          saveRequest(print, notReturnRequests, true)
        },
        onCancel: () => {
          saveRequest(print, notReturnRequests, false)
        },
        cancelText: formatMessage({
          id: 'globalComponents.confirmModal.no',
        }),
        okText: formatMessage({
          id: 'globalComponents.confirmModal.yes',
        }),
        okButtonProps: { size: 'large' },
        cancelButtonProps: { size: 'large' },
      })
    } else {
      saveRequest(print, notReturnRequests, false)
    }
  }

  async function saveRequest(print, notReturnRequests, finishRequest) {
    setIsSaving(true)
    setLoading(true)
    const period = form.getFieldValue('period')

    const requestBody = {
      request: {
        requestNewId: request ? request.requestNewId : 0,
        initialDate: moment(period[0]).format('YYYY-MM-DD'),
        finalDate: moment(period[1]).format('YYYY-MM-DD'),
        requesterId: form.getFieldValue('requesterId'),
        isBlocked: form.getFieldValue('isBlocked'),
        observation: form.getFieldValue('observation'),
        actStatusId: form.getFieldValue('actStatusId'),
        actReasonId: form.getFieldValue('actReasonId'),
        finishRequest: !!finishRequest,
        isRequisicaoOficina: form.getFieldValue('isRequisicaoOficina') === 1,
        requestItems: [],
      },
    }

    requestItems.map(record =>
      requestBody.request.requestItems.push({
        requestNewItemId: record.requestNewItemId,
        itemId: record.itemId,
        stockLocationId: record.stockLocationId,
        measuringUnitId: record.measuringUnitId,
        quantityRequested: record.quantityRequested,
        quantityApplied: record.quantityApplied,
        actStatusId: record.actStatusId,
        actReasonId: record.actReasonId,
        documentType: record.documentType,
        documentOriginId: record.documentOriginId,
        quantityReturned: record.quantityReturned,
        observationReturned: record.observationReturned,
        priceListId: record.priceListId,
        unitValue: record.unitValue,
      }),
    )

    try {
      const response = await apiMaterialRequest({
        method: 'POST',
        url: `/api/stock/request`,
        data: requestBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        if (print) {
          router.push(`/MaterialRequest/print/${data.idGenerated}`)
        } else if (notReturnRequests) {
          router.push(`/MaterialRequest/detail/${data.idGenerated}`)
          setRequestNewId(data.idGenerated)
          const devolution =
            hasPermission(permissions, 'Alter') &&
            canBeReturned &&
            requestItems.find(
              x => x.actStatusCode === 'APLI' && x.returnRequired,
            )
          getRequest(data.idGenerated, devolution)
        } else {
          router.push('/MaterialRequest')
        }
      } else {
        setAlertMessages(data.validationMessageList)
        setKeyTable(keyTable + 1)
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

  const addRequisitionItem = requestItemToEdit => {
    setRequestItem(requestItemToEdit)
    setKeyAddRequisitionItem(keyAddRequisitionItem + 1)
    setModalState(true)
  }

  const handleSaveItem = newRequestItem => {
    setFormChanged(true)
    if (newRequestItem.key === -1) {
      const newRequestItemWork = newRequestItem
      requestItems.map(record => {
        if (record.key > newRequestItemWork.key) {
          newRequestItemWork.key = record.key
        }
        return true
      })
      newRequestItemWork.key++
      requestItems.push(newRequestItemWork)
    } else {
      const index = requestItems.findIndex(x => x.key === newRequestItem.key)
      if (index >= 0) {
        requestItems[index] = newRequestItem
      }
    }

    if (
      form.getFieldValue('isRequisicaoOficina') === null &&
      newRequestItem.serviceOrderActStatusCode
    ) {
      form.setFieldsValue({
        isRequisicaoOficina:
          newRequestItem.serviceOrderActStatusCode === 'OFIC' ? 1 : 2,
      })
    }

    setRequestItems([...requestItems])
  }

  const confimDeleteItems = () => {
    confirm({
      title:
        selectedRows.length === 1
          ? 'Confirma exclusão do item?'
          : 'Confirma exclusão dos itens?',
      onOk: deleteItems,
      okType: 'danger',
      cancelText: formatMessage({
        id: 'globalComponents.confirmModal.no',
      }),
      okText: formatMessage({
        id: 'globalComponents.confirmModal.yes',
      }),
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  }

  function onChangeStatus(value) {
    const status = statusSource.find(x => x.id === value)
    let statusOk = true

    if (status && status.code === 'CANC') {
      statusOk = cancelRequest()
    } else if (status && status.code === 'CONC') {
      statusOk = finishRequest()
    } else if (status && status.code === 'SEPA') {
      statusOk = separateRequest()
    } else if (!status) {
      statusOk = false
    } else {
      setCanUpdateItems(canBeUpdated)
    }

    let actStatusId = value

    if (!statusOk) {
      actStatusId = statusSource.length > 0 ? statusSource[0].id : null
      if (request) {
        actStatusId = request.actStatusId
      }
    }

    refreshReason(actStatusId)
    return actStatusId
  }

  const deleteItems = () => {
    setFormChanged(true)
    selectedRows.map(record => {
      const index = requestItems.findIndex(x => x.key === record.key)
      if (index >= 0) {
        requestItems.splice(index, 1)
      }
      return true
    })
    setRequestItems([...requestItems])
    setSelectedRows([])
    setKeyTable(keyTable + 1)
  }

  function cancelRequest() {
    if (requestItems.length === 0) {
      message.error('Requisição não possui itens!')
      return false
    }

    const requestItemsFiltered = requestItems.filter(
      x => x.actStatusCode === 'CANC' || x.actStatusCode === 'PEND',
    )

    if (requestItems.length !== requestItemsFiltered.length) {
      message.error(
        'Só é possível cancelar a requisição se todos os itens estiverem pendentes ou cancelados!',
      )
      return false
    }

    if (
      requestItems.find(
        x =>
          x.actStatusCode === 'PEND' &&
          x.documentOriginId &&
          !x.documentInProgress,
      )
    ) {
      message.error(
        'Não é possível cancelar requisição com itens cujo documento esteja finalizado!',
      )
      return false
    }

    const itemsToCancel = requestItems
      .filter(x => x.actStatusCode === 'PEND')
      .map(record => record.key)

    if (itemsToCancel.length > 0 && !canChangeItemStatus) {
      message.error(
        'Não é possível cancelar os itens da requisição - atualização não permitida!',
      )
      return false
    }
    changeItemStatus('CANC', itemsToCancel)
    setCanUpdateItems(false)
    return true
  }

  function finishRequest() {
    if (requestItems.length === 0) {
      message.error('Requisição não possui itens!')
      return false
    }

    if (
      requestItems.find(
        x =>
          (x.actStatusCode === 'PEND' || x.actStatusCode === 'SEPA') &&
          x.documentOriginId &&
          !x.documentInProgress,
      )
    ) {
      message.error(
        'Não é possível concluir requisição com itens cujo documento esteja finalizado!',
      )
      return false
    }

    const itemsToCancel = requestItems
      .filter(x => x.actStatusCode === 'PEND')
      .map(record => record.key)
    const itemsToFinish = requestItems
      .filter(x => x.actStatusCode === 'SEPA')
      .map(record => record.key)

    if (
      (itemsToCancel.length > 0 || itemsToFinish.length > 0) &&
      !canChangeItemStatus
    ) {
      message.error(
        'Não é possível concluir os itens da requisição - atualização não permitida!',
      )
      return false
    }
    changeItemStatus('CANC', itemsToCancel)
    changeItemStatus('CONC', itemsToFinish)
    setCanUpdateItems(false)
    return true
  }

  function separateRequest() {
    if (requestItems.length === 0) {
      message.error('Requisição não possui itens!')
      return false
    }

    if (
      requestItems.find(
        x =>
          x.actStatusCode === 'PEND' &&
          x.documentOriginId &&
          !x.documentInProgress,
      )
    ) {
      message.error(
        'Não é possível separar requisição de itens pendentes com documentos que estão finalizados!',
      )
      return false
    }

    const itemsToSeparate = requestItems
      .filter(x => x.actStatusCode === 'PEND')
      .map(record => record.key)

    if (itemsToSeparate && !canChangeItemStatus) {
      message.error(
        'Não é possível separar os itens da requisição - atualização não permitida!',
      )
      return false
    }
    changeItemStatus('SEPA', itemsToSeparate)
    setCanUpdateItems(canBeUpdated)
    return true
  }

  const applyItems = () => {
    changeItemStatus('APLI', selectedRows.map(record => record.key))
  }

  const separateItems = () => {
    changeItemStatus('SEPA', selectedRows.map(record => record.key))
  }

  const changeItemStatus = (actStatusCode, selectedRowKeys) => {
    setFormChanged(true)
    const status = itemStatusSource.find(x => x.code === actStatusCode)

    if (status) {
      selectedRowKeys.map(key => {
        const index = requestItems.findIndex(x => x.key === key)
        if (index >= 0) {
          let actStatusOriginal = requestItems[index].actStatusOriginal
          if (!actStatusOriginal) {
            actStatusOriginal = {
              id: requestItems[index].actStatusId,
              description: requestItems[index].actStatusDescription,
              code: requestItems[index].actStatusCode,
            }
            requestItems[index].actStatusOriginal = actStatusOriginal
          }
          requestItems[index].actStatusId = status.id
          requestItems[index].actStatusCode = status.code
          requestItems[index].actStatusDescription = status.description
          const reason = itemReasonSource.find(
            x =>
              x.code === actStatusOriginal.code && x.nextCode === actStatusCode,
          )
          if (reason) {
            requestItems[index].actReasonId = reason.id
            requestItems[index].actReasonDescription = reason.description
          }
          if (actStatusCode === 'APLI') {
            requestItems[index].quantityApplied =
              requestItems[index].quantityRequested
          }
        }
        return true
      })
      setRequestItems([...requestItems])
    }
    if (
      actStatusCode === 'SEPA' &&
      !requestItems.find(x => x.actStatusCode !== 'SEPA')
    ) {
      const statusId = statusSource.find(x => x.code === 'SEPA')?.id
      if (statusId) {
        form.setFieldsValue({ actStatusId: statusId })
        refreshReason(statusId)
      }
    }
    setSelectedRows([])
    setKeyTable(keyTable + 1)
  }

  const printRequest = e => {
    e && e.preventDefault()
    if (formChanged) {
      confirm({
        title:
          'É necessário salvar as alterações antes de imprimir. Deseja salvar alterações?',
        onOk: () => {
          handleSubmit(e, true, false)
        },
        cancelText: formatMessage({
          id: 'globalComponents.confirmModal.no',
        }),
        okText: formatMessage({
          id: 'globalComponents.confirmModal.yes',
        }),
        okButtonProps: { size: 'large' },
        cancelButtonProps: { size: 'large' },
      })
    } else {
      router.push(`/MaterialRequest/print/${requestNewId}`)
    }
  }

  const doDevolution = (e, notAsk) => {
    e && e.preventDefault()
    if (formChanged && !notAsk) {
      Modal.info({
        title:
          'É necessário salvar as alterações antes de realizar a devolução!',
      })
    } else {
      setKeyModalDevolution(keyModalDevolution + 1)
      setModalDevolution(true)
    }
  }

  const handleDevolution = (e, notAsk) => {
    setManual(true)
    doDevolution(e, notAsk)
  }

  const onChangeDevolution = () => {
    getRequest(requestNewId)
  }

  function buildDataExport() {
    const data = [
      {
        columns: [],
        data: [
          [
            'Requisição:',
            request.sequenceNumber,
            'Solicitante:',
            request.requesterName,
            'Período:',
            `${moment(request.initialDate).format('DD/MM/YYYY')} ~ ${moment(
              request.finalDate,
            ).format('DD/MM/YYYY')}`,
          ],
          [
            'Status:',
            request.actStatusDescription,
            'Motivo do status:',
            request.actReasonDescription,
            'Observação:',
            request.observation,
          ],
        ],
      },
      {
        ySteps: 2,
        columns: [
          'Código',
          'Descrição',
          'Quantidade requisitada',
          'Quantidade aplicada',
          'Valor unitário',
          'Estoque',
          'Endereço',
          'Status',
          'Motivo do Status',
          'Documento origem',
          'Titular',
          'Quantidade devolvida',
          'Observação devolução',
        ],
        data: [],
      },
    ]

    request.requestItems.map(d =>
      data[1].data.push([
        d.itemCode,
        d.itemDescription,
        d.quantityRequested,
        d.quantityApplied,
        d.unitValue,
        d.stockLocationDescription,
        d.stockAddress,
        d.actStatusDescription,
        d.actReasonDescription,
        d.sequenceNumber,
        d.customerName,
        d.quantityReturned,
        d.observationReturned,
      ]),
    )

    setDataExport(data)
  }

  const userCanUpdate = userPermissions =>
    (requestNewId && hasPermission(userPermissions, 'Alter')) ||
    (!requestNewId && hasPermission(userPermissions, 'Include'))

  return (
    <div className="container" ref={refHome}>
      <React.Fragment>
        <AddRequisitionItemModal
          requesterId={form.getFieldValue('requesterId')}
          visible={modalState}
          requestItems={requestItems}
          originalRequestItems={originalRequestItems}
          requestNewItem={requestItem}
          toogleModalVisible={toogleModalVisible}
          handleSaveItem={handleSaveItem}
          userPermissions={permissions}
          canUpdateItem={
            canBeUpdated && userCanUpdate(permissions) && canUpdateItems
          }
          setRequestItem={setRequestItem}
          period={form.getFieldValue('period')}
          isRequisicaoOficina={form.getFieldValue('isRequisicaoOficina')}
          key={keyAddRequisitionItem}
        />
      </React.Fragment>

      <React.Fragment>
        <RequiredDevolution
          modalVisible={modalDevolution}
          items={requestItems || []}
          toogleModalVisible={() => setModalDevolution(false)}
          onChangeDevolution={onChangeDevolution}
          canBeUpdated={userCanUpdate(permissions) && canBeReturned}
          type="Request"
          manual={manual}
          key={keyModalDevolution}
        />
      </React.Fragment>

      <Spin size="large" spinning={loading}>
        <NewMaterialRequestHeader
          isSaving={isSaving}
          sequenceNumber={sequenceNumber}
          userPermissions={permissions}
          formChanged={formChanged}
          dataExport={dataExport}
          loading={loading}
          printRequest={printRequest}
          canBeUpdated={canBeUpdated && userCanUpdate(permissions)}
          doDevolution={handleDevolution}
          canBeReturned
          handleSubmit={handleSubmit}
          requestItems={requestItems}
        />

        <div ref={ref} className="mb-2">
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

        <NewMaterialRequestForm
          form={form}
          requestNewId={requestNewId}
          canBeUpdated={canBeUpdated && userCanUpdate(permissions)}
          setRequesterSource={setRequesterSource}
          requesterSource={requesterSource}
          onChangeStatus={onChangeStatus}
          statusSource={statusSource}
          reasonSource={reasonSource}
          loadingReason={loadingReason}
          loadingStatus={loadingStatus}
          canUpdateItems={canUpdateItems}
          setFormChanged={setFormChanged}
        />

        <NewMaterialRequestTableHeader
          selectedRows={selectedRows}
          addRequisitionItem={addRequisitionItem}
          userPermissions={permissions}
          applyItems={applyItems}
          separateItems={separateItems}
          confirmDeleteItems={confimDeleteItems}
          canChangeItemStatus={canChangeItemStatus}
          period={form.getFieldValue('period')}
          canBeUpdated={
            canBeUpdated && userCanUpdate(permissions) && canUpdateItems
          }
        />

        <NewMaterialRequestTable
          data={requestItems}
          setSelectedRows={setSelectedRows}
          addRequisitionItem={addRequisitionItem}
          keyTable={keyTable}
          canBeUpdated={
            canBeUpdated && userCanUpdate(permissions) && canUpdateItems
          }
        />

        <NewMaterialRequestFooter
          isSaving={isSaving}
          canBeUpdated={canBeUpdated && userCanUpdate(permissions)}
          handleSubmit={handleSubmit}
          userUpdate={userUpdate}
          dateUpdate={dateUpdate}
          formChanged={formChanged}
          requestNewId={requestNewId}
          refreshRequest={() => getRequest(requestNewId)}
        />
      </Spin>
    </div>
  )
}

NewMaterialRequisition.propTypes = {
  form: PropTypes.object,
  match: PropTypes.object,
}

const WrappedNewMaterialRequisition = Form.create()(NewMaterialRequisition)

export const WrapperNewRequisition = withWrapper((element, props) => (
  <PermissionProvider processName="MaterialRequest">
    {element}
  </PermissionProvider>
))(props => {
  const { permissions, loadingPermissions } = usePermissionContext()

  return (
    <ComponentWithPermission {...{ loadingPermissions, permissions }}>
      <WrappedNewMaterialRequisition {...props} />
    </ComponentWithPermission>
  )
})

export default WrapperNewRequisition
