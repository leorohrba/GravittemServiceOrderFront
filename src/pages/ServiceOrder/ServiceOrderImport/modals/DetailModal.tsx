import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row } from 'antd'
import moment from 'moment'
import ReactExport from 'react-data-export'
import { useServiceOrderContext } from '../context/ServiceOrderContext'
import { IDataExport } from '../interfaces/IDataExport'
import { IDetailModalProps } from '../interfaces/IDetailModalProps'
import DetailModalTable from './DetailModalTable'
import { getDetailData } from '../services'
import { IDetailData } from '../interfaces/IDetailData'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

const DetailModal: React.FC<IDetailModalProps> = props => {
  const { logObject } = props
  const { viewDetailModal, setViewDetailModal } = useServiceOrderContext()

  const [logDetailData, setLogDetailData] = useState<IDetailData[]>([])
  const [dataExport, setDataExport] = useState<IDataExport[]>([])

  const handleCancel = () => {
    setViewDetailModal(false)
  }

  const periodLabel = () => (
    <span>
      {logObject.dataInicial &&
        moment(logObject.dataInicial).format('DD/MM/YYYY HH:mm:ss')}
      {logObject.dataFinal &&
        ' ~ ' + moment(logObject.dataFinal).format('DD/MM/YYYY HH:mm:ss')}
      {logObject.tempo && ` (${logObject.tempo})`}
    </span>
  )

  useEffect(() => {
    if (logDetailData.length > 0) {
      const source: IDataExport[] = [
        {
          columns: ['Data', 'Tempo', 'Status', 'Mensagem'],
          data: logDetailData.map((item: IDetailData) => [
            item.dataInicial?.substring(0, 10),
            item.tempo,
            item.tipoLogDescricao,
            item.mensagem,
          ]),
        },
      ]
      setDataExport(source)
    }
  }, [logDetailData])

  useEffect(() => {
    getDetailData(logObject.logInicializacaoId, setLogDetailData)
  }, [viewDetailModal])

  return (
    <Modal
      title="Detalhes"
      visible={viewDetailModal}
      destroyOnClose
      centered
      width="90%"
      onCancel={handleCancel}
      footer={
        <>
          <ExcelFile
            filename={`Anexo_Detalhe_${moment().format('DD_MM_YYYY_HH_mm')}`}
            element={
              <Button
                size="default"
                disabled={dataExport.length === 0}
                style={{ marginLeft: 'auto' }}
                className="ml-2 iconButton"
              >
                <i className="fa fa-download fa-lg mr-3" />
                Exportar
              </Button>
            }
          >
            <ExcelSheet
              dataSet={dataExport}
              name="Importacao_planilha_Detalhe"
            />
          </ExcelFile>
          <Button onClick={handleCancel} className="ml-3">
            Voltar
          </Button>
        </>
      }
    >
      <Row type="flex" gutter={12} className="mb-2">
        <Col>
          <b className="mr-2">Período:</b>
          {periodLabel()}
        </Col>
        <Col>
          <div className="flex">
            <b className="mr-2">Status:</b>
            {logObject.statusDescricao}
          </div>
        </Col>
      </Row>

      <DetailModalTable
        tableData={logDetailData.map((item: IDetailData) => ({
          dataInicial: item.dataInicial,
          tempo: item.tempo,
          status: item.tipoLogDescricao,
          mensagem: item.mensagem.split('|').slice(-1),
        }))}
      />
    </Modal>
  )
}

export default DetailModal
