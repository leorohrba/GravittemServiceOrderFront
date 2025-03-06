import DefaultTable from '@components/DefaultTable'
import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'
import { customSort, hasPermission } from '@utils'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function NewAttendanceModalAssetsTable({ rowSelection, data, keyTable, searchValue, userPermissions, editAsset }) {

  const columns = [
    {
      title: formatMessage({
        id:
          'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.asset',
      }),
      key: 'asset',
      filteredValue: searchValue ?
                    [searchValue] : 
                    null,
      onFilter: (value, record) =>  value && (
                                   (record.descricaoProduto && record.descricaoProduto.toLowerCase().indexOf(value.toLowerCase()) >= 0) ||
                                   (record.numeroSerie && record.numeroSerie.toLowerCase().indexOf(value.toLowerCase()) >= 0)), 
      sorter: (a, b) => customSort(a.descricaoProduto, b.descricaoProduto),
      render: d => (
        <div>
          <p className="mb-0">{d.descricaoProduto}</p>
          {d.nomeCliente && (
            <small><i>{d.nomeCliente}</i></small>
          )}
        </div>
      ),
    },
    {
      title: formatMessage({
        id:
          'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.serialNumber',
      }),
      key: 'serialNumber',
      dataIndex: 'numeroSerie',
      width: 180,
      sorter: (a, b) => customSort(a.numeroSerie, b.numeroSerie),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: 90,
      render: (text,d) => (
        <span>
          <Tooltip placement="top" title={formatMessage({ id: hasPermission(userPermissions, 'Alter') ? 'edit' : 'query' })}>
            <Button
              className="iconButton mr-2"
              shape="circle"
              type="primary"
              onClick={() => editAsset(d.idAtivo)}
              ghost
            >
              <i className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'} fa-lg`} />
            </Button>
          </Tooltip>
        </span>
      ),
    },
    
  ]

  return (
  
    <DefaultTable
      rowKey={record => record.idAtivo}
      columns={columns}
      rowSelection={rowSelection}
      dataSource={data}
      key={keyTable}
      pagination={data.length > 30}
      size="small"
    />
  )
}

NewAttendanceModalAssetsTable.propTypes = {
  searchValue: PropTypes.string,
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  keyTable: PropTypes.number,
  editAsset: PropTypes.func,
  userPermissions: PropTypes.array,
}
