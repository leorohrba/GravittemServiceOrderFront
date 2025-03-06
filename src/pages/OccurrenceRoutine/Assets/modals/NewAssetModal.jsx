/**
 * breadcrumb: Cadastro do ativo
 */
import { Form } from '@ant-design/compatible'
import { apiAttendance } from '@services/api'
import {
  fieldsValidationToast,
  handleAuthError,
  hasPermission,
  showApiMessages,
} from '@utils'
import { Alert, Button, Col, message, Modal, Row, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewAssetForm from '../detail/components/NewAssetForm'

function NewAssetModal(props) {
  const {
    form,
    assetId,
    refreshData,
    newAssetModal,
    setNewAssetModal,
    defaultCustomer,
    userPermissions,
    disableCustomer,
  } = props

  const [editData, setEditData] = useState(null)
  const [alertMessages, setAlertMessages] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [emptyReasonSource, setEmptyReasonSource] = useState([])
  const [customerSource, setCustomerSource] = useState([])
  const [productSource, setProductSource] = useState([])
  const refCustomer = React.useRef()
  const ref = React.useRef()

  useEffect(() => {
    setCanBeUpdated(hasPermission(userPermissions, 'Alterar'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    form.resetFields()
    if (!editData && !assetId && defaultCustomer) {
      form.setFieldsValue({ customerId: defaultCustomer.id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    if (
      !loading &&
      canBeUpdated &&
      refCustomer.current &&
      !form.getFieldValue('customerId') &&
      !assetId &&
      newAssetModal
    ) {
      try {
        refCustomer.current.focus()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, canBeUpdated])

  function refreshForm() {
    if (assetId) {
      getAsset()
    } else {
      if (defaultCustomer) {
        setCustomerSource([defaultCustomer])
        form.setFieldsValue({ customerId: defaultCustomer.id })
      }
      setEditData(null)
      getEmptyReason()
    }
  }

  async function getAsset() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtivo`,
        data: { id: [assetId] },
      })
      const { data } = response
      if (data.isOk && data.ativo.length > 0) {
        const asset = data.ativo[0]
        setCustomerSource([
          {
            id: asset.idCliente,
            name: asset.nomeCliente,
            document: asset.cpfCnpjFormatado,
            personType: asset.tipoPessoa,
          },
        ])

        if (asset.idProduto) {
          setProductSource([
            {
              id: asset.idProduto,
              description: asset.descricaoProduto,
              code: asset.codigoProduto,
            },
          ])
        } else {
          setProductSource([])
        }

        setEditData(asset)
        const emptyReason = asset.idNumeroSerieNaoInformado
          ? {
              id: asset.idNumeroSerieNaoInformado,
              descricao: asset.descricaoNumeroSerieNaoInformado,
            }
          : null
        getEmptyReason(emptyReason)
      } else if (data.isOk && data.ativo.length === 0) {
        message.error('Ativo não encontrado!')
        setNewAssetModal(false)
      } else {
        setLoading(false)
        showApiMessages(data)
        setNewAssetModal(false)
      }
    } catch (error) {
      handleAuthError(error)
      setNewAssetModal(false)
    }
  }

  async function getEmptyReason(emptyReason) {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/NumeroSerieNaoInformado`,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        const source = data.numeroSerieNaoInformado
        if (emptyReason && source.findIndex(x => x.id === emptyReason.id) < 0) {
          source.push(emptyReason)
        }
        setEmptyReasonSource(source)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  function handleSave() {
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveAsset()
      } else if (err) {
        fieldsValidationToast(err)
      }
    })
  }

  async function saveAsset() {
    setIsSaving(true)
    setLoading(true)

    const assetBody = {
      id: assetId || 0,
      idCliente: form.getFieldValue('customerId'),
      idProduto: form.getFieldValue('isProductManual')
        ? null
        : form.getFieldValue('productId'),
      descricaoProduto: form.getFieldValue('isProductManual')
        ? form.getFieldValue('productDescription')
        : null,
      identificacao: form.getFieldValue('identification'),
      versao: form.getFieldValue('version'),
      dataCompra: form.getFieldValue('purchaseDate')
        ? form.getFieldValue('purchaseDate').format('YYYY-MM-DD')
        : null,
      numeroSerie: form.getFieldValue('serialNumber'),
      idNumeroSerieNaoInformado: form.getFieldValue('serialNumber')
        ? 0
        : form.getFieldValue('emptyReason') || 0,
      numeroNotaFiscal: form.getFieldValue('invoiceNumber'),
      dataInstalacao: form.getFieldValue('installationDate')
        ? form.getFieldValue('installationDate').format('YYYY-MM-DD')
        : null,
      ativo: form.getFieldValue('status'),
    }
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/Ativo`,
        data: assetBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        assetBody.id = parseInt(data.idGerado, 10)
        if (!form.getFieldValue('isProductManual')) {
          const product = productSource.find(
            x => x.id === form.getFieldValue('productId'),
          )
          if (product) {
            assetBody.descricaoProduto = product.description
          }
        }
        refreshData(assetBody)
        setNewAssetModal(false)
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      handleAuthError(error)
    }
  }

  return (
    <Modal
      title={
        !assetId
          ? 'Novo ativo'
          : canBeUpdated
          ? 'Editar ativo'
          : 'Consultar ativo'
      }
      width={900}
      visible={newAssetModal}
      centered
      destroyOnClose
      onCancel={() => setNewAssetModal(false)}
      footer={
        <Row type="flex" gutter={16}>
          <Col>
            {canBeUpdated && (!loading || (loading && isSaving)) && (
              <Button
                loading={isSaving}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                }}
                onClick={() => handleSave()}
              >
                {formatMessage({ id: 'saveButton' })}
              </Button>
            )}
          </Col>

          <Col className="ml-auto">
            <Button type="secondary" onClick={() => setNewAssetModal(false)}>
              {formatMessage({ id: 'cancelButton' })}
            </Button>
          </Col>
        </Row>
      }
    >
      <Skeleton
        loading={loading && !isSaving}
        paragraph={{ rows: 13 }}
        active
      />

      <div style={{ display: loading && !isSaving ? 'none' : 'block' }}>
        <Spin size="large" spinning={loading}>
          <div ref={ref}>
            {alertMessages.map((message, index) => (
              <Alert
                type="error"
                message={message.mensagem}
                key={index}
                showIcon
                className="mb-2"
              />
            ))}
          </div>
          <NewAssetForm
            form={form}
            canBeUpdated={canBeUpdated}
            ref={refCustomer}
            editData={editData}
            customerSource={customerSource}
            setCustomerSource={setCustomerSource}
            productSource={productSource}
            setProductSource={setProductSource}
            emptyReasonSource={emptyReasonSource}
            newAssetModal={newAssetModal}
            refreshForm={refreshForm}
            disableCustomer={disableCustomer}
            loading={loading}
            assetId={assetId}
          />
        </Spin>
      </div>
    </Modal>
  )
}

NewAssetModal.propTypes = {
  form: PropTypes.any,
  disableCustomer: PropTypes.bool,
  assetId: PropTypes.number,
  refreshData: PropTypes.func,
  newAssetModal: PropTypes.bool,
  setNewAssetModal: PropTypes.func,
  defaultCustomer: PropTypes.any,
  userPermissions: PropTypes.array,
}

const WrappedNewAsset = Form.create()(NewAssetModal)
export default WrappedNewAsset
