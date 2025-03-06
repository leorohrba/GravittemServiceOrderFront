import React, { useState, useEffect } from 'react'
import { Button, Modal, Row, Skeleton, Spin, Pagination } from 'antd'
import DefaultTable from '@components/DefaultTable'
import { customSort } from '@utils'
import moment from 'moment'
import ReactExport from 'react-data-export'
import PropTypes from 'prop-types'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

const ServiceOrderDetailModal = ({
  loading,
  visible,
  setVisible,
  serviceOrderDetail,
  isOnline,
  serviceOrderDetailType,
  serviceOrderDetailParams,
  profile,
}) => {
  const [dataExport, setDataExport] = useState([])
  const [colaboradorData, setColaboradorData] = useState([])

  useEffect(() => {
    let exportData = []

    exportData = [
      {
        columns: [
          'Número OS',
          'Data apontamento',
          'Data criação OS',
          'Classificação da OS',
          'Cliente',
          'Colaborador',
          'Hr. início',
          'Intervalo',
          'Hr. final',
          'Total hr.',
          'Hr. deslocamento',
          'Descrição da atividade'
        ],
        data: Array.isArray(serviceOrderDetail)
          ? serviceOrderDetail.map(order => [
              order.numeroOs,
              order.dataApontamento
                ? moment(order.dataApontamento).format('DD/MM/YYYY')
                : '',
              order.dataCriacaoOs
                ? moment(order.dataCriacaoOs).format('DD/MM/YYYY')
                : '',
              order.classificacaoOs,
              order.cliente,
              order.colaborador,
              order.horaInicio,
              order.horaIntervalo,
              order.horaFinal,
              order.horasTrabalhadas,
              order.horasDeslocamento,
              order.atividade
            ])
          : [],
      },
    ]

    setDataExport(exportData)

    const colaboradorMap = new Map()
    if (Array.isArray(serviceOrderDetail)) {
      serviceOrderDetail.forEach(order => {
        const { colaborador, horaInicio, horaFinal, horasTrabalhadas, horasDeslocamento } = order
        if (!colaboradorMap.has(colaborador)) {
          colaboradorMap.set(colaborador, { totalWorkedSeconds: 0, totalStoppedSeconds: 0 })
        }

        const [workedHours, workedMinutes, workedSeconds] = (horasTrabalhadas || '00:00:00').split(':').map(Number)
        const totalWorkedSeconds = colaboradorMap.get(colaborador).totalWorkedSeconds +
          (workedHours * 3600 + workedMinutes * 60 + workedSeconds)

        const [stoppedHours, stoppedMinutes, stoppedSeconds] = (horasDeslocamento || '00:00:00').split(':').map(Number)
        const totalStoppedSeconds = colaboradorMap.get(colaborador).totalStoppedSeconds +
          (stoppedHours * 3600 + stoppedMinutes * 60 + stoppedSeconds)

        colaboradorMap.set(colaborador, { totalWorkedSeconds, totalStoppedSeconds })
      })
    }

    const colaboradorData = Array.from(colaboradorMap.entries()).map(([name, { totalWorkedSeconds, totalStoppedSeconds }]) => {
      const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }

      return {
        name,
        hours: formatTime(totalWorkedSeconds),
        orders: formatTime(totalStoppedSeconds)
      }
    })

    setColaboradorData(colaboradorData)

  }, [serviceOrderDetail, serviceOrderDetailType])

  const columns2 = [
    {
      title: 'Colaborador',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Horas atendimento',
      dataIndex: 'hours',
      key: 'hours',
      sorter: (a, b) => a.hours.localeCompare(b.hours),
      render: (text, d) => (
        <React.Fragment>
          <span>{d.hours}</span>
        </React.Fragment>
      ),
    },
    {
      title: 'Horas deslocamento',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a, b) => a.orders.localeCompare(b.orders),
      render: (text, d) => (
        <React.Fragment>
          <span>{d.orders}</span>
        </React.Fragment>
      ),
    },
  ]

  const columns = [
    {
      title: 'Número OS',
      dataIndex: 'numeroOs',
      sorter: (a, b) => a.numeroOs - b.numeroOs,
    },
    {
      title: 'Data apontamento',
      dataIndex: 'dataApontamento',
      sorter: (a, b) => customSort(a.dataApontamento, b.dataApontamento),
      render: text => (text ? moment(text).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Data criação OS',
      dataIndex: 'dataCriacaoOs',
      sorter: (a, b) => customSort(a.dataCriacaoOs, b.dataCriacaoOs),
      render: text => (text ? moment(text).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Classificação da OS',
      dataIndex: 'classificacaoOs',
      sorter: (a, b) => customSort(a.classificacaoOs, b.classificacaoOs),
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      sorter: (a, b) => customSort(a.cliente, b.cliente),
    },
    {
      title: 'Colaborador',
      dataIndex: 'colaborador',
      sorter: (a, b) => customSort(a.colaborador, b.colaborador),
    },
    {
      title: 'Hr. início',
      dataIndex: 'horaInicio',
      sorter: (a, b) => customSort(a.horaInicio, b.horaInicio),
    },
    {
      title: 'Intervalo',
      dataIndex: 'horaIntervalo',
      sorter: (a, b) => customSort(a.horaIntervalo, b.horaIntervalo),
    },
    {
      title: 'Hr. final',
      dataIndex: 'horaFinal',
      sorter: (a, b) => customSort(a.horaFinal, b.horaFinal),
    },
    {
      title: 'Total hr.',
      dataIndex: 'horasTrabalhadas',
      sorter: (a, b) =>
        customSort(a.horasTrabalhadas, b.horasTrabalhadas),
    },
    {
      title: 'Hr. deslocamento',
      dataIndex: 'horasDeslocamento',
      sorter: (a, b) =>
        customSort(a.horasDeslocamento, b.horasDeslocamento),
    },
    {
      title: 'Descrição da atividade',
      dataIndex: 'atividade',
      sorter: (a, b) =>
        customSort(a.atividade, b.atividade),
    },
  ]

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        title="Detalhes da ordem de serviço"
        onCancel={() => setVisible(false)}
        centered
        destroyOnClose
        width="95%"
        footer={
          <Row type="flex">
            <ExcelFile
              filename={`OrdensDeServico_${moment().format('DD_MM_YYYY_HHmm')}`}
              element={
                <Button type="outline">
                  <i
                    className="fa fa-download mr-3 fa-lg"
                    style={{ color: 'gray' }}
                  />
                  Exportar
                </Button>
              }
            >
              <ExcelSheet dataSet={dataExport} name="Ordens de Serviço" />
            </ExcelFile>

            <Button
              type="secondary"
              style={{ marginLeft: 'auto' }}
              onClick={() => setVisible(false)}
            >
              Fechar
            </Button>
          </Row>
        }
      >
        <Spin size="large" spinning={loading}>
          <Skeleton loading={loading} paragraph={{ rows: 13 }} active>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <DefaultTable
                size="small"
                rowKey={record => record.numeroOs || record.colaborador}
                columns={columns}
                dataSource={
                  Array.isArray(serviceOrderDetail) ? serviceOrderDetail : []
                }
                pagination={false}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginTop: '16px' }}>
              <DefaultTable
                size="small"
                style={{ width: '30%' }}
                rowKey={record => record.id}
                columns={columns2}
                dataSource={colaboradorData}
                pagination={false}
              />
            </div>
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Pagination
                total={serviceOrderDetail.length}
                pageSize={10}
              />
            </div>
          </Skeleton>
        </Spin>
      </Modal>
    </React.Fragment>
  )
}

ServiceOrderDetailModal.propTypes = {
  loading: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  serviceOrderDetail: PropTypes.array.isRequired,
  isOnline: PropTypes.bool.isRequired,
  serviceOrderDetailType: PropTypes.string,
  serviceOrderDetailParams: PropTypes.object,
  profile: PropTypes.object,
}

export default ServiceOrderDetailModal
