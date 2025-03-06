import DefaultTable from '@components/DefaultTable'
import { customSort } from '@utils'
import { Badge, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function PersonRegionTable(
  { data, 
  }) {
    
  const columns = [
    {
      title: 'Região',
      dataIndex: 'regiaoNome',
      sorter: (a, b) => customSort(a.regiaoNome, b.regiaoNome),
      render: (text, d) => (<Tooltip title={d.descricao}>{text}</Tooltip>),
    },
    {
      title: 'Responsável',
      dataIndex: 'colaboradorNome',
      sorter: (a, b) => customSort(a.colaboradorNome, b.colaboradorNome),
    },
    {
      title: 'Dia da semana',
      dataIndex: 'diaSemanaDescricao',
      sorter: (a, b) => (a.diaSemana === 1 ? 8 : a.diaSemana || 0)  - (b.diaSemana === 1 ? 8 : b.diaSemana || 0),
    },
    {
      title: 'Status',
      dataIndex: 'regiaoStatusDescricao',
      sorter: (a, b) => customSort(a.regiaoStatusDescricao, b.regiaoStatusDescricao), 
      render: (text, d) => (
        <Badge
          style={{ color: d.regiaoStatus === 1 ? 'green' : 'red'}}
          color={
              d.regiaoStatus === 1
              ? 'green'
              : 'red'
          }
          text={text}
        />
      ),
    },
  ]

  return (
    <DefaultTable
      className="mt-5"
      dataSource={data}
      columns={columns}
      rowKey={record => record.pessoaRegiaoId}
    />
  )
}

PersonRegionTable.propTypes = {
  data: PropTypes.array,
}
