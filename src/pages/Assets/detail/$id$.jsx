/**
 * breadcrumb: Cadastro do ativo
 */
import { apiAttendance } from '@services/api'
import {
  fieldsValidationToast,
  getPermissions,
  handleAuthError,
  hasPermission,
  showApiMessages,
} from '@utils'
import { Alert, Form, message, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import { withWrapper } from 'with-wrapper'
import NewAssetFooter from './components/NewAssetFooter'
import NewAssetForm from './components/NewAssetForm'
import NewAssetHeader from './components/NewAssetHeader'
import { NewAssetProvider, useNewAssetContext } from './context/NewAssetContext'

function NewAsset({ match }) {
  const {
    userPermissions,
    setUserPermissions,
    editData,
    setEditData,
    assetId,
    setAssetId,
    setCanBeUpdated,
    loading,
    setLoading,
    setCustomerSource,
    setProductSource,
    setEmptyReasonSource,
    alertMessages,
    setAlertMessages,
    setIsSaving,
    ref,
    tags,
  } = useNewAssetContext()
  const [form] = Form.useForm()

  useEffect(() => {
    setCanBeUpdated(hasPermission(userPermissions, 'Alter'))
  }, [userPermissions])

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    setAssetId(
      match.params.id && !isNaN(match.params.id)
        ? parseInt(match.params.id, 10)
        : null,
    )
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
        router.push('/Assets')
      } else {
        setLoading(false)
        showApiMessages(data)
        router.push('/Assets')
      }
    } catch (error) {
      handleAuthError(error)
      router.push('/Assets')
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
    form
      .validateFields()
      .then(values => {
        const assetBody = {
          id: assetId || 0,
          idCliente: values.cliente,
          idProduto: values.produto,
          versao: values.versao,
          dataCompra: values.dataCompra
            ? values.dataCompra.format('YYYY-MM-DD')
            : null,
          garantia: values.garantia,
          numeroSerie: values.numeroSerie,
          idNumeroSerieNaoInformado: values.numeroSerie
            ? 0
            : values.numeroSerieNaoInformado || 0,
          numeroNotaFiscal: values.numeroNotaFiscal,
          identificacao: values.identificacao,
          patrimonio: values.patrimonio,
          dataInstalacao: values.dataInstalacao
            ? values.dataInstalacao.format('YYYY-MM-DD')
            : null,
          status: values.status,
          motivo: values.motivo,
          tags,
        }

        saveAsset(assetBody)
      })
      .catch(err => fieldsValidationToast(err))
  }

  async function saveAsset(assetBody) {
    setIsSaving(true)
    setLoading(true)

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
        router.push('/Assets')
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
      <Spin size="large" spinning={loading}>
        <NewAssetHeader />
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
        <NewAssetForm {...{ form }} />
        <NewAssetFooter {...{ handleSave }} />
      </Spin>
    </div>
  )
}

NewAsset.propTypes = {
  match: PropTypes.object,
}

export const WrapperNewAsset = withWrapper((element, props) => (
  <NewAssetProvider>{element}</NewAssetProvider>
))(props => {
  const { match } = props
  return <NewAsset {...{ match }} />
})

export default WrapperNewAsset
