import { apiCRM, apiSchedule } from '@services/api'
import { handleAuthError, mountSearchQuery, sendDataToServer } from '@utils'
import { getInitialSearch, useGetDataFromServer } from '@utils/customHooks'
import { message } from 'antd'
import constate from 'constate'
import moment from 'moment'
import { useEffect, useState } from 'react'

function useSchedule() {
  const query = new URLSearchParams(window.location.search)
  const franchisee = query.get('franqueador')?.toLocaleLowerCase() === 'true'

  const [viewType, setViewType] = useState('list')
  const screenConfig = {
    apiHost: apiSchedule,
    screenName: 'Agenda',
  }

  const [selectedDate, setSelectedDate] = useState([moment(), moment()])
  const [selectedCollaborator, setSelectedCollaborator] = useState()
  const [selectedFranchise, setSelectedFranchise] = useState()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [tags, setTags] = useState([])
  const [tableSearchQuery, setTableSearchQuery] = useState(
    'tamanhoPagina=30&paginaAtual=1&ordenarPor=dia',
  )
  const [tableConfigQuery, setTableConfigQuery] = useState(
    `${
      viewType === 'list'
        ? `periodo=${moment(selectedDate[0]).format('YYYY-MM-DD')}|${moment(
            selectedDate[1],
          ).format('YYYY-MM-DD')}&`
        : `${moment(selectedDate[0]).format('YYYY-MM-DD')}|${moment(
            selectedDate[1],
          ).format('YYYY-MM-DD')}&`
    }${
      selectedCollaborator?.length > 0
        ? `Colaborador=${selectedCollaborator}&`
        : ''
    }${
      selectedFranchise
        ? `Franquias=${selectedFranchise}&RetornaTodas=false&`
        : franchisee
        ? 'RetornaTodas=true&'
        : 'RetornaTodas=false&'
    }`,
  )

  const [updateKey, setUpdateKey] = useState(0)
  const [keyTable, setKeyTable] = useState(0)
  const [collaborators, loadingCollaborators] = useGetDataFromServer(
    apiSchedule,
    `/api/Agenda/Colaborador?updateKey=${updateKey}`,
    'Não foi possível obter as opções de responsável',
    true,
  )
  const [franchises, loadingFranchises] = useGetDataFromServer(
    apiSchedule,
    `/api/Agenda/Franquia`,
    'Não foi possível obter as opções de franquias',
    true,
  )
  const [simpleSearchQuery, setSimpleSearchQuery] = useState('')

  const [tableData, setTableData] = useState({})
  const [loadingTable, setLoadingTable] = useState(true)

  async function getTableData() {
    setLoadingTable(true)
    try {
      const response = await apiSchedule.get(
        `/api/${
          viewType === 'list' ? 'Tarefa?' : 'Agenda/Calendario/'
        }${tableConfigQuery}${
          viewType === 'list' ? tableSearchQuery : ''
        }${simpleSearchQuery}`,
      )
      setTableData(response.data)
      setLoadingTable(false)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os dados da tabela')
    }
  }

  useEffect(() => {
    setUpdateKey(key => key + 1)
  }, [])

  const startSearch = async () => {
    const simpleSearchQuery = mountSearchQuery(tags)
    setSimpleSearchQuery(simpleSearchQuery)
    setTableSearchQuery(tableSearchQuery)
    setUpdateKey(key => key + 1)
  }

  useEffect(() => {
    if (tags.length > 0) {
      startSearch()
    }
  }, [tags])

  useEffect(() => {
    if (updateKey > 0) {
      getTableData()
    } else {
      getInitialSearch('Agenda', 'crm', setTags)
    }
  }, [updateKey, tableSearchQuery])

  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    if (franchises && franchises.length > 0) {
      setSelectedFranchise(franchises[0]?.id)
    }
  }, [franchises])

  const [listDateFilter, setListFilterDate] = useState([moment(), moment()])
  useEffect(() => {
    if (viewType === 'calendar') {
      setListFilterDate(selectedDate)
      setSelectedDate([moment().startOf('month'), moment().endOf('month')])
    } else {
      setSelectedDate(listDateFilter)
    }
  }, [viewType])

  useEffect(() => {
    if ((franchisee && selectedFranchise) || !franchisee) {
      let formattedDate = `${moment(selectedDate[0]).format(
        'YYYY-MM-DD',
      )}|${moment(selectedDate[1]).format('YYYY-MM-DD')}`

      if (viewType === 'calendar') {
        switch (selectedPeriod) {
          case 'day':
          case 'daily':
            formattedDate = `${moment(selectedDate[0]).format(
              'YYYY-MM-DD',
            )}|${moment(selectedDate[1])
              .add(1, 'day')
              .format('YYYY-MM-DD')}`
            break
          case 'week':
          case 'weekly':
            formattedDate = `${moment(selectedDate[0])
              .startOf('week')
              .format('YYYY-MM-DD')}|${moment(selectedDate[1])
              .endOf('week')
              .add(1, 'day')
              .format('YYYY-MM-DD')}`
            break
          case 'month':
            formattedDate = `${moment(selectedDate[0])
              .startOf('month')
              .format('YYYY-MM-DD')}|${moment(selectedDate[1])
              .endOf('month')
              .add(1, 'day')
              .format('YYYY-MM-DD')}`
            break

          default:
            break
        }
      }
      setTableConfigQuery(
        `${
          viewType === 'list'
            ? `periodo=${formattedDate}&`
            : `${formattedDate}?`
        }${
          selectedCollaborator?.length > 0
            ? `Colaborador=${selectedCollaborator.join('|')}&`
            : ''
        }${
          selectedFranchise
            ? `Franquias=${selectedFranchise}&RetornaTodas=false&`
            : franchisee
            ? 'RetornaTodas=true&'
            : 'RetornaTodas=false&'
        }`,
      )
      setUpdateKey(key => key + 1)
    }
  }, [selectedFranchise, selectedDate, selectedPeriod, selectedCollaborator])

  useEffect(() => {
    setKeyTable(key => key + 1)
  }, [tableData])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  async function completeTask(taskId) {
    const body = { tasks: [{ taskId, realizedDate: moment() }] }
    const serverReturnSuccess = await sendDataToServer(
      apiCRM,
      'put',
      '/api/CRM/TaskCompleted',
      'Não foi possível concluir a tarefa',
      body,
    )
    if (serverReturnSuccess) {
      setUpdateKey(key => key + 1)
    }
  }

  const [editData, setEditData] = useState({})

  const [visibleTaskModal, setVisibleTaskModal] = useState(false)
  const [editTaskId, setEditTaskId] = useState(0)
  const [taskType, setTaskType] = useState()
  const [canAlterTask, setCanAlterTask] = useState(true)

  return {
    screenConfig,
    tableSearchQuery,
    setTableSearchQuery,
    tags,
    setTags,
    selectedRows,
    startSearch,
    rowSelection,
    editData,
    setEditData,
    tableData,
    loadingTable,
    selectedDate,
    setSelectedDate,
    selectedPeriod,
    setSelectedPeriod,
    viewType,
    setViewType,
    visibleTaskModal,
    setVisibleTaskModal,
    editTaskId,
    setEditTaskId,
    taskType,
    setTaskType,
    canAlterTask,
    setCanAlterTask,
    collaborators,
    loadingCollaborators,
    selectedCollaborator,
    setSelectedCollaborator,
    setUpdateKey,
    keyTable,
    franchisee,
    franchises,
    loadingFranchises,
    selectedFranchise,
    setSelectedFranchise,
    completeTask,
  }
}

const [ScheduleProvider, useScheduleContext] = constate(useSchedule)

export { ScheduleProvider, useScheduleContext }
