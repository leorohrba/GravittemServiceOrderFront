import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { customSort, hasPermission } from '@utils'
import { Badge, Tooltip } from 'antd'
import moment from 'moment'
import { PropTypes } from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import { getColorStatusHeader } from '../utils'

export default function MaterialRequestTable({
  tableData,
  setSelectedRows,
  userPermissions,
  keyTable,
}) {
  const columns = [
    {
      title: formatMessage({
        id: 'materialRequest.index.number',
      }),
      dataIndex: 'sequenceNumber',
      width: 150,
      sorter: (a, b) => a.sequenceNumber - b.sequenceNumber,
      render: (text, record) => (
        <div>
          <p className="mb-0">{record.sequenceNumber}</p>
          <SmallTableFieldDescription
            label={record.isRequisicaoOficina ? 'Oficina' : 'Serviço externo'}
            color="gray"
          />
        </div>
      ),
    },
    {
      title: formatMessage({
        id: 'materialRequest.index.requester',
      }),
      dataIndex: 'requesterName',
      width: 350,
      sorter: (a, b) => customSort(a.requesterName, b.requesterName),
    },
    {
      title: formatMessage({
        id: 'materialRequest.index.period',
      }),
      dataIndex: 'initialDate',
      sorter: (a, b) => customSort(a.initialDate, b.initialDate),
      render: (text, record) => (
        <div>
          <p className="mb-0">{`${moment(record.initialDate).format(
            'DD/MM/YYYY',
          )} ~ ${moment(record.finalDate).format('DD/MM/YYYY')}`}</p>
        </div>
      ),
      width: 300,
    },
    {
      title: formatMessage({
        id: 'materialRequest.index.status',
      }),
      dataIndex: 'actStatusDescription',
      sorter: (a, b) =>
        customSort(a.actStatusDescription, b.actStatusDescription),
      render: (text, record) => (
        <div>
          <Badge
            status={record.actStatusCode === 'PEND' ? 'warning' : 'success'}
            color={getColorStatusHeader(record.actStatusCode)}
            text={text}
          />
          {record.actReasonDescription && (
            <small>
              <br />
              {record.actReasonDescription}
            </small>
          )}
        </div>
      ),
      width: 250,
    },
    {
      title: '',
      key: 'operation',
      align: 'right',
      render: (text, record) => (
        <Tooltip
          placement="top"
          title={formatMessage({
            id:
              hasPermission(userPermissions, 'Alter') && record.canBeUpdated
                ? 'materialRequest.index.edit'
                : 'materialRequest.index.query',
          })}
        >
          <Button
            shape="circle"
            size="default"
            type="primary"
            ghost
            iconButton
            onClick={() =>
              router.push(`/materialRequest/detail/${record.requestNewId}`)
            }
            className="iconButton"
          >
            <i
              className={`fa fa-${
                hasPermission(userPermissions, 'Alter') && record.canBeUpdated
                  ? 'pencil'
                  : 'search'
              } fa-lg`}
            />
          </Button>
        </Tooltip>
      ),
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
    },
  }
  return (
    <DefaultTable
      rowKey={record => record.requestNewId}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={tableData}
      key={keyTable}
    />
  )
}

MaterialRequestTable.propTypes = {
  setSelectedRows: PropTypes.func,
  tableData: PropTypes.array,
  userPermissions: PropTypes.array,
  keyTable: PropTypes.number,
}
