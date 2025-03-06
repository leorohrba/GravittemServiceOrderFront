/**
 * breadcrumb: Peças da OS
 */
import { apiChecklist, apiMaterialRequest } from '@services/api'
import {
  getPermissions,
  getProcessId,
  handleAuthError,
  hasPermission,
  NoVisualize,
} from '@utils'
import { Alert, Col, message, Modal, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import RequiredDevolution from '../../MaterialRequest/detail/modals/RequiredDevolution'
import ServiceOrderPartsFooter from './components/ServiceOrderPartsFooter'
import ServiceOrderPartsHeader from './components/ServiceOrderPartsHeader'
import ServiceOrderPartsTable from './components/ServiceOrderPartsTable'
import NewItem from '@components/ServiceOrder/NewItem'
import PurchaseModal from './modals/PurchaseModal'

const { confirm } = Modal
/**
 * Esse componente é usado em dois lugares:
 * Ele é renderizado através do Backend pelo MVC
 * E também pela tela de Criar OS
 *
 *  @param match - Essa propriedade envolve algo de URL. Se for pela tela de CriarOS, ela se torna o id da OS.
 *  @param location - Envolve algo de URL para definir estoque negativo. Pela tela de CriarOS é omitido e passa true como fixo
 *  @param screen - Nome da tela do qual o componente veio. É usada pelo CriarOS
 *  @param actStatusId - StatusId da OS. Vem pelo CriarOS.
 */

function ServiceOrderParts(props) {
  const { match, location, screen, actStatusId } = props
  const [purchaseVisible, setPurchaseVisible] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])
  const [userPermissions, setUserPermissions] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [newItemModal, setNewItemModal] = useState(false)
  const [data, setData] = useState([])
  const [keyModal, setKeyModal] = useState(0)
  const [keyTable, setKeyTable] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingServiceOrder, setLoadingServiceOrder] = useState(true)
  const [serviceOrder, setServiceOrder] = useState(null)
  const [serviceOrderPartId, setServiceOrderPartId] = useState(0)
  const [statusSource, setStatusSource] = useState([])
  const serviceOrderId = screen === 'CreateOS' ? match : match.params.id
  const isNegativeStock =
    screen === 'CreateOS'
      ? true
      : location.query.estoqueNegativo?.toLocaleLowerCase() === 'true'
  const [software, setSoftware] = useState(null)
  const [modalDevolution, setModalDevolution] = useState(false)
  const [manual, setManual] = useState(false)
  const [keyModalDevolution, setKeyModalDevolution] = useState(false)
  const ref = React.useRef()

  useEffect(() => {
    setPermissions()
    getSoftware()
    if (serviceOrderId) {
      refreshGrid()
    } else {
      setLoadingServiceOrder(false)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (serviceOrder && serviceOrder.classDefinitionServiceOrderPart) {
      getStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceOrder])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getSoftware() {
    const processId = getProcessId()
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/services/Software`,
        params: { processId },
      })
      const { data } = response
      setSoftware(data)
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getStatus() {
    try {
      const response = await apiChecklist({
        method: 'GET',
        url: `/API/BusinessDocument/StatusByClassDefinition`,
        params: {
          classDefinition: serviceOrder.classDefinitionServiceOrderPart,
        },
      })

      const { data } = response

      if (data.IsOK) {
        const source = data.statusByClassDefinition
        source.map(status =>
          source.push({
            id: status.StatusId,
            description: status.Description,
            code: status.Code,
          }),
        )
        setStatusSource(source)
      } else {
        message.error(data.Exception)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getServiceOrder() {
    setLoadingServiceOrder(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/services/ServiceOrder`,
        params: { serviceOrderId },
      })
      setLoadingServiceOrder(false)
      const { data } = response

      if (data.isOk) {
        setServiceOrder(
          data.serviceOrders.length > 0 ? data.serviceOrders[0] : null,
        )
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getData(code) {
    setLoading(true)
    setSelectedRows([])
    setAlertMessages([])
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/services/ServiceOrderPart`,
        params: { serviceOrderId },
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        setData(data.serviceOrderParts)
        setKeyTable(keyTable + 1)
        if (code === 'UTLZ') {
          handleDevolution(false)
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const newItem = id => {
    setServiceOrderPartId(id)
    setKeyModal(keyModal + 1)
    setNewItemModal(true)
  }

  const confirmAction = (action, serviceOrderParts) => {
    let idMessage
    if (action === 'accept') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmAcceptSingular'
          : 'serviceOrder.serviceOrderParts.confirmAcceptPlural'
    } else if (action === 'purchase') {
      setPurchaseVisible(true)
      return
    } else if (action === 'reject') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmRejectSingular'
          : 'serviceOrder.serviceOrderParts.confirmRejectPlural'
    } else if (action === 'cancelReserve') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmCancelReserveSingular'
          : 'serviceOrder.serviceOrderParts.confirmCancelReservePlural'
    } else if (action === 'cancel') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmCancelSingular'
          : 'serviceOrder.serviceOrderParts.confirmCancelPlural'
    } else if (action === 'reserve') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmReserveSingular'
          : 'serviceOrder.serviceOrderParts.confirmReservePlural'
    } else if (action === 'request') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmRequestSingular'
          : 'serviceOrder.serviceOrderParts.confirmRequestPlural'
    } else if (action === 'reverse') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmReverseSingular'
          : 'serviceOrder.serviceOrderParts.confirmReversePlural'
    } else if (action === 'use') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmUseSingular'
          : 'serviceOrder.serviceOrderParts.confirmUsePlural'
    } else if (action === 'delete') {
      idMessage =
        serviceOrderParts.length === 1
          ? 'serviceOrder.serviceOrderParts.confirmDeleteSingular'
          : 'serviceOrder.serviceOrderParts.confirmDeletePlural'
    } else {
      return
    }

    confirm({
      title: formatMessage({
        id: idMessage,
      }),
      onOk: () => doAction(action, serviceOrderParts),
      okType: action === 'delete' ? 'danger' : '',
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

  const doAction = (action, serviceOrderParts) => {
    if (action === 'accept') {
      changeStatusServiceOrderPart(serviceOrderParts, 'PDIA')
    } else if (action === 'cancelReserve') {
      changeStatusServiceOrderPart(
        serviceOrderParts,
        software?.sigla === 'ESSF' ? 'SUGE' : 'PDIA',
      )
    } else if (action === 'purchase') {
      setPurchaseVisible(true)
    } else if (action === 'reject' || action === 'cancel') {
      changeStatusServiceOrderPart(serviceOrderParts, 'CANC')
    } else if (action === 'reserve') {
      handleReserve(serviceOrderParts)
    } else if (action === 'request') {
      changeStatusServiceOrderPart(serviceOrderParts, 'REQU')
    } else if (action === 'use') {
      changeStatusServiceOrderPart(serviceOrderParts, 'UTLZ')
    } else if (action === 'reverse') {
      reverseServiceOrderPart(serviceOrderParts)
    } else if (action === 'delete') {
      deleteServiceOrderPart(serviceOrderParts)
    }
  }

  const handleReserve = serviceOrderParts => {
    const count = serviceOrderParts.filter(
      x => x.quantity > x.quantityAvailable,
    )?.length
    if (!count) {
      changeStatusServiceOrderPart(serviceOrderParts, 'RESE')
      return
    }
    confirm({
      title:
        count === 1
          ? 'Item indisponível. Deseja considerá-lo faltante?'
          : 'Itens indisponíveis. Deseja considerá-los faltantes?',
      onOk: () => changeStatusServiceOrderPart(serviceOrderParts, 'RESE'),
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

  async function changeStatusServiceOrderPart(
    serviceOrderParts,
    actStatusCode,
  ) {
    setAlertMessages([])
    const status = statusSource.find(x => x.code === actStatusCode)
    if (!status) {
      message.error(
        formatMessage({
          id: 'serviceOrder.serviceOrderParts.statusNotFound',
        }),
      )
      return
    }
    setLoading(true)

    const changeStatusBody = {
      serviceOrderPart: [],
    }

    serviceOrderParts.map(record =>
      changeStatusBody.serviceOrderPart.push({
        serviceOrderPartId: record.serviceOrderPartId,
        actStatusId: status.id,
      }),
    )

    try {
      const response = await apiMaterialRequest({
        method: 'PUT',
        url: `/api/services/serviceOrderPartByStatus`,
        data: changeStatusBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getData(actStatusCode)
      } else {
        setAlertMessages(data.validationMessageList)
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  async function deleteServiceOrderPart(serviceOrderParts) {
    setAlertMessages([])
    setLoading(true)
    const serviceOrderPartBody = {
      serviceOrderPartIds: serviceOrderParts.map(
        record => record.serviceOrderPartId,
      ),
    }

    try {
      const response = await apiMaterialRequest({
        method: 'DELETE',
        url: `/api/services/serviceOrderPart`,
        data: serviceOrderPartBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getData()
      } else {
        setAlertMessages(data.validationMessageList)
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  async function reverseServiceOrderPart(serviceOrderParts) {
    setAlertMessages([])
    setLoading(true)
    const serviceOrderPartBody = {
      processId: getProcessId(),
      serviceOrderPartIds: serviceOrderParts.map(
        record => record.serviceOrderPartId,
      ),
    }

    try {
      const response = await apiMaterialRequest({
        method: 'PUT',
        url: `/api/services/reverseServiceOrderPart`,
        data: serviceOrderPartBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      const { data } = response

      if (data.isOk) {
        getData()
      } else {
        setAlertMessages(data.validationMessageList)
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const refreshGrid = () => {
    getServiceOrder()
    getData()
  }

  const handleDevolution = value => {
    if (data.find(x => x.actStatusCode === 'UTLZ' && !x.materialAvailable)) {
      Modal.warning({
        title: 'Item sem controle de indisponibilidade em estoque!',
        content:
          'Favor verificar quantidade disponível em estoque, devendo ser maior ou igual a quantidade aplicada nesse item. Após esse ajuste, editar novamente a OS para atualizar os dados.',
        width: 500,
      })
    } else {
      setManual(value)
      setModalDevolution(true)
      setKeyModalDevolution(keyModalDevolution + 1)
    }
  }

  return hasPermission(userPermissions, 'Visualize') ? (
    <div className="container">
      <React.Fragment>
        <RequiredDevolution
          modalVisible={modalDevolution}
          items={data || []}
          toogleModalVisible={() => setModalDevolution(false)}
          onChangeDevolution={() => getData()}
          canBeUpdated
          type="ServiceOrder"
          manual={manual}
          key={keyModalDevolution}
        />
      </React.Fragment>

      <PurchaseModal
        visible={purchaseVisible}
        setVisible={setPurchaseVisible}
        selectedRows={selectedRows}
        serviceOrderId={serviceOrderId}
        refreshGrid={() => getData()}
      />
      <NewItem
        newItemModal={newItemModal}
        setNewItemModal={setNewItemModal}
        key={keyModal}
        serviceOrderPartId={serviceOrderPartId}
        serviceOrderId={serviceOrderId}
        serviceOrder={serviceOrder}
        onChangeServiceOrderPart={() => getData()}
        userPermissions={userPermissions}
        software={software}
        screen={screen === 'CreateOS' ? 'CreateOS' : 'ItemOS'}
        createOSStatusId={actStatusId}
      />
      <Spin size="large" spinning={loading || loadingServiceOrder}>
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
          {alertMessages.length > 0 && (
            <Row type="flex" className="mb-2">
              <Col style={{ marginLeft: 'auto' }}>
                <span
                  role="button"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAlertMessages([])}
                  className="primary-color"
                >
                  <i className="mr-2 fa fa-eraser" />
                  {formatMessage({
                    id:
                      alertMessages.length === 1
                        ? 'serviceOrder.serviceOrderParts.clearMessage'
                        : 'serviceOrder.serviceOrderParts.clearMessages',
                  })}
                </span>
              </Col>
            </Row>
          )}
        </div>

        <ServiceOrderPartsHeader
          selectedRows={selectedRows}
          newItem={newItem}
          userPermissions={userPermissions}
          serviceOrder={serviceOrder}
          loading={loadingServiceOrder}
          statusSource={statusSource}
          confirmAction={confirmAction}
          refreshGrid={refreshGrid}
          serviceOrderId={serviceOrderId}
          data={data}
          software={software}
          handleDevolution={handleDevolution}
          isNegativeStock={isNegativeStock}
        />
        <ServiceOrderPartsTable
          data={data}
          rowSelection={rowSelection}
          keyTable={keyTable}
          newItem={newItem}
          serviceOrder={serviceOrder}
          userPermissions={userPermissions}
          confirmAction={confirmAction}
        />
        <ServiceOrderPartsFooter data={data} />
      </Spin>
    </div>
  ) : (
    <NoVisualize userPermissions={userPermissions} />
  )
}

ServiceOrderParts.propTypes = {
  match: PropTypes.object,
}

export default ServiceOrderParts
