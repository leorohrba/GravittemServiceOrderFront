import DefaultTable from '@components/DefaultTable'
import React from 'react'
import moment from 'moment'
import { customSort } from '@utils'

export default function LogDetailModalTable({ tableData }) {

  const columns = [
    {
      title: 'Data',
      render: d => d.dataInicial && moment(d.dataInicial).format('DD/MM/YYYY HH:mm:ss'),
      sorter: (a, b) => customSort(a.dataInicial, b.dataInicial),
      width: 150,
    },
    {
      title: 'Tempo',
      render: d => d.tempo,
      sorter: (a, b) => customSort(a.tempo, b.tempo),
    },
    {
      title: 'Status',
      render: d => d.tipoLog === 1 ? (
        <i className="fa fa-check fa-lg" style={{color: 'green'}} />
      ) : (
        <i className="fa fa-times fa-lg" style={{color: 'red'}} />
      ),
      sorter: (a, b) => customSort(a.tipoLog, b.tipoLog)
    },
    {
      title: 'Mensagem',
      render: d => d.mensagem,
      sorter: (a, b) => customSort(a.mensagem, b.mensagem)
    },
    {
      title: 'Id',
      render: d => d.entidadeId,
      sorter: (a, b) => customSort(a.entidadeId, b.entidadeId),
    },
    {
      title: 'Documento',
      render: d => d.nrDocumento,
      sorter: (a, b) => customSort(a.nrDocumento, b.nrDocumento),
    },
  ]

  return (
      <DefaultTable
        columns={columns}
        rowKey={row => row.logDetalheId}
        dataSource={tableData}
        pagination={false}
      />
  )
}
