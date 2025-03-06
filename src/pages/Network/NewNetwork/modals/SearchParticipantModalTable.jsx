import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import PropTypes from 'prop-types'
import React from 'react'

export default function SearchParticipantModalTable({ rowSelection, data }) {
  const columns = [
    {
      title: 'Nome',
      key: 'nome',
      render: d => (
        <React.Fragment>
          <p className="mb-0">{d.nome}</p>
          <SmallTableFieldDescription
            label={d.documento}
            fontStyle="italic"
            color="gray"
          />
        </React.Fragment>
      ),
    },
    {
      title: 'Endereço',
      key: 'endereco',
      render: d => (
        <React.Fragment>
          <p className="mb-0">{d.endereco}</p>
          <SmallTableFieldDescription
            label={d.complemento}
            fontStyle="italic"
            color="gray"
          />
        </React.Fragment>
      ),
    },
    {
      title: 'Contato',
      key: 'contato',
      render: d => (
        <React.Fragment>
          <p className="mb-0">{d.contato}</p>
          <SmallTableFieldDescription
            label={d.email}
            fontStyle="italic"
            color="gray"
          />
        </React.Fragment>
      ),
    },
  ]

  return (
    <DefaultTable
      className="mt-5"
      rowKey={record => record.key}
      columns={columns}
      rowSelection={rowSelection}
      dataSource={data}
      scroll={{
        y: 400,
      }}
      pagination={false}
    />
  )
}

SearchParticipantModalTable.propTypes = {
  data: PropTypes.any,
  rowSelection: PropTypes.any,
}
