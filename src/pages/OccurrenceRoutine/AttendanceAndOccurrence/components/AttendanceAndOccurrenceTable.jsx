/* eslint-disable react-hooks/exhaustive-deps */
import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { getLocaleDateFormat, customSort, minuteToHourMinute, hasPermission, handleAuthError, showApiMessages } from '@utils'
import { Badge, Button, Tooltip, Row, Col, Popover, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewServiceOrderModal from '../modals/NewServiceOrderModal'
import AttendancePopover from './AttendancePopover'
import PersonGroupPopover from '../../PersonGroup/components/PersonGroupPopover'
import { apiAttendance } from '@services/api'

import moment from 'moment'

export default function AttendanceAndOccurrenceTable({ data, rowSelection, userPermissions, editAttendance, keyTable, refreshData }) {
  const [serviceOrderModalVisible, setServiceOrderModalVisible] = useState(
    false,
  )
  
  const [attendanceId, setAttendanceId] = useState(null)
  const [keyModal, setKeyModal] = useState(0)
  
  const openServiceOrder = (id) => {
    setAttendanceId(id)
    setServiceOrderModalVisible(true)
    setKeyModal(keyModal + 1)
  }
  
  const getRenderAtivo = (d) => {
    if (!d.ativoQuantidade) {
      return null
    }
    const result = (
         <div>
           <p className="mb-0">
             {d.ativoDescricao} 
             {d.ativoQuantidade > 1 && (
               <Popover 
                 title="Ativos"
                 content={<Ativos id={d.id} />}
               >
                 <i style={{ color: 'gray' }} className="fa fa-ellipsis-h cursor-pointer ml-2" />
               </Popover>  
             )} 
           </p>
           {d.ativoSerie && (<small>{d.ativoSerie}</small>)}
         </div>  
    )    
    return result
  }
  
  const columns = [
    {
      title: '',
      key: 'priority',
      dataIndex: 'idPrioridade',
      width: 30,
      render: (text, d) =>
        d.idPrioridade && (
          <Tooltip title={d.descricaoPrioridade}>
            <i
              className="ml-2 fa fa-exclamation-circle"
              style={{ color: d.corPrioridade }}
            />
          </Tooltip>  
        ),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceAndOccurrence.number',
      }),
      key: 'number',
      dataIndex: 'numero',
      sorter: (a, b) => customSort(a.numeroOrdenacao, b.numeroOrdenacao),
      render: (text,record) => (
              <AttendancePopover 
                attendance={record}
                showEditAttendance
                showPlaceMap
                userPermissions={userPermissions}
                editAttendance={(id) => editAttendance(id, null, null, true, false, false)}
              >
              {record.numero}
             </AttendancePopover>)               
    },
    {
      title: 'Ativo',
      sorter: (a, b) => customSort(a.ativoDescricao, b.ativoDescricao),
      render: d => getRenderAtivo(d),      
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceAndOccurrence.name',
      }),
      key: 'description',
      dataIndex: 'nomeSolicitante',
      sorter: (a, b) => customSort((a.nomeCliente || a.nomeSolicitante), (b.nomeCliente || b.nomeSolicitante)),
      render: (text, d) => !d.idSolicitante ? (
        <span>
          <p className="mb-0">
            {d.nomeSolicitante}
          </p>
        </span>
      ) : (
        <span>
          <p className="mb-0">
            {d.nomeCliente}
          </p>
          {d.nomeSolicitante && (
            <SmallTableFieldDescription
              color="gray"
              label={d.nomeSolicitante}
              fontStyle="italic"
            />
          )}
        </span>
      ),      
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceAndOccurrence.schedulling',
      }),
      key: 'name',
      dataIndex: 'dataAgendamento',
      sorter: (a, b) => customSort(a.dataAgendamento, b.dataAgendamento),
      render: (text, d) => (
        <span>
          <p className="mb-0">
            {d.dataAgendamento && (
              <span>
                {moment(d.dataAgendamento).format(d.horarioAgendamento ? `${getLocaleDateFormat()} HH:mm` : getLocaleDateFormat())}
              </span>
            )}              
          </p>
          {!!d.duracao && (
            <SmallTableFieldDescription
              color="gray"
              label={
                minuteToHourMinute(d.duracao) +
                formatMessage({
                  id: 'occurrenceRoutine.attendanceAndOccurrence.duration',
                })
              }
              fontStyle="italic"
            />
          )}  
        </span>
      ),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceAndOccurrence.responsible',
      }),
      key: 'responsible',
      dataIndex: 'nomeResponsavelAtendimento',
      render: (text, d) => (
        <Row type="flex" align="middle">
          <Col>{d.nomeResponsavelAtendimento}</Col>
          {d.idGrupoColaborador && (
             <Col className="ml-2">
               <PersonGroupPopover personGroupId={d.idGrupoColaborador} />
             </Col>
          )}   
        </Row>
      ),
      sorter: (a, b) => customSort(a.nomeResponsavelAtendimento, b.nomeResponsavelAtendimento),
    },
    {
      title: formatMessage({
        id: 'occurrenceRoutine.attendanceChannel.status',
      }),
      key: 'status',
      dataIndex: 'idStatus',
      sorter: (a, b) => customSort(a.descricaoStatus, b.descricaoStatus), 
      render: (text, d) => (
        <span>
          <p className="mb-0">
            <Badge
              color={d.corStatus}
              text={d.descricaoStatus}
            />
          </p>
          {d.descricaoMotivo && (
            <SmallTableFieldDescription
              color="gray"
              label={d.descricaoMotivo}
              fontStyle="italic"
            />
          )}
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <span>
          {hasPermission(userPermissions, 'Alter') && (
            <span>
              <Tooltip
                placement="top"
                title={formatMessage({
                  id:
                    'occurrenceRoutine.attendanceAndOccurrence.createLinkedAttendance',
                })}
              >
                <Button
                  className="iconButton mr-2"
                  onClick={() => editAttendance(d.id, null, null, false, true, false)}
                  shape="circle"
                  type="primary"
                  ghost
                >
                  <i className="fa fa-user-plus fa-lg" />
                </Button>
              </Tooltip>
              {!d.idOrdemServico && (
                <Tooltip
                  placement="top"
                  title={formatMessage({
                    id:
                      'occurrenceRoutine.attendanceAndOccurrence.createServiceOrder',
                  })}
                >
                  <Button
                    className="iconButton mr-2"
                    disabled={!!d.idOrdemServico}
                    shape="circle"
                    type="primary"
                    onClick={() => openServiceOrder(d.id)}
                    ghost
                  >
                    <i className="fa fa-file-text-o fa-lg" />
                  </Button>
                </Tooltip>
              )}
            </span>
          )}            
          <Tooltip placement="top" title={formatMessage({ id: hasPermission(userPermissions, 'Alter') ? 'edit' : 'query' })}>
            <Button
              className="iconButton mr-2"
              shape="circle"
              type="primary"
              onClick={() => editAttendance(d.id, null, null, false, false, false)}
              ghost
            >
              <i className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'} fa-lg`} />
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ]

  return (
    <React.Fragment>
      <DefaultTable
        className="mt-5"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
        key={keyTable}
      />
      <React.Fragment>
        <NewServiceOrderModal
          serviceOrderModalVisible={serviceOrderModalVisible}
          setServiceOrderModalVisible={setServiceOrderModalVisible}
          attendanceId={attendanceId}
          key={keyModal}
          refreshData={refreshData}
        />
      </React.Fragment>  
    </React.Fragment>
  )
}

AttendanceAndOccurrenceTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  userPermissions: PropTypes.array,
  editAttendance: PropTypes.func,
  keyTable: PropTypes.number,
  refreshData: PropTypes.func,
}

const ativoColumns = [
  {
    title: 'Descrição',
    dataIndex: 'descricaoProduto',
  },
  {
    title: 'Número de série',
    dataIndex: 'numeroSerie',
  }
]

function Ativos({ id })  {
  
  const [loading, setLoading] = useState(false)
  const [dataAtivos, setDataAtivos] = useState([])
  
  useEffect(() => {
    getData()
  },[id])
  
  async function getData() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtivoAtendimento`,
        data: { idAtendimento: id },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setDataAtivos(data.ativoAtendimento)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  return (
    <Spin spinning={loading}>
      <DefaultTable
        columns={ativoColumns}
        dataSource={dataAtivos}
        size="small"
        pagination={false}
      />
    </Spin>)
}