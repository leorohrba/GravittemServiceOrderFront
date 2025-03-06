import DefaultTable from '@components/DefaultTable'
import { hasPermission, customSort } from '@utils'
import { Badge, Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function RegionTable(
  { data, 
    rowSelection,
    editRegion,  
    keyTable,    
    userPermissions,
    tags,
    loading,
  }) {
    
  const columns = [
    {
      title: 'Região',
      dataIndex: 'nome',
      sorter: (a, b) => customSort(a.nome, b.nome),
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
    },
    {
      title: 'Delimitado por',
      dataIndex: 'delimitadoPorDescricao',
      sorter: (a, b) => customSort(a.delimitadoPorDescricao, b.delimitadoPorDescricao),
    },
    {
      title: 'Status',
      dataIndex: 'statusDescricao',
      sorter: (a, b) => customSort(a.statusDescricao, b.statusDescricao), 
      render: (text, d) => (
        <Badge
          style={{ color: d.status === 1 ? 'green' : 'red'}}
          color={
              d.status === 1
              ? 'green'
              : 'red'
          }
          text={text}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title={formatMessage({ id: hasPermission(userPermissions, 'Alter') ? 'edit' : 'query' })}>
          <Button
            className="iconButton"
            shape="circle"
            type="primary"
            ghost
            onClick={() => {
              editRegion(d.regiaoId)
            }}
          >
            <i className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'} fa-lg`} />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
   <div> 
    {(tags.length === 0 && data.length === 0 && !loading) ? (
      <div className="text-center" style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
        <i
          className="fa fa-exclamation-circle fa-3x m-5"
          aria-hidden="true"
        />
        <h3>
          Não há dados aqui. Para cadastrar clique em <b>Nova região</b>
        </h3>
      </div>
     ) : (
      <DefaultTable
        className="mt-5"
        dataSource={data}
        columns={columns}
        rowKey={record => record.regiaoId}
        rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
        key={keyTable}
      />
    )}  
  </div>  
  )
}

RegionTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  editRegion: PropTypes.func,
  keyTable: PropTypes.number,
  userPermissions: PropTypes.array,
  tags: PropTypes.array,
  loading: PropTypes.bool,
}
