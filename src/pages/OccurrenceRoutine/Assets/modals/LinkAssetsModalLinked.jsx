import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { getLocaleDateFormat } from '@utils'
import { Badge, Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

export default function LinkAssetsModalLinked({ data, setData }) {
  const [selectedRows, setSelectedRows] = useState([])

  const columns = [
    {
      title: 'Produto',
      key: 'product',
      render: d => (
        <span>
          <p className="mb-0">{d.product}</p>
          <SmallTableFieldDescription
            label={`N° de série ${d.serialNumber}`}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
    },
    {
      title: 'Data de vinculo',
      key: 'linkDate',
      dataIndex: 'linkDate',
      render: d => d && d.format(getLocaleDateFormat()),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: d => <Badge color={d === 'Ativo' ? 'green' : 'red'} text={d} />,
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title="Editar">
          <Button
            shape="circle"
            size="default"
            type="primary"
            ghost
            className="iconButton"
          >
            <i className="fa fa-pencil fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  function unlinkAsset() {
    let newData = data
    // eslint-disable-next-line no-return-assign
    selectedRows.map(s => (newData = newData.filter(d => d.key !== s.key)))
    setData(newData)
    setSelectedRows([])
  }

  return (
    <React.Fragment>
      {selectedRows.length > 0 ? (
        <Button onClick={unlinkAsset}>Desvincular ativo</Button>
      ) : (
        <div className="mb-12" />
      )}
      <DefaultTable
        className="mt-5"
        dataSource={data}
        columns={columns}
        rowKey={record => record.key}
        rowSelection={rowSelection}
        pagination={false}
      />
    </React.Fragment>
  )
}

LinkAssetsModalLinked.propTypes = {
  data: PropTypes.array,
  setData: PropTypes.any,
}
