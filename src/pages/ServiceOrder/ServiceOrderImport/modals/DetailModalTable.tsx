import DefaultTable from '@components/DefaultTable'
import React from 'react'
import moment from 'moment'

export default function DetailModalTable({ tableData }) {
  const columns = [
    {
      title: 'Data',
      render: (d: { dataInicial: moment.MomentInput }) =>
        d.dataInicial && moment(d.dataInicial).format('DD/MM/YYYY HH:mm:ss'),
      width: 150,
    },
    {
      title: 'Tempo',
      render: (d: { tempo: string }) => d.tempo,
    },
    {
      title: 'Status',
      render: (d: { status: string }) => {
        if (d.status === 'Sucesso') {
          return <i className="fa fa-check fa-lg" style={{ color: 'green' }} />
        } else if (d.status === 'Erro') {
          return <i className="fa fa-times fa-lg" style={{ color: 'red' }} />
        } else {
          return null
        }
      },
    },

    {
      title: 'Mensagem',
      render: (d: { mensagem: string }) => d.mensagem,
    },
  ]

  return (
    <DefaultTable columns={columns} dataSource={tableData} pagination={false} />
  )
}
