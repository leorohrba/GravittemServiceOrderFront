import constate from 'constate'
import { useState, useEffect } from 'react'
import {
  getPermissions,
  handleAuthError,
  setParamValues,
  showApiMessages,
  showApiNotifications,
} from '@utils'
import { apiSchedule } from '@services/api'
import { message } from 'antd'
import { formatMessage } from 'umi-plugin-react/locale'

let params = {}

function useCalendar() {
  const [tags, setTags] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState()
  const [data, setData] = useState([])
  const [searchOptions, setSearchOptions] = useState([])
  const [userPermissions, setUserPermissions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [screen, setScreen] = useState('Grid')
  const [calendarId, setCalendarId] = useState(null)

  useEffect(() => {
    params = {}
    setPermissions()
    getSearchOptions()
    getData()
   }, [])

   const rowSelection = {
    selectedRowKeys: selectedRows.map(d => d.id),
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }
  
  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }
  
  async function getSearchOptions() {
    try {
      const response = await apiSchedule({
        method: 'GET',
        url: `/api/Calendario/campos`,
      })
      const { data } = response
      setSearchOptions(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }  

  async function deleteRecords() {
    setLoading(true)
    try {
      const response = await apiSchedule({
        method: 'DELETE',
        url: `/api/Calendario`,
        data: { ids: selectedRows.map(record => record.id) },
        headers: { 'Content-Type': 'application/json' },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        getData()
        message.success(
          formatMessage({
            id: 'successDelete',
          }),
        )
        if (data.notificacoes?.length > 0) {
           showApiNotifications(data, 'warning')        
        }
      } else {
        showApiNotifications(data)
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiSchedule({
        method: 'GET',
        url: `/api/Calendario/Select`,
        params,
      })
      setLoading(false)
      const { data } = response
      setData(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }    
  
  const startSearch = () => {
    params = {}
    setParamValues(params, searchOptions, tags, 1)
    getData()
  }

  return {
    deleteRecords,
    calendarId,
    setCalendarId,
    userPermissions,
    loading,
    screen,
    setScreen,
    tags,
    setTags,
    selectedRows,
    startSearch,
    searchOptions,
    rowSelection,
    data,
    setData,
    dropdownVisible,
    setDropdownVisible,
  }
}

const [CalendarProvider, useCalendarContext] = constate(useCalendar)

export { CalendarProvider, useCalendarContext }
