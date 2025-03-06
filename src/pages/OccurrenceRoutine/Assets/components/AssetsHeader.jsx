import NewSimpleSearch from '@components/NewSimpleSearch'
import { hasPermission } from '@utils'
import { Button, Col, Row } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import ReactExport from 'react-data-export'
import { formatMessage } from 'umi-plugin-react/locale'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function AssetsHeader({
  selectedRows,
  confirmDeleteAssets,
  editAsset,
  userPermissions,
  startSearch,
  tags,
  setTags,
  dataExport,
  searchOptions,
}) {
  return (
    <div>
      <Row type="flex" justify="end">
        <Col>
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            screenName="ativos_atendimentos"
          />
        </Col>
      </Row>
      <Row type="flex" className="my-5">
        {selectedRows.length === 0 ? (
          <div>
            {hasPermission(userPermissions, 'Include') && (
              <Button type="primary" onClick={() => editAsset(0)}>
                <i className="fa fa-plus fa-lg mr-3" />
                {formatMessage({
                  id: 'occurrenceRoutine.assets.newAsset',
                })}
              </Button>
            )}
          </div>
        ) : (
          <div>
            {hasPermission(userPermissions, 'Exclude') && (
              <Button
                style={{
                  color: 'red',
                  borderColor: 'red',
                }}
                onClick={confirmDeleteAssets}
              >
                <i className="fa fa-trash fa-lg mr-3" />
                {formatMessage({
                  id: 'delete',
                })}{' '}
                ({selectedRows.length})
              </Button>
            )}
          </div>
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
                  {formatMessage({
                    id: 'export',
                  })}
                </Button>
              }
            >
              <ExcelSheet dataSet={dataExport} name="Ativos" />
            </ExcelFile>
          )}
        </Col>
      </Row>
    </div>
  )
}
AssetsHeader.propTypes = {
  confirmDeleteAssets: PropTypes.func,
  selectedRows: PropTypes.any,
  editAsset: PropTypes.func,
  startSearch: PropTypes.func,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
  setTags: PropTypes.func,
  tags: PropTypes.array,
  searchOptions: PropTypes.array,
}
