import React from 'react'
import ReactExport from 'react-data-export'
import DefaultTable from '@components/DefaultTable'
import moment from 'moment'
import { Button } from 'antd'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile
const { ExcelColumn } = ExcelFile
export default function LogModalTable({ logData }) {
  const columns = [
    {
      title: 'Mensagem',
      dataIndex: 'mensagem',
      key: 'mensagem',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoLogDescricao',
      key: 'tipoLogDescricao',
    },
    {
      title: 'Data e hora',
      dataIndex: 'data',
      key: 'data',
      render: (text, d) => (
        <span>
          <p className="mb-0">
            <span>{moment(d.data).format('DD/MM/YYYY')}</span>
          </p>
          <SmallTableFieldDescription
            label={moment(d.data).format('HH:mm')}
            fontStyle="italic"
          />
        </span>
      ),
    },
  ]

  return (
    <React.Fragment>
      <ExcelFile
        filename={`Log_Boletos_${moment().format('DD_MM_YYYY_HH_mm')}`}
        element={
          <Button
            size="default"
            disabled={logData.length === 0}
            style={{
              marginLeft: 'auto',
            }}
            className="ml-2 my-3 iconButton"
          >
            <i className="fa fa-download fa-lg mr-3" />
            Exportar
          </Button>
        }
      >
        <ExcelSheet data={logData} name="Log de boletos">
          <ExcelColumn label="Mensagem" value="mensagem" />
          <ExcelColumn label="Tipo" value="tipoLogDescricao" />
          <ExcelColumn
            label="Data e Hora"
            value={col => moment(col.data).format('DD/MM/YYYY HH:mm')}
          />
        </ExcelSheet>
      </ExcelFile>
      <DefaultTable
        columns={columns}
        dataSource={logData}
        rowKey={row => row.parcelaId}
        pagination={false}
        style={{ overflow: 'unset' }}
      />
    </React.Fragment>
  )
}
