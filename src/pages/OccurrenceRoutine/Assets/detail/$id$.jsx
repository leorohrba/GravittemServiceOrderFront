/**
 * breadcrumb: Cadastro do ativo
 */
import { Form } from '@ant-design/compatible'
import { apiAttendance } from '@services/api'
import {
  fieldsValidationToast,
  getPermissions,
  handleAuthError,
  hasPermission,
  showApiMessages,
} from '@utils'
import { Alert, message, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import AdditionalWarrantyModal from '../modals/AdditionalWarrantyModal'
import AssetAddressModal from '../modals/AssetAddressModal'
import InstallerModal from '../modals/InstallerModal'
import LinkAssetsModal from '../modals/LinkAssetsModal'
import PostageModal from '../modals/PostageModal'
import PrintLabel from '../modals/PrintLabel'
import ResellerModal from '../modals/ResellerModal'
import ServiceOrderModal from '../modals/ServiceOrderModal'
import NewAssetFooter from './components/NewAssetFooter'
import NewAssetForm from './components/NewAssetForm'
import NewAssetHeader from './components/NewAssetHeader'

function NewAsset({ match, form }) {
  const [editData, setEditData] = useState(null)
  const [alertMessages, setAlertMessages] = useState([])
  const [assetId] = useState(
    match.params.id && !isNaN(match.params.id)
      ? parseInt(match.params.id, 10)
      : null,
  )
  const [userPermissions, setUserPermissions] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [emptyReasonSource, setEmptyReasonSource] = useState([])
  const [customerSource, setCustomerSource] = useState([])
  const [productSource, setProductSource] = useState([])
  const refCustomer = React.useRef()
  const ref = React.useRef()

  useEffect(() => {
    setCanBeUpdated(hasPermission(userPermissions, 'Alter'))
  }, [userPermissions])

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])


  useEffect(() => {
    setPermissions()
    if (assetId) {
      getAsset()
    } else {
      setEditData(null)
      getEmptyReason()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
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
        setCustomerSource([
          {
            id: data.ativo[0].idCliente,
            name: data.ativo[0].nomeCliente,
            document: data.ativo[0].cpfCnpjFormatado,
            personType: data.ativo[0].tipoPessoa,
          },
        ])

        if (data.ativo[0].idProduto) {
          setProductSource([
            {
              id: data.ativo[0].idProduto,
              description: data.ativo[0].descricaoProduto,
              code: data.ativo[0].codigoProduto,
            },
          ])
        } else {
          setProductSource([])
        }

        setEditData(data.ativo[0])
        const emptyReason = data.ativo[0].idNumeroSerieNaoInformado
          ? {
              id: data.ativo[0].idNumeroSerieNaoInformado,
              descricao: data.ativo[0].descricaoNumeroSerieNaoInformado,
            }
          : null
        getEmptyReason(emptyReason)
      } else if (data.isOk && data.ativo.length === 0) {
        message.error('Ativo não encontrado!')
        router.push('/occurrenceRoutine/Assets')
      } else {
        setLoading(false)
        showApiMessages(data)
        router.push('/occurrenceRoutine/Assets')
      }
    } catch (error) {
      handleAuthError(error)
      router.push('/occurrenceRoutine/Assets')
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
        router.push('/occurrenceRoutine/Assets')
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
    <div className="container">
      <InstallerModal />
      <ResellerModal />
      <PrintLabel />
      <ServiceOrderModal />
      <AssetAddressModal />
      <PostageModal />
      <LinkAssetsModal />
      <AdditionalWarrantyModal />
      <Spin size="large" spinning={loading}>
        <NewAssetHeader
          isSaving={isSaving}
          loading={loading}
          assetId={assetId}
          canBeUpdated={canBeUpdated}
        />

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
        />
        <NewAssetFooter
          handleSave={handleSave}
          isSaving={isSaving}
          canBeUpdated={canBeUpdated}
          loading={loading}
        />
      </Spin>
    </div>
  )
}

NewAsset.propTypes = {
  form: PropTypes.any,
  match: PropTypes.object,
}

const WrappedNewAsset = Form.create()(NewAsset)
export default WrappedNewAsset
