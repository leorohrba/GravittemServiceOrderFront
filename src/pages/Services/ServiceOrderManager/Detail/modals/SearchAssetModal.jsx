import { Button, Form, message, Modal, Row, Tag } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import SearchAssetModalForm from './SearchAssetModalForm'
import SearchAssetModalTable from './SearchAssetModalTable'

export default function SearchAssetModal() {
  const {
    visibleSearchAssetModal,
    setVisibleSearchAssetModal,
    assetsTableData,
    setAssetsTableData,
  } = useNewServiceOrderContext()

  const [selectedRows, setSelectedRows] = useState([])
  const [searchValues, setSearchValues] = useState([])
  const [searchData, setSearchData] = useState([])

  const [form] = Form.useForm()

  const getSearchValues = () => {
    const values = form.getFieldsValue()
    if (values.searchValue) {
      const newSearchValue = {
        fieldName: values.searchField,
        searchField: values.searchValue,
      }
      setSearchValues([...searchValues, { ...newSearchValue }])
      setSearchData([
        {
          id: 2,
          codigo: '0258',
          ativo: 'Lavadora 10KG',
          numeroSerie: 'A4321',
          status: 1,
        },
        {
          id: 3,
          codigo: '0458',
          ativo: 'Lavadora 12KG',
          numeroSerie: 'B3472',
          status: 1,
        },
      ])
    }
  }

  function addAssets() {
    setAssetsTableData(...assetsTableData, selectedRows)
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    handleClose()
  }

  function handleClose() {
    setVisibleSearchAssetModal(false)
    setSelectedRows([])
    form.resetFields()
  }

  return (
    <Modal
      title="Pesquisar"
      visible={visibleSearchAssetModal}
      width="60%"
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            disabled={selectedRows.length === 0}
            onClick={addAssets}
          >
            Adicionar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            style={{
              marginRight: 'auto',
            }}
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <SearchAssetModalForm {...{ form, getSearchValues }} />
      <div className="mt-2">
        {searchValues.map(s => (
          <Tag color="blue" closable>
            {s.fieldName}: {s.searchField}
          </Tag>
        ))}
      </div>
      <SearchAssetModalTable {...{ searchData, setSelectedRows }} />
    </Modal>
  )
}
