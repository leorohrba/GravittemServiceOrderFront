import NewSimpleSearch from '@components/NewSimpleSearch'
import { hasPermission } from '@utils'
import { Button, Col, Dropdown, Menu, Row } from 'antd'
import moment from 'moment'
import React from 'react'
import ReactExport from 'react-data-export'
import { useAssetContext } from '../context/AssetContext'
import GenerateServiceOrderModal from '../modals/GenerateServiceOrderModal'
import PrintLabelModal from '../modals/PrintLabelModal'
import TagModal from '../modals/TagModal'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function AssetsHeader() {
  const {
    searchOptions,
    tags,
    setTags,
    startSearch,
    userPermissions,
    editAsset,
    dataExport,
    selectedRows,
    setVisiblePrintLabelModal,
    setVisibleTagModal,
    setVisibleGenerateSOModal,
  } = useAssetContext()

  const menu = (
    <Menu>
      <Menu.Item key="import">Importar</Menu.Item>
    </Menu>
  )

  return (
    <div>
      <TagModal />
      <PrintLabelModal />
      <GenerateServiceOrderModal />
      <Row type="flex" justify="end">
        <Col>
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            screenName="ativos_atendimentos"
            selectOptionsWidth={200}
          />
        </Col>
      </Row>
      <Row type="flex" className="my-5">
        {selectedRows.length === 0 ? (
          <div className="flex">
            {hasPermission(userPermissions, 'Include') && (
              <React.Fragment>
                <Button type="primary" onClick={() => editAsset(0)}>
                  Novo ativo
                </Button>
                <Dropdown className="ml-1" overlay={menu}>
                  <Button type="primary">
                    <i className="fa fa-chevron-down" />
                  </Button>
                </Dropdown>
              </React.Fragment>
            )}
          </div>
        ) : (
          <Row type="flex">
            <Button
              className="mr-2 iconButton"
              onClick={() => setVisibleTagModal(true)}
            >
              <i className="fa fa-tag fa-lg mr-3" />
              Tag ({selectedRows.length})
            </Button>
            <Button
              className="mr-2 iconButton"
              onClick={() => setVisiblePrintLabelModal(true)}
            >
              <i className="fa fa-print fa-lg mr-3" />
              Imprimir etiqueta ({selectedRows.length})
            </Button>
            <Button
              className="iconButton"
              onClick={() => setVisibleGenerateSOModal(true)}
            >
              <i className="fa fa-file-text-o fa-lg mr-3" />
              Gerar ordem de serviço ({selectedRows.length})
            </Button>
          </Row>
        )}
        <Col className="ml-auto">
          {hasPermission(userPermissions, 'ExportExcel') && (
            <ExcelFile
              filename={`Ativos_${moment().format('DD_MM_YYYY_HH_mm')}`}
              element={
                <Button
                  size="default"
                  style={{
                    marginLeft: 'auto',
                  }}
                  className="ml-2 iconButton"
                >
                  <i className="fa fa-download fa-lg mr-3" />
                  Exportar
                </Button>
              }
            >
              <ExcelSheet dataSet={dataExport} name="Ativos" />
            </ExcelFile>
          )}
        </Col>
        <Col>
          <Button className="iconButton ml-2">
            <i className="fa fa-ellipsis-v" />
          </Button>
        </Col>
      </Row>
    </div>
  )
}
