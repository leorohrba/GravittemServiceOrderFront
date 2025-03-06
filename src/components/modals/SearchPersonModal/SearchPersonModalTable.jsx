import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { defaultStatus } from '@pages/financial/enums'
import { Badge, Tooltip } from 'antd'
import React from 'react'

export default function SearchPersonModalTable({ rowSelection, data }) {
  const findStatus = idToFind =>
    defaultStatus.find(status => status.id === idToFind)

  const columns = [
    {
      title: 'Nome',
      render: d => (
        <span>
          <p className="mb-0">
            <span role="button" className="cursor-pointer">
              {d.nome}
            </span>
          </p>
          <SmallTableFieldDescription
            label={d.documento}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
    },
    {
      title: 'Endereço',
      render: d => (
        <span>
          <p className="mb-0">
            <span role="button" className="cursor-pointer">
              {d.endereco}
            </span>
          </p>
          <SmallTableFieldDescription
            label={d.complemento}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
    },
    {
      title: 'Contato',
      render: d => (
        <span>
          <p className="mb-0">
            <span role="button" className="cursor-pointer">
              {d.telefone}
            </span>
          </p>
          <SmallTableFieldDescription
            label={d.email}
            fontStyle="italic"
            color="gray"
          />
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: d => (
        <span>
          <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
          <SmallTableFieldDescription label={d.motivo} fontStyle="italic" />
        </span>
      ),
    },
    {
      title: '',
      width: '10%',
      render: d => (
        <React.Fragment>
          <Tooltip
            placement="top"
            title={
              <div>
                {d.registros} registros encontrados com esse CPF.
                <a href="#0"> Clique aqui para ver detalhes.</a>
              </div>
            }
          >
            <Badge
              count={d.registros}
              style={{
                backgroundColor: '#f56a00',
              }}
            />
          </Tooltip>

          <Tooltip
            placement="top"
            title={<div>Cadastro bloqueado. Motivo: {d.motivo}</div>}
          >
            <i
              className="fa fa-lock fa-lg mr-3 ml-2 mt-1"
              style={{ color: '#f5222d' }}
            />
          </Tooltip>
        </React.Fragment>
      ),
    },
  ]
  return (
    <DefaultTable
      dataSource={data}
      rowSelection={rowSelection}
      columns={columns}
      pagination={false}
      locale={{
        emptyText: (
          <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
            <i className="fa fa-exclamation-circle fa-3x m-5" />
            <h3>
              Não há dados aqui. Realize uma busca para encontrar registros.
            </h3>
          </div>
        ),
      }}
    />
  )
}
