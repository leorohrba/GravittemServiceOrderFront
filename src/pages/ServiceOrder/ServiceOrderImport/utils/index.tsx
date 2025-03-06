import React from 'react'
import { ITableData } from '../interfaces/ITableData'
import { customSort } from '@utils'
import moment from 'moment'
import { Button, Tooltip, Space, Row, Col } from 'antd'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'

export const serviceOrderImportColumns = (
  handleDownloadClick: (logObject: ITableData) => void,
  handleDetailClick: (logObject: ITableData) => void,
  screenType: string = 'standard',
) => {
  var columnItens = [
    {
      title: 'Data da geração',
      sorter: (a: ITableData, b: ITableData) =>
        customSort(a?.dataInicial, b?.dataInicial),
      render: (d: ITableData) => (
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
          <Col className="justify-end">
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
      title: 'Usuário',
      sorter: (a: ITableData, b: ITableData) =>
        customSort(a?.usuarioNome, b?.usuarioNome),
      render: (d: ITableData) => d?.usuarioNome,
    },
    {
      title: 'Status',
      sorter: (a: ITableData, b: ITableData) =>
        customSort(a?.statusDescricao, b?.statusDescricao),
      render: (d: ITableData) => (
        <span>
          {renderStatus(d?.status)}
          {d?.statusDescricao}
        </span>
      ),
    },
    {
      title: 'Mensagem',
      sorter: (a: ITableData, b: ITableData) =>
        customSort(a?.interfaceLogDescricao, b?.interfaceLogDescricao),
      render: (d: ITableData) => d?.interfaceLogDescricao,
    },
  ]

  if (screenType !== 'standard') {
    columnItens.push({
      title: 'Planilha',
      sorter: (a: ITableData, b: ITableData) =>
        customSort(a?.empresaNome, b?.empresaNome),
      render: (d: ITableData) => d?.empresaNome,
    })
  }

  columnItens.push({
    title: 'Anexos',
    render: (d: ITableData) => (
      <Space>
        <Tooltip title={'Download do arquivo gerado'}>
          <Button className="px-2" onClick={() => handleDownloadClick(d)}>
            <i className="fa fa-download fa-lg" />
          </Button>
        </Tooltip>
        <Tooltip title={'Detalhes'}>
          <Button className="px-2" onClick={() => handleDetailClick(d)}>
            <i className="fa fa-file-text-o fa-lg" />
          </Button>
        </Tooltip>
      </Space>
    ),
    sorter: undefined,
  })

  return columnItens
}

const renderStatus = (status: number) => {
  switch (status) {
    case 1:
      return <i className="fa fa-circle mr-2" style={{ color: 'yellow' }} />
    case 2:
      return <i className="fa fa-check mr-2" style={{ color: 'green' }} />
    case 3:
      return <i className="fa fa-times mr-2" style={{ color: 'red' }} />
  }
}
