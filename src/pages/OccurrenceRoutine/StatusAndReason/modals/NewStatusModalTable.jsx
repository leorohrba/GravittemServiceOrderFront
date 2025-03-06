import DefaultTable from '@components/DefaultTable'
import { Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function NewStatusModalTable({
  reasonList,
  setEditReason,
  setSelectedRows,
  canBeUpdated,
  editReason,
}) {
  
  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const columns = [
    {
      title: 'Motivos',
      key: 'description',
      dataIndex: 'description',
      render: (text,record) => 
         <Tooltip title={!record.id ? 'Novo' : ''}>
          {(editReason && editReason.key === record.key) ?
             (<div>
                <b>{text}</b>
                <i className="ml-2 fa fa-pencil-square-o" />
              </div>  
             )
             :
             (<span>{text}</span>)
          }
         </Tooltip>  
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <React.Fragment>
          {canBeUpdated && (
          <Tooltip placement="top" title={formatMessage({ id: 'edit' })}>
            <Button
              className="iconButton"
              shape="circle"
              type="primary"
              ghost
              onClick={() => setEditReason(d)}
            >
              <i className="fa fa-pencil fa-lg" />
            </Button>
          </Tooltip>
          )}
        </React.Fragment>  
      ),
    },
  ]
  return (
    <React.Fragment>
      {reasonList.length > 0 && (
        <DefaultTable
          dataSource={reasonList}
          columns={columns}
          rowKey={record => record.key}
          rowSelection={canBeUpdated ? rowSelection : undefined}
          pagination={false}
          size="small"
        />
      )}
    </React.Fragment>
  )
}

NewStatusModalTable.propTypes = {
  reasonList: PropTypes.object,
  editReason: PropTypes.object,
  setEditReason: PropTypes.any,
  setSelectedRows: PropTypes.any,
  canBeUpdated: PropTypes.bool,
}
