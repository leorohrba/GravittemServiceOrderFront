import { Form } from '@ant-design/compatible'
import DefaultTable from '@components/DefaultTable'
import { Badge, Button, message, Tag } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import LinkAssetsModalSearchForm from './LinkAssetsModalSearchForm'

function LinkAssetsModalSearch({ form, data, setData }) {
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [searchValues, setSearchValues] = useState([])
  const [searchData, setSearchData] = useState([])

  const columns = [
    {
      title: 'Produto',
      key: 'product',
      dataIndex: 'product',
    },
    {
      title: 'N° de série',
      key: 'serialNumber',
      dataIndex: 'serialNumber',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: d => <Badge color={d === 'Ativo' ? 'green' : 'red'} text={d} />,
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
      setSelectedRowKeys(selectedRowKey)
    },
  }

  const getSearchValues = () => {
    const values = form.getFieldsValue()
    if (values.searchValue) {
      const newSearchValue = {
        fieldName: 'Produto',
        searchField: values.searchValue,
      }
      setSearchValues([...searchValues, { ...newSearchValue }])
      setSearchData([
        {
          key: 2,
          product: 'Sensor GPS',
          serialNumber: 'A4321',
          status: 'Ativo',
        },
        {
          key: 3,
          product: 'Sensor GPS',
          serialNumber: 'B3472',
          status: 'Ativo',
        },
      ])
    }
  }

  function linkAsset() {
    // eslint-disable-next-line no-param-reassign
    setSelectedRows(selectedRows.map(d => (d.linkDate = moment())))
    setData([...data, ...selectedRows])
    setSelectedRows([])
    setSelectedRowKeys([])
    message.success('Itens vinculados com sucesso!')
  }

  return (
    <React.Fragment>
      <LinkAssetsModalSearchForm
        form={form}
        getSearchValues={getSearchValues}
      />
      <div className="mt-1">
        {searchValues.map(s => (
          <Tag color="blue" closable>
            {s.fieldName}: {s.searchField}
          </Tag>
        ))}
      </div>
      {selectedRows.length > 0 ? (
        <Button className="my-5" onClick={linkAsset}>
          Vincular ativo
        </Button>
      ) : (
        <div className="mb-12" />
      )}
      <DefaultTable
        dataSource={searchData}
        columns={columns}
        rowKey={record => record.key}
        rowSelection={rowSelection}
        pagination={false}
      />
    </React.Fragment>
  )
}

const WrappedLinkAssetsModalSearch = Form.create()(LinkAssetsModalSearch)
export default WrappedLinkAssetsModalSearch
