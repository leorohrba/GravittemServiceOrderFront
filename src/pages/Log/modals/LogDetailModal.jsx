/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal, Spin, Row, Col } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLogContext } from '../context/LogContext'
import LogDetailModalTable from './LogDetailModalTable'
import { apiLog } from '@services/api'
import { handleAuthError } from '@utils'
import moment from 'moment'
import ReactExport from 'react-data-export'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

export default function LogDetailModal() {

  const { statusRender, data, logInicializacaoId, logDetailModalVisible, setLogDetailModalVisible } = useLogContext()
  const [loading, setLoading] = useState()
  const [tableData, setTableData] = useState([])
  const [editData, setEditData] = useState(null)
  const [dataExport, setDataExport] = useState([])
  
  useEffect(() => {
    const source = [
      {
        columns: ['Empresa:',
        editData?.empresaNome,
        'Transação',
        editData?.interfaceLogDescricao],
        data: []
      },
      {
        columns: [
          'Data',
          'Tempo',
          'Status',
          'Mensagem',
        ],
        data: [],
      },
    ]

    tableData.map(d => {
      source[1].data.push([
        d.dataInicial && moment(d.dataInicial).format('DD/MM/YYYY HH:mm:ss'),
        d.tempo,
        d.tipoLogDescricao,
        d.mensagem,
      ])
      return true
    })

    setDataExport(source)
  },[tableData, editData])

  useEffect(() => {
    if (logDetailModalVisible){
      setTableData([])
      setEditData(data.find(x => x.logInicializacaoId === logInicializacaoId))
      getData()
    }
  },[logDetailModalVisible, logInicializacaoId])

  async function getData() {
    setLoading(true)
    try {
      const response = await apiLog({
        method: 'GET',
        url: `/api/Log/Detalhe`,
        params: { logInicializacaoId }
      })
      setLoading(false)
      const { data } = response
      setTableData(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }  

  return (
    <Modal
      title="Detalhes"
      visible={logDetailModalVisible}
      destroyOnClose
      centered
      width="90%"
      onCancel={() => setLogDetailModalVisible(false)}
      footer={
        <>
          <Button
            type="primary"
            className="mr-3"
            onClick={() => getData()}
          >
            Processar
          </Button>

          <ExcelFile
            filename={`Log_Detalhe_${moment().format('DD_MM_YYYY_HH_mm')}`}
            element={
              <Button
                size="default"
                disabled={data.length === 0}
                style={{
                  marginLeft: 'auto',
                }}
                className="ml-2 iconButton"
              >
                <i className="fa fa-download fa-lg mr-3" />
                Exportar
              </Button>
            }
          >
            <ExcelSheet dataSet={dataExport} name="Log_Detalhe" />
          </ExcelFile>

          <Button
            onClick={() => setLogDetailModalVisible(false)}
            className="ml-3"
          >
            Voltar
          </Button>
        </>
      }
    >
      <Spin size="large" spinning={loading}>
        <Row type="flex" gutter={12} className="mb-2">
          <Col>
            <b className="mr-2">Transação:</b>
            {`${editData?.interfaceLogDescricao} (${editData?.interfaceLogNome})`}
          </Col>
          <Col>
            <b className="mr-2">Empresa:</b>
            {editData?.empresaNome}
          </Col>
        </Row>
        <Row type="flex" gutter={12} className="mb-2">
          <Col>
            <b className="mr-2">Período:</b>
            {editData?.dataInicial && moment(editData?.dataInicial).format('DD/MM/YYYY HH:mm:ss')}
            {editData?.dataFinal && ` ~ ${moment(editData?.dataFinal).format('DD/MM/YYYY HH:mm:ss')}`}
            {editData?.dataFinal && ` (${editData?.tempo})`}
          </Col>
          <Col>
            <div className="flex">
              <b className="mr-2">Status:</b>
              <span>{statusRender(editData?.status)}</span>
            </div>  
          </Col>
        </Row>

        <LogDetailModalTable tableData={tableData} />
      </Spin>
      
    </Modal>
  )
}
