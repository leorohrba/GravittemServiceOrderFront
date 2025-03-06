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

export default function CheckInCheckOutHeader({
  searchOptions,
  tags,
  setTags,
  startSearch,
  dataExport,
  userPermissions,
}) {
  return (
    <div>
      <Row type="flex" align="middle">
        <Col
          style={{
            marginLeft: 'auto',
          }}
        >
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            screenName="relatorio_checkin_checkout"
          />
        </Col>
      </Row>
      <Row type="flex" className="my-5">
        <Col className="ml-auto">
          {hasPermission(userPermissions, 'ExportExcel') && (
            <ExcelFile
              filename={`Entrada_Saidas_${moment().format('DD_MM_YYYY_HH_mm')}`}
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
              <ExcelSheet dataSet={dataExport} name="Entrada_Saidas" />
            </ExcelFile>
          )}
        </Col>
      </Row>
    </div>
  )
}

CheckInCheckOutHeader.propTypes = {
  searchOptions: PropTypes.array,
  setTags: PropTypes.func,
  startSearch: PropTypes.func,
  tags: PropTypes.array,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
}
