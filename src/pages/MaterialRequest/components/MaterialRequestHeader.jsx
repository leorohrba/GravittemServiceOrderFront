import Button from '@components/Button'
import SimpleSearch from '@components/SimpleSearch'
import { hasPermission } from '@utils'
import { Col, Row } from 'antd'
import { PropTypes } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import Link from 'umi/link'

export default function MaterialRequestHeader({
  selectedRows,
  userPermissions,
  searchOptions,
  startSearch,
  setSearchValues,
  confirmApplyRequest,
  confirmSeparateRequest,
  loading,
  dataExport,
  printRequest,
}) {
  const [enableSeparate, setEnableSeparate] = useState([])
  const [enableApply, setEnableApply] = useState([])
  // const [loadingExportData, setLoadingExportData] = useState(false)
  // const [enableDelete, setEnableDelete] = useState([])

  // const exportTableData = async (isExcel = false) => {
  //   setLoadingExportData(true)
  //   const exportData = dataExport
  //   if (isExcel) {
  //     const nome = 'Requisição'

  //     const colunas = [
  //       { label: 'Número', value: 'sequenceNumber' },
  //       {
  //         label: 'Solicitante',
  //         value: 'requesterName',
  //       },
  //       {
  //         label: 'Data inicial',
  //         value: 'initialDate',
  //       },
  //       { label: 'Data final', value: 'finalDate' },
  //       {
  //         label: 'Status',
  //         value: 'actStatusDescription',
  //       },
  //     ]
  //     const nomeArquivo = 'requisição'
  //     exportExcel(
  //       nome,
  //       'filtros',
  //       colunas,
  //       selectedRows,
  //       nomeArquivo,
  //       setLoadingExportData,
  //     )
  //   }
  //   setLoadingExportData(false)
  //   return exportData
  // }

  useEffect(() => {
    setEnableSeparate(
      selectedRows.filter(x => x.canBeUpdated && x.actStatusCode === 'PEND'),
    )
    setEnableApply(
      selectedRows.filter(
        x =>
          x.canBeUpdated &&
          (x.actStatusCode === 'PEND' || x.actStatusCode === 'SEPA'),
      ),
    )
    // setEnableDelete(selectedRows.filter(x => x.canBeDeleted))
  }, [selectedRows])

  return (
    <React.Fragment>
      <Row>
        <Col
          style={{
            marginLeft: 'auto',
            width: '530px',
          }}
        >
          <SimpleSearch
            searchOptions={searchOptions}
            fixedTypeWidth={200}
            startSearch={startSearch}
            setSearchValues={setSearchValues}
          />
        </Col>
      </Row>
      <div className="mb-5">
        {selectedRows.length === 0 ? (
          <React.Fragment>
            {hasPermission(userPermissions, 'Include') && (
              <Link to="materialRequest/detail">
                <Button size="default" type="primary">
                  <i className="fa fa-plus fa-lg mr-3" />
                  {formatMessage({
                    id: 'materialRequest.index.newRequest',
                  })}
                </Button>
              </Link>
            )}
          </React.Fragment>
        ) : (
          <div>
            {hasPermission(userPermissions, 'SepararItem') &&
              enableSeparate.length === selectedRows.length && (
                <Button
                  size="default"
                  className="mr-3"
                  quantity={enableSeparate.length}
                  onClick={() => confirmSeparateRequest()}
                  loading={loading}
                  disabled={loading}
                  id="button-separate-item"
                  style={{ color: 'blue', borderColor: 'blue' }}
                >
                  {formatMessage({
                    id: 'materialRequest.NewMaterialRequisition.separate',
                  })}
                </Button>
              )}
            {hasPermission(userPermissions, 'AplicarItem') &&
              enableApply.length === selectedRows.length && (
                <Button
                  size="default"
                  className="mr-3"
                  quantity={enableApply.length}
                  onClick={() => confirmApplyRequest()}
                  loading={loading}
                  disabled={loading}
                  id="button-separate-item"
                  style={{ color: '#00CCEE', borderColor: '#00CCEE' }}
                >
                  Aplicar
                </Button>
              )}
            {hasPermission(userPermissions, 'Imprimir') && (
              <Button
                size="default"
                className="mr-3"
                disabled={loading}
                loading={loading}
                onClick={() => printRequest()}
                quantity={selectedRows.length}
                id="button-delete-item"
              >
                <i className="fa fa-print fa-lg mr-3" />
                Imprimir
              </Button>
            )}
            {/* {hasPermission(userPermissions, 'ExportarParaExcel') && (
              <Button
                size="default"
                className="mr-3"
                disabled={loading || loadingExportData}
                loading={loading || loadingExportData}
                quantity={selectedRows.length}
                onClick={() => exportTableData(true)}
                id="button-export-item"
              >
                <i className="fa fa-download fa-lg mr-3" />
                {formatMessage({
                  id: 'materialRequest.NewMaterialRequisition.export',
                })}
              </Button>
            )} */}
            {/*
              {hasPermission(userPermissions, 'Exclude') &&
                enableDelete.length === selectedRows.length && (
                  <Button
                    size="default"
                    disabled={loading}
                    loading={loading}
                    onClick={() => confirmDeleteRequest()}
                    quantity={selectedRows.length}
                    id="button-delete-item"
                  >
                    <i className="fa fa-trash fa-lg mr-3" />
                    {formatMessage({
                      id: 'materialRequest.NewMaterialRequisition.delete',
                    })}
                  </Button>
              )}
              */}
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

MaterialRequestHeader.propTypes = {
  selectedRows: PropTypes.array,
  userPermissions: PropTypes.array,
  searchOptions: PropTypes.array,
  startSearch: PropTypes.func,
  setSearchValues: PropTypes.func,
  confirmApplyRequest: PropTypes.func,
  confirmSeparateRequest: PropTypes.func,
  loading: PropTypes.bool,
  dataExport: PropTypes.array,
  printRequest: PropTypes.func,
}
