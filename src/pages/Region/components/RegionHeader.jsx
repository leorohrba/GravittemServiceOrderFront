import ConfigurationModal from '@components/modals/ConfigurationModal'
import NewSimpleSearch from '@components/NewSimpleSearch'
import { apiFinancial } from '@services/api'
import { hasPermission } from '@utils'
import { Button, Col, Dropdown, Menu, Row } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ReactExport from 'react-data-export'
import { formatMessage } from 'umi-plugin-react/locale'
import RegionReportModal from '../modals/RegionReportModal'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function RegionHeader({
  selectedRows,
  confirmDeleteRegion,
  editRegion,
  userPermissions,
  startSearch,
  tags,
  setTags,
  dataExport,
  searchOptions,
}) {
  const [regionReportModalVisible, setRegionReportModalVisible] = useState(
    false,
  )

  const [visibleConfigurationModal, setVisibleConfigurationModal] = useState(
    false,
  )
  const menu = (
    <Menu>
      <Menu.Item onClick={() => setVisibleConfigurationModal(true)}>
        Configurações
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <ConfigurationModal
        {...{
          visibleConfigurationModal,
          setVisibleConfigurationModal,
          // setUpdateColumnsKey,
        }}
        screenName="regioes"
        tableName="regioes"
        defaultColumns={[]}
        microserviceName="financial"
        microserviceOrigin={apiFinancial}
        onlyInitialSearch
      />
      <RegionReportModal
        visible={regionReportModalVisible}
        setVisible={setRegionReportModalVisible}
        userPermissions={userPermissions}
      />
      <Row className="flex">
        <Col className="ml-auto">
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            selectOptionsWidth={180}
            getSelectLabel
            screenName="regioes"
          />
        </Col>
      </Row>
      <Row type="flex" className="my-5" gutter={12}>
        {selectedRows.length === 0 ? (
          <div>
            {hasPermission(userPermissions, 'Include') && (
              <Button type="primary" onClick={() => editRegion(null)}>
                <i className="fa fa-plus fa-lg mr-3" />
                Nova região
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
                onClick={confirmDeleteRegion}
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
          <Button
            size="default"
            onClick={() => setRegionReportModalVisible(true)}
            style={{
              marginLeft: 'auto',
            }}
            className="ml-2 iconButton"
          >
            <i className="fa fa-bar-chart fa-lg mr-3" />
            Relatórios
          </Button>
        </Col>
        <Col>
          {hasPermission(userPermissions, 'ExportExcel') && (
            <ExcelFile
              filename={`Regiões_${moment().format('DD_MM_YYYY_HH_mm')}`}
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
              <ExcelSheet dataSet={dataExport} name="Regiões" />
            </ExcelFile>
          )}
        </Col>
        <Dropdown overlay={menu} className="ml-1">
          <Button className="iconButton">
            <i className="fa fa-ellipsis-v" aria-hidden="true" />
          </Button>
        </Dropdown>
      </Row>
    </div>
  )
}
RegionHeader.propTypes = {
  confirmDeleteRegion: PropTypes.func,
  selectedRows: PropTypes.any,
  editRegion: PropTypes.func,
  startSearch: PropTypes.func,
  userPermissions: PropTypes.array,
  dataExport: PropTypes.array,
  setTags: PropTypes.func,
  tags: PropTypes.array,
  searchOptions: PropTypes.array,
}
