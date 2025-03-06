import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Button, Tooltip, Row, Col } from 'antd'
import React from 'react'
import { customSort } from '@utils'
import { useLogContext } from '../context/LogContext'
import moment from 'moment'

export default function LogTable() {
  const {
    data,
    statusRender,
    setLogDetailModalVisible,
    setLogInicializacaoId,
    keyTable,
  } = useLogContext()

  const handleModal = (id) => {
    setLogInicializacaoId(id)
    setLogDetailModalVisible(true)
  }

  const columns = [
    {
      title: 'Empresa',
      sorter: (a, b) => customSort(a.empresaNome, b.empresaNome),
      render: d => (
           <div>
             <p className="mb-0">
               {d.empresaNome}
             </p>
             <SmallTableFieldDescription
               label={d.usuarioNome}
               fontStyle="italic"
               color="gray"
             />
           </div>
      )
    },
    {
      title: 'Transação',
      render: d => (
           <div>
             <p className="mb-0">
               {d.interfaceLogDescricao}
             </p>
             <SmallTableFieldDescription
               label={d.interfaceLogNome}
               fontStyle="italic"
               color="gray"
             />
           </div>
      ),
      sorter: (a, b) => customSort(a.interfaceLogDescricao, b.interfaceLogDescricao),
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
    {
      title: 'Status',
      render: d => statusRender(d.status),
      sorter: (a, b) => customSort(a.statusDescricao, b.statusDescricao),
    },
    {
      title: 'Data e hora',
      sorter: (a, b) => customSort(a.dataInicial, b.dataInicial),
      render: d =>
        (
          <Row type="flex" gutter={8}>
            <Col>
              <p className="mb-0">
                {d.dataInicial && moment(d.dataInicial).format('DD/MM/YYYY')}
              </p>
              <SmallTableFieldDescription
                label={d.dataInicial && moment(d.dataInicial).format('HH:mm')}
                fontStyle="italic"
                color="gray"
              />
            </Col>
            <Col>
              <p className="mb-0">
                {d.dataFinal && moment(d.dataFinal).format('DD/MM/YYYY')}
              </p>
              <SmallTableFieldDescription
                label={d.dataFinal && moment(d.dataFinal).format('HH:mm')}
                fontStyle="italic"
                color="gray"
              />
            </Col>
          </Row>
        ),
    },
    {
      title: 'Tempo',
      render: d => d.tempo,
      sorter: (a, b) => customSort(a.tempo, b.tempo),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title="Detalhes">
          <Button
            className="iconButton"
            shape="circle"
            type="primary"
            ghost
            onClick={() => handleModal(d.logInicializacaoId)}
          >
            <i className="fa fa-file-text-o fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
    <DefaultTable
      columns={columns}
      rowKey={row => row.logInicializacaoId}
      dataSource={data}
      key={keyTable}
      locale={{
        emptyText: (
          <span>
            <i
              className="fa fa-exclamation-circle fa-3x m-5"
              aria-hidden="true"
            />
            <h3>Não há dados aqui. Preencha os campos para filtrar.</h3>
          </span>
        ),
      }}
    />
  )
}
