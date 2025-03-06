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

export default function PersonReportHeader({
  userPermissions,
  startSearch,
  tags,
  setTags,
  dataExport,
  searchOptions,
}) {
  return (
    <div>
      <Row className="flex">
        <Col style={{ width: 530 }}>
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            selectOptionsWidth={180}
            getSelectLabel
            screenName="relatorio_pessoas"
          />
        </Col>
        <Col className="ml-auto">
          {hasPermission(userPermissions, 'ExportExcel') && (
            <ExcelFile
              filename={`Responsaveis_Região_${moment().format(
                'DD_MM_YYYY_HH_mm',
              )}`}
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
              <ExcelSheet dataSet={dataExport} name="Responsáveis_Regiões" />
            </ExcelFile>
          )}
        </Col>
      </Row>
    </div>
  )
}
PersonReportHeader.propTypes = {
  startSearch: PropTypes.func,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
  setTags: PropTypes.func,
  tags: PropTypes.array,
  searchOptions: PropTypes.array,
}
