/**
 * breadcrumb: Requisição de peças
 * type: Menu
 */
import { apiChecklist, apiMaterialRequest } from '@services/api'
import { handleAuthError } from '@utils'
import {
  PermissionProvider,
  usePermissionContext,
} from '@utils/context/Permission'
import { ComponentWithPermission } from '@utils/HOF'
import { message, Modal, Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { withWrapper } from 'with-wrapper'
import MaterialRequestHeader from './components/MaterialRequestHeader'
import MaterialRequestTable from './components/MaterialRequestTable'
import PrintRequest from './print/PrintRequest'

const params = {
  requestNewId: null,
  sequenceNumber: null,
  initialDate: null,
  finalDate: null,
  requesterName: null,
  actStatusId: null,
  actStatusDescription: null,
  actReasonDescription: null,
  isBlocked: null,
  documentOriginId: null,
  sequenceNumberDocumentOrigin: null,
  customerName: null,
  itemCode: null,
  itemDescription: null,
  stockLocationDescription: null,
  itemActStatusId: null,
  itemActStatusDescription: null,
  itemActReasonDescription: null,
  getRequestItems: false,
}

const searchOptionsInitial = [
  {
    value: 'sequenceNumber',
    label: 'Número da requisição',
    placeholder: 'Número da requisição',
    type: 'search',
    dataType: 'integer',
  },
  {
    value: 'period',
    label: 'Período',
    type: 'rangeDate',
  },
  {
    value: 'requesterName',
    label: 'Solicitante',
    placeholder: 'Buscar por solicitante',
    type: 'search',
  },
  {
    value: 'actStatusId',
    label: 'Status da requisição',
    placeholder: 'Selecione o status da requisição',
    type: 'select',
    options: [],
  },
  {
    value: 'actReasonDescription',
    label: 'Motivo do status',
    placeholder: 'Buscar por motivo do status',
    type: 'search',
  },
  {
    value: 'isBlocked',
    label: 'Bloqueado',
    placeholder: 'Bloqueado',
    type: 'select',
    options: [
      { label: ' ', value: null },
      { label: 'Sim', value: 1 },
      { label: 'Não', value: 2 },
    ],
  },
  {
    value: 'sequenceNumberDocumentOrigin',
    label: 'Documento',
    placeholder: 'Número do documento',
    type: 'search',
    dataType: 'integer',
  },
  {
    value: 'customerName',
    label: 'Cliente',
    placeholder: 'Buscar por cliente',
    type: 'search',
  },
  {
    value: 'itemCode',
    label: 'Código do item',
    placeholder: 'Buscar por código do item',
    type: 'search',
  },
  {
    value: 'itemDescription',
    label: 'Descrição do item',
    placeholder: 'Buscar por descrição do item',
    type: 'search',
  },
  {
    value: 'stockLocationDescription',
    label: 'Local de estoque',
    placeholder: 'Buscar por local de estoque',
    type: 'search',
  },
  {
    value: 'itemActStatusId',
    label: 'Status do item',
    placeholder: 'Selecione o status do item',
    type: 'select',
    options: [],
  },
  {
    value: 'itemActReasonDescription',
    label: 'Motivo do status do item',
    placeholder: 'Buscar por motivo do status do item',
    type: 'search',
  },
]

const MaterialRequisition = props => {
  const { permissions } = usePermissionContext()

  const [searchOptions, setSearchOptions] = useState(searchOptionsInitial)
  const [selectedRows, setSelectedRows] = useState([])
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyTable, setKeyTable] = useState(0)
  const [dataExport, setDataExport] = useState([])
  const [screen, setScreen] = useState('Grid')

  let requestPerformed = []

  useEffect(() => {
    const data = [
      {
        columns: [
          'Número',
          'Solicitante',
          'Data inicial',
          'Data final',
          'Status',
        ],
        data: [],
      },
    ]

    selectedRows.map(d =>
      data[0].data.push([
        d.sequenceNumber,
        d.requesterName,
        moment(d.initialDate).format('DD/MM/YYYY'),
        moment(d.finalDate).format('DD/MM/YYYY'),
        d.actStatusDescription,
      ]),
    )

    setDataExport(data)
  }, [selectedRows])

  useEffect(() => {
    clearParams()
    getStatus('RequestNew')
    getStatus('RequestNewItem')
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function clearParams() {
    params.requestNewId = null
    params.sequenceNumber = null
    params.initialDate = null
    params.finalDate = null
    params.requesterName = null
    params.actStatusId = null
    params.actStatusDescription = null
    params.actReasonDescription = null
    params.isBlocked = null
    params.documentOriginId = null
    params.sequenceNumberDocumentOrigin = null
    params.customerName = null
    params.itemCode = null
    params.itemDescription = null
    params.stockLocationDescription = null
    params.itemActStatusId = null
    params.itemActStatusDescription = null
    params.itemActReasonDescription = null
  }

  async function getStatus(classDefinition) {
    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/BusinessDocument/StatusByClassDefinition`,
        params: { classDefinition },
      })

      const { data } = response

      if (data.IsOK) {
        const statuses = data.statusByClassDefinition
        const optionValue =
          classDefinition === 'RequestNew' ? 'actStatusId' : 'itemActStatusId'
        const index = searchOptions.findIndex(x => x.value === optionValue)
        if (index >= 0) {
          searchOptions[index].options = []
          searchOptions[index].options.push({ value: null, label: ' ' })
          statuses.map(status =>
            searchOptions[index].options.push({
              value: status.StatusId,
              label: status.Description,
            }),
          )
          setSearchOptions([...searchOptions])
        }
      } else {
        message.error(data.Exception)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiMaterialRequest({
        method: 'POST',
        url: `/api/stock/getRequest`,
        data: params,
        headers: { 'Content-Type': 'application/json' },
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        setTableData(data.request)
        setKeyTable(keyTable + 1)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function startSearch(fieldName, searchFieldValue) {
    setSearchValues(fieldName, searchFieldValue)
    getData()
  }

  function setSearchValues(fieldName, searchFieldValue) {
    clearParams()
    if (fieldName === 'period') {
      params.initialDate = searchFieldValue[0]
        ? searchFieldValue[0].format('YYYY-MM-DD')
        : null
      params.finalDate = searchFieldValue[1]
        ? searchFieldValue[1].format('YYYY-MM-DD')
        : null
    } else if (fieldName === 'isBlocked') {
      params.isBlocked =
        searchFieldValue === 1 ? true : searchFieldValue === 2 ? false : null
    } else {
      const searchOption = searchOptions.find(x => x.value === fieldName)
      if (searchOption) {
        if (searchOption.dataType === 'integer') {
          params[fieldName] = searchFieldValue
            ? parseInt(searchFieldValue, 10)
            : null
        } else {
          params[fieldName] = searchFieldValue
        }
      }
    }
  }

  function confirmDeleteRequest() {
    Modal.confirm({
      content:
        selectedRows.length === 1
          ? 'Confirma exclusão da requisição selecionada?'
          : 'Confirma exclusão das requisições selecionadas?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteRequests()
      },
    })
  }

  function addRequestPerformed(requestNewId) {
    requestPerformed.push(requestNewId)

    if (requestPerformed.length >= selectedRows.length) {
      requestPerformed = []
      getData()
    }
  }

  function deleteRequests() {
    setLoading(true)
    requestPerformed = []
    selectedRows.map(record => deleteRequest(record.requestNewId))
  }

  async function deleteRequest(requestNewId) {
    try {
      const response = await apiMaterialRequest({
        method: 'DELETE',
        url: `/api/stock/Request`,
        params: { requestNewId },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }
      addRequestPerformed(requestNewId)
    } catch (error) {
      handleAuthError(error)
      addRequestPerformed(requestNewId)
    }
  }

  function confirmSeparateRequest() {
    Modal.confirm({
      content:
        selectedRows.length === 1
          ? 'Deseja mudar o status da requisição selecionada para "Separada"?'
          : 'Deseja mudar o status das requisições selecionadas para "Separada"?',
      title: 'Atenção',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: () => {
        changeStatusRequests('SEPA')
      },
    })
  }

  function confirmApplyRequest() {
    Modal.confirm({
      content: 'Aplicar os itens?',
      title: 'Atenção',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: () => {
        changeStatusRequests('APLI')
      },
    })
  }

  function changeStatusRequests(status) {
    setLoading(true)
    requestPerformed = []
    selectedRows.map(record => changeStatusRequest(status, record.requestNewId))
  }

  async function changeStatusRequest(status, requestNewId) {
    try {
      const response = await apiMaterialRequest({
        method: 'PUT',
        url: `/api/stock/RequestStatus`,
        params: { requestNewId, status },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }

      addRequestPerformed(requestNewId)
    } catch (error) {
      handleAuthError(error)
      addRequestPerformed(requestNewId)
    }
  }

  const printRequest = () => {
    setScreen('Print')
  }

  const handleClosePrint = () => {
    setScreen('Grid')
    setSelectedRows([])
    setKeyTable(keyTable + 1)
  }

  return screen === 'Print' ? (
    <PrintRequest
      requestNewId={selectedRows.map(d => d.requestNewId).join('|')}
      onClose={handleClosePrint}
    />
  ) : (
    <div className="container">
      <MaterialRequestHeader
        selectedRows={selectedRows}
        userPermissions={permissions}
        searchOptions={searchOptions}
        startSearch={startSearch}
        setSearchValues={setSearchValues}
        confirmDeleteRequest={confirmDeleteRequest}
        confirmSeparateRequest={confirmSeparateRequest}
        confirmApplyRequest={confirmApplyRequest}
        loading={loading}
        dataExport={dataExport}
        printRequest={printRequest}
      />
      <Spin size="large" spinning={loading}>
        <MaterialRequestTable
          tableData={tableData}
          setSelectedRows={setSelectedRows}
          userPermissions={permissions}
          keyTable={keyTable}
        />
      </Spin>
    </div>
  )
}

export const WrapperMaterialRequisition = withWrapper((element, props) => (
  <PermissionProvider processName="MaterialRequest">
    {element}
  </PermissionProvider>
))(props => {
  const { permissions, loadingPermissions } = usePermissionContext()

  return (
    <ComponentWithPermission {...{ loadingPermissions, permissions }}>
      <MaterialRequisition {...props} />
    </ComponentWithPermission>
  )
})

export default WrapperMaterialRequisition
