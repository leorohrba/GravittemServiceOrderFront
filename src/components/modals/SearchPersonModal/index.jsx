import NewSimpleSearch from '@components/NewSimpleSearch'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { apiFinancial } from '@services/api'
import { handleAuthError, setParamValues } from '@utils'
import { Button, Col, message, Modal, Row, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import SearchPersonModalTable from './SearchPersonModalTable'

let params = {}

export default function SearchPersonModal({
  visibleSearchPersonModal,
  setVisibleSearchPersonModal,
  handleSelectPerson,
}) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [searchOptions, setSearchOptions] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    getSearchOptions()
  }, [])

  const startSearch = () => {
    params = {}
    setParamValues(params, searchOptions, tags, 1)
    getData()
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      // const response = await apiFinancial({
      //   method: 'GET',
      //   url: `/api/Pessoa`,
      //   params,
      // })
      // const { data } = response
      setLoading(false)
      const tableData = [
        {
          id: 1,
          nome: 'Renata Martins',
          documento: '045.048.078-33',
          endereco: 'Rua dos Bancarios, 535 - Petrópolis',
          complemento: 'Joinville - SC - 89222-222',
          telefone: '(47) 3434-3333',
          email: 'renatamartins@gmail.com',
          status: 1,
          motivo: 'Cliente vigente',
          registros: 3,
        },
      ]
      setData(tableData || [])
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getSearchOptions() {
    try {
      const response = await apiFinancial({
        method: 'GET',
        url: `/api/CentroCusto/campos`,
      })
      const { data } = response
      setSearchOptions(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }

  function handleSave() {
    handleSelectPerson(selectedRows[0].nome, {
      key: selectedRows[0].id,
      document: selectedRows[0].documento,
    })
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    handleClose()
  }

  function handleClose() {
    setTags([])
    setSelectedRows([])
    setVisibleSearchPersonModal(false)
  }

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  return (
    <Modal
      title="Pesquisar"
      visible={visibleSearchPersonModal}
      width="60%"
      destroyOnClose
      onCancel={handleClose}
      footer={
        <Row type="flex" justify="space-between" align="middle">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
            disabled={selectedRows.length === 0 || selectedRows.length > 1}
          >
            Adicionar
          </Button>
          <Button type="secondary" className="ml-3" onClick={handleClose}>
            Cancelar
          </Button>
          {data.length > 0 && (
            <SmallTableFieldDescription
              label={`${data.length} registros encontrados`}
              fontStyle="italic"
              color="gray"
              className="ml-auto"
            />
          )}
        </Row>
      }
    >
      <Spin size="large" spinning={loading}>
        <Row className="mb-2">
          <Col style={{ width: '100%' }}>
            <NewSimpleSearch
              searchOptions={searchOptions}
              setTags={setTags}
              tags={tags}
              startSearch={startSearch}
              getSelectLabel
              selectOptionsWidth={200}
              // searchBoxWidth={500}
              labelButton="Pesquisar"
            />
          </Col>
        </Row>
        <SearchPersonModalTable {...{ rowSelection, data }} />
      </Spin>
    </Modal>
  )
}
