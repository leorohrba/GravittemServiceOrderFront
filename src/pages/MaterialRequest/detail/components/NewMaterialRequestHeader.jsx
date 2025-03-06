import Button from '@components/Button'
import { hasPermission } from '@utils'
import { Col, Row, Modal, Tooltip } from 'antd'
import { PropTypes } from 'prop-types'
import React, { useState } from 'react'
import router from 'umi/router'
import { formatMessage } from 'umi-plugin-react/locale'
import { exportExcel } from '@utils/export'

const { confirm } = Modal

export function NewMaterialRequestHeader({
  isSaving,
  sequenceNumber,
  userPermissions,
  formChanged,
  dataExport,
  loading,
  printRequest,
  canBeUpdated,
  doDevolution,
  canBeReturned,
  requestItems,
  handleSubmit,
  screenConfig,
  tableSearchQuery,
  simpleSearchQuery,
  tags,
}) {
  const [loadingExportData, setLoadingExportData] = useState(false)
  const title = isSavingForm => (isSavingForm ? 'Salvando...' : 'Carregando...')

  const show = () =>
    confirm({
      title: formatMessage({
        id: 'globalComponents.confirmModal.saveChanges',
      }),
      content: formatMessage({
        id: 'globalComponents.confirmModal.loseChangesWithoutSave',
      }),
      onOk: () => handleSubmit(null, false, false),
      onCancel: () => router.push('/MaterialRequest'),
      cancelText: formatMessage({
        id: 'globalComponents.confirmModal.no',
      }),
      okText: formatMessage({
        id: 'globalComponents.confirmModal.yes',
      }),
      okButtonProps: { size: 'large' },
      cancelButtonProps: { size: 'large' },
    })
  const exportTableData = async (isExcel = false) => {
    setLoadingExportData(true)
    const exportData = dataExport
    if (isExcel) {
      const nome = 'Detalhe da requisição'

      const colunas = [
        { label: 'Código', value: 'itemCode' },
        { label: 'Descrição', value: 'itemDescription' },
        { label: 'Quantidade requisitada', value: 'quantityRequested' },
        { label: 'Quantidade aplicada', value: 'quantityApplied' },
        { label: 'Valor unitário', value: 'unitValue' },
        { label: 'Estoque', value: 'stockLocationDescription' },
        { label: 'Endereço', value: 'stockAddress' },
        { label: 'Status', value: 'actStatusDescription' },
        { label: 'Motivo do Statusa', value: 'actReasonDescription' },
        { label: 'Documento origem', value: 'sequenceNumber' },
        { label: 'Titular', value: 'customerName' },
        { label: 'Quantidade devolvida', value: 'quantityReturned' },
        { label: 'Observação devolução', value: 'observationReturned' },
      ]
      const nomeArquivo = 'requisição'
      exportExcel(
        nome,
        '',
        colunas,
        requestItems,
        nomeArquivo,
        setLoadingExportData,
      )
    }
    setLoadingExportData(false)
    return exportData
  }

  return (
    <React.Fragment>
      <Row type="flex" className="mb-4" align="middle">
        <Col>
          <span
            style={{
              color: '#1976D2',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (canBeUpdated && formChanged) {
                show()
              } else {
                router.push('/MaterialRequest')
              }
            }}
            role="button"
          >
            Requisições
          </span>
          <i className="mx-3 fa fa-angle-right" />
          {loading ? (
            title(isSaving)
          ) : sequenceNumber ? (
            <span>
              {`${canBeUpdated ? 'Editar' : 'Consultar'} requisição nº `}
              <b>{sequenceNumber}</b>
            </span>
          ) : (
            'Nova requisição'
          )}
        </Col>
        <Col style={{ marginLeft: 'auto' }}>
          {hasPermission(userPermissions, 'Alter') &&
            canBeReturned &&
            !loading &&
            requestItems.find(
              x => x.actStatusCode === 'APLI' && x.returnRequired,
            ) && (
              <Tooltip title="Fazer devolução">
                <Button
                  shape="circle"
                  size="default"
                  type="primary"
                  ghost
                  className="iconButton mr-2 px-2"
                  onClick={e => doDevolution(e)}
                >
                  <i className="fa fa-wrench mr-2" style={{ color: 'gray' }} />
                  Devolução
                </Button>
              </Tooltip>
            )}
          {hasPermission(userPermissions, 'ExportarParaExcel') && (
            <React.Fragment>
              {dataExport && dataExport.length > 0 && !formChanged ? (
                <Tooltip title="Exportar requisição">
                  <Button
                    shape="circle"
                    size="default"
                    type="primary"
                    ghost
                    onClick={() => exportTableData(true)}
                    className="iconButton mr-2"
                  >
                    <i className="fa fa-download" style={{ color: 'gray' }} />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Exportar requisição">
                  <Button
                    shape="circle"
                    size="default"
                    type="primary"
                    ghost
                    disabled={loading || loadingExportData}
                    className="iconButton mr-2"
                    onClick={e =>
                      Modal.info({
                        title:
                          'É necessário salvar a requisição antes de exportar!',
                      })
                    }
                  >
                    <i className="fa fa-download" style={{ color: 'gray' }} />
                  </Button>
                </Tooltip>
              )}
            </React.Fragment>
          )}
          {hasPermission(userPermissions, 'Imprimir') && (
            <Tooltip title="Imprimir requisição">
              <Button
                shape="circle"
                size="default"
                type="primary"
                ghost
                disabled={loading}
                className="iconButton"
                onClick={e => printRequest(e)}
              >
                <i className="fa fa-print" style={{ color: 'gray' }} />
              </Button>
            </Tooltip>
          )}
        </Col>
      </Row>
    </React.Fragment>
  )
}

NewMaterialRequestHeader.propTypes = {
  isSaving: PropTypes.bool,
  sequenceNumber: PropTypes.number,
  userPermissions: PropTypes.array,
  formChanged: PropTypes.bool,
  dataExport: PropTypes.array,
  loading: PropTypes.bool,
  printRequest: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  doDevolution: PropTypes.func,
  canBeReturned: PropTypes.bool,
  requestItems: PropTypes.array,
  handleSubmit: PropTypes.func,
}
