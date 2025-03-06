import { Form } from '@ant-design/compatible'
import {
  apiAttendance,
  apiAttachment,
  apiLog,
  apiService,
  apiFinancial,
} from '@services/api'
import { handleAuthError, showApiNotifications } from '@utils'
import { Button, Divider, message, Modal, Row, Steps } from 'antd'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import ImportExcelStep1 from './ImportExcelModalStep1'
import ImportExcelStep2 from './ImportExcelModalStep2'
import ImportExcelStep3 from './ImportExcelModalStep3'
import { getServiceUtils } from '@utils/services'

const { Step } = Steps

function ImportExcel({
  documentId,
  form,
  visibleModal,
  setVisibleModal,
  refreshData,
  screenType = 'standard',
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [fileList, setFileList] = useState([])
  const [replaceFile, setReplaceFile] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isBackground, setIsBackground] = useState(false)
  const [interfaceLogTypes, setInterfaceLogTypes] = useState(null)
  const [selectedValue, setSelectedValue] = useState(null)
  const [isImporting, setIsImporting] = useState(false)
  const messageError = () => message.error('Erro ao fazer upload dos arquivos.')

  function importFile() {
    form.validateFieldsAndScroll(async err => {
      if (!err) {
        setUploading(true)
        setCurrentStep(currentStep + 1)
      }
      const idGerado = selectedValue
        ? await getIdGeradoLogInicializar(selectedValue?.nome)
        : await getIdGeradoLogInicializar()
      await postAnexoEntidadeId(idGerado)
      if (screenType == 'standard') postProcessImportSpreadsheet(idGerado)
      else postProcessImportSpreadsheet(idGerado, 'ImportacaoPlanoContas')
    })
  }

  async function postProcessImportSpreadsheet(idGerado, nomeInterface = null) {
    try {
      setIsImporting(true)
      let response = null

      if (nomeInterface == null) {
        response = await apiService.post(`/api/ImportarPlanilha`, {
          logInicializacaoId: idGerado,
        })
      } else {
        response = await apiFinancial.post(`/api/Planilha/ImportarPlanilha`, {
          logInicializacaoId: idGerado,
          nomeInterface: nomeInterface,
        })
      }

      const { data } = response
      if (data.isOk) {
        message.success('Importação realizada com sucesso!')
      } else {
        messageError()
      }
      setIsImporting(false)
    } catch (error) {
      messageError()
      setIsImporting(false)
    }
  }

  async function postAnexoEntidadeId(idGerado) {
    const body = new FormData()
    fileList.forEach(file => body.append('file', file))

    try {
      const response = await apiAttachment.post(`/api/Anexo/${idGerado}`, body)
      const { data } = response
      if (data.isOk) {
        message.success('Upload realizado com sucesso!')
      } else {
        showApiNotifications(data)
      }
    } catch (error) {
      messageError()
    }
  }

  async function getIdGeradoLogInicializar(logType = 'ImportacaoClear') {
    setIsSaving(true)

    try {
      const body = {
        InterfaceLogNome: logType,
      }
      const response = await apiLog.post('/api/Log/Inicializar', body)
      const { data } = response

      setIsSaving(false)

      if (!isBackground && refreshData !== undefined) {
        refreshData()
      }

      if (data.isOk) {
        return data.idGerado
      } else {
        showApiNotifications(data)
        return null
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
      return null
    }
  }

  async function downloadFile() {
    setIsDownloading(true)

    let documentIdOptions = documentId

    if (screenType !== 'standard') {
      switch (selectedValue?.nome) {
        case 'ImportacaoPlanoContas':
          documentIdOptions = 6
          break
        default:
          documentIdOptions = null
          setSelectedValue(null)
          setIsDownloading(false)
          break
      }
    }

    if (documentIdOptions === null) {
      message.error('Tipo de modelo não encontrado!')
      return
    }

    try {
      const response = await apiAttendance({
        url: `/api/downloadTemplate`,
        method: 'GET',
        params: {
          documento: documentIdOptions,
        },
        responseType: 'blob', // important
      })

      setIsDownloading(false)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const contentDisposition = response.headers['content-disposition']
      const fileName =
        getFileName(contentDisposition) || 'Modelo importação.xlsx'
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      setIsDownloading(false)
      handleAuthError(error)
    }
  }

  function getFileName(contentDisposition) {
    let fileName = contentDisposition.substring(
      contentDisposition.indexOf("''") + 2,
      contentDisposition.length,
    )
    fileName = decodeURI(fileName).replace(/\+/g, ' ')
    return fileName
  }

  useEffect(() => {
    if (screenType != 'standard') {
      getServiceUtils(
        '/api/InterfaceLog',
        setInterfaceLogTypes,
        null,
        apiLog,
        null,
        {
          cargaDados: true,
        },
      )
    }
  }, [])

  return (
    <Modal
      title="Importar planilha"
      width="40%"
      centered
      visible={visibleModal}
      onCancel={() => {
        if (!isImporting) {
          setVisibleModal(false)
        }
      }}
      footer={
        !uploading ? (
          <Row type="flex">
            {currentStep === 0 ? (
              <Button onClick={() => setVisibleModal(false)}>
                {formatMessage({ id: 'cancelButton' })}
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                <i className="fa fa-chevron-left mr-3" aria-hidden="true" />
                Voltar uma etapa
              </Button>
            )}
            {currentStep !== 2 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  screenType == 'standard'
                    ? fileList.length === 0 && currentStep === 1
                    : fileList.length === 0 && !(selectedValue != null)
                }
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  marginLeft: 'auto',
                }}
              >
                {formatMessage({ id: 'continueButton' })}
                <i className="fa fa-chevron-right ml-3" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  marginLeft: 'auto',
                }}
                onClick={() => importFile()}
              >
                {screenType == 'standard'
                  ? 'Importar e criar ordem de serviço'
                  : 'Importar e criar'}
              </Button>
            )}
          </Row>
        ) : (
          <Button onClick={() => setVisibleModal(false)} disabled={isImporting}>
            Sair
          </Button>
        )
      }
    >
      <Steps current={currentStep}>
        <Step Preencha o modelo />
        <Step Selecionar arquivo />
        <Step
          title={
            screenType == 'standard'
              ? 'Criar ordem de serviço'
              : 'Processar planilha'
          }
        />
      </Steps>
      <Divider />
      {currentStep === 0 ? (
        <ImportExcelStep1
          {...{
            downloadFile,
            isDownloading,
            interfaceLogTypes,
            setSelectedValue,
            selectedValue,
            screenType,
          }}
        />
      ) : currentStep === 1 ? (
        <ImportExcelStep2
          {...{
            replaceFile,
            setReplaceFile,
            fileList,
            setFileList,
          }}
        />
      ) : (
        <ImportExcelStep3
          {...{
            uploading,
            form,
            isSaving,
            isBackground,
            setIsBackground,
            isImporting,
          }}
        />
      )}
    </Modal>
  )
}

ImportExcel.propTypes = {
  form: PropTypes.any,
  setVisibleModal: PropTypes.func,
  visibleModal: PropTypes.bool,
  refreshData: PropTypes.func,
  isBackground: PropTypes.bool,
  documentId: PropTypes.number,
}

const WrappedImportExcel = Form.create()(ImportExcel)
export default WrappedImportExcel
