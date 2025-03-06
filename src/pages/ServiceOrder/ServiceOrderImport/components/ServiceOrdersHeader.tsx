import React from 'react'
import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Col, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import ImportExcelModal from '@components/modals/ImportExcelModal'
import { useServiceOrderContext } from '../context/ServiceOrderContext'

const ServiceOrdersHeader = () => {
  const {
    loadingSearchOptions,
    tags,
    setTags,
    startSearch,
    searchOptions,
    viewImportSpreadsheet,
    setViewImportSpreadsheet,
    keyModal,
    setKeyModal,
    screenType,
    canInclude,
  } = useServiceOrderContext()

  async function handleSpreadsheetClick() {
    setViewImportSpreadsheet(true)
    setKeyModal(keyModal + 1)
  }

  return (
    <div className="pb-3">
      <ImportExcelModal
        visibleModal={viewImportSpreadsheet}
        setVisibleModal={setViewImportSpreadsheet}
        key={keyModal}
        documentId={2}
        screenType={screenType}
      />
      <Row type="flex" justify="end">
        <Col>
          <Spin spinning={loadingSearchOptions}>
            <NewSimpleSearch
              searchOptions={searchOptions}
              setTags={setTags}
              tags={tags}
              startSearch={startSearch}
              screenName="ordemServico"
            />
          </Spin>
        </Col>
      </Row>
      {canInclude && (
        <Row>
          <Col>
            <Button type="primary" onClick={() => handleSpreadsheetClick()}>
              Selecionar planilha
            </Button>
          </Col>
        </Row>
      )}
    </div>
  )
}

ServiceOrdersHeader.propTypes = {
  selectedRows: PropTypes.any,
  startSearch: PropTypes.func,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
  setTags: PropTypes.func,
  tags: PropTypes.array,
  searchOptions: PropTypes.array,
}

export default ServiceOrdersHeader
