/* eslint-disable react/destructuring-assignment */
import AjaxTable from '@components/AjaxTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import TooltipParagraph from '@components/TooltipParagraph'
import { scheduleStatus, scheduleTypes } from '@pages/Schedule/enums'
import { Badge, Button, Spin, Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'
import { useScheduleContext } from '../context/ScheduleContext'
import ScheduleCalendar from './ScheduleCalendar'

export default function ScheduleTable() {
  const {
    viewType,
    tableData,
    loadingTable,
    keyTable,
    setEditTaskId,
    setVisibleTaskModal,
    setCanAlterTask,
    franchisee,
    tableSearchQuery,
    setTableSearchQuery,
  } = useScheduleContext()

  function handleEdit(taskId, canEdit) {
    setCanAlterTask(canEdit)
    setEditTaskId(taskId)
    setVisibleTaskModal(true)
  }

  const findStatus = idToFind =>
    scheduleStatus.find(status => status.id === idToFind)

  const findIcon = typeToFind =>
    scheduleTypes.find(type => type.name === typeToFind)?.icon

  const columns = [
    {
      title: 'Assunto',
      dataIndex: 'assunto',
      width: 250,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Organização',
      dataIndex: 'organizacao',
      width: 180,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
      width: 180,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Data',
      width: 130,
      render: d => (
        <span>
          <p className="mb-0">{moment(d.dia).format('DD/MM/YYYY')}</p>
          {d.periodoDia && (
            <SmallTableFieldDescription
              label={
                d.diaInteiro
                  ? 'Dia inteiro'
                  : `${d.periodoDia} - ${moment(d.hora).format('HH:mm')}`
              }
              fontStyle="italic"
              color="gray"
            />
          )}
        </span>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoAgendamento',
      width: 100,
      render: val => (
        <span>
          <i
            className={`fa fa-${findIcon(val)} fa-lg mr-2`}
            style={{ color: '#1976D2' }}
          />
          {val}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: d => (
        <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: 50,
      fixed: 'right',
      render: d => (
        <Tooltip
          placement="top"
          title={d.status === 2 ? 'Consultar' : 'Editar'}
        >
          <Button
            shape="circle"
            size="default"
            className="iconButton"
            onClick={() => handleEdit(d.intId, d.status === 2)}
          >
            <i
              className={`fa fa-${d.status === 2 ? 'search' : 'pencil'} fa-lg`}
            />
          </Button>
        </Tooltip>
      ),
    },
  ]

  if (franchisee) {
    columns.splice(1, 0, {
      title: 'Empresa',
      dataIndex: 'franquia',
      width: 180,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    })
  }

  return viewType === 'list' ? (
    <AjaxTable
      {...{
        columns,
        tableData,
        loadingTable,
        tableSearchQuery,
        setTableSearchQuery,
      }}
      sticky
      rowKey={row => row.id}
      // rowSelection={rowSelection}
      key={keyTable}
      locale={{
        emptyText: (
          <div className="my-5">
            <i className="fa fa-exclamation-circle fa-3x m-2" />
            <h3 className="mt-2">Não há tarefas para este período.</h3>
          </div>
        ),
      }}
    />
  ) : (
    Array.isArray(tableData) && (
      <Spin spinning={loadingTable}>
        <ScheduleCalendar />
      </Spin>
    )
  )
}
