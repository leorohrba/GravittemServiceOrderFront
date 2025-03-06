import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Col, Row } from 'antd'
import React from 'react'
import { useLicenseManagementContext } from '../context/LicenseManagementContext'

export default function LicenseManagementHeader() {
  const {
    searchOptions,
    setTags,
    tags,
    startSearch,
    selectedRows,
    setVisibleJustifyModal,
  } = useLicenseManagementContext()

  return (
    <div>
      <Row type="flex" justify="end">
        <Col>
          <NewSimpleSearch
            searchOptions={searchOptions}
            setTags={setTags}
            tags={tags}
            startSearch={startSearch}
            selectOptionsWidth={200}
          />
        </Col>
      </Row>
      <Row type="flex" className="my-5">
        {selectedRows.length > 0 &&
          (selectedRows.every(row => row.status === 'ativo') ? (
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
              }}
              onClick={() => setVisibleJustifyModal(true)}
            >
              <i className="fa fa-ban fa-lg mr-3" />
              Desativar
            </Button>
          ) : (
            selectedRows.every(row => row.status === 'inativo') && (
              <Button
                style={{
                  color: 'green',
                  borderColor: 'green',
                }}
                onClick={() => setVisibleJustifyModal(true)}
              >
                <i className="fa fa-check fa-lg mr-3" />
                Ativar
              </Button>
            )
          ))}
        <Col className="ml-auto">
          <Button className="iconButton ml-2">
            <i className="fa fa-ellipsis-v" />
          </Button>
        </Col>
      </Row>
    </div>
  )
}
