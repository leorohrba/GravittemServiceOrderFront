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
import { formatMessage } from 'umi-plugin-react/locale'
import { message } from 'antd'

let params = {}

function useHourClassification() {
  const [tags, setTags] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState()
  const [searchOptions, setSearchOptions] = useState([])
  const [userPermissions, setUserPermissions] = useState(null)
  const [editData, setEditData] = useState(null)
  const [data, setData] = useState([])
  const [visibleHourClassificationModal, setVisibleHourClassificationModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [enums, setEnums] = useState([])

  useEffect(() => {
    params = {}
    setPermissions()
    getSearchOptions()
    getEnums()
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
        url: `/api/ConfiguracaoHora/campos`,
      })
      const { data } = response
      setSearchOptions(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }  

  async function getEnums() {
    try {
      const response = await apiSchedule({
        method: 'GET',
        url: `/api/Enumerador`,
        params: { entidade: 'ConfiguracaoHoraDia' }
      })
      const { data } = response
      setEnums(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }  

  async function getData() {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiSchedule({
        method: 'GET',
        url: `/api/ConfiguracaoHora`,
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

  async function deleteRecords() {
    setLoading(true)
    try {
      const response = await apiSchedule({
        method: 'DELETE',
        url: `/api/ConfiguracaoHora`,
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

  return {
    loading,
    enums,
    userPermissions,
    deleteRecords,
    tags,
    setTags,
    selectedRows,
    startSearch,
    searchOptions,
    rowSelection,
    editData,
    setEditData,
    data,
    setData,
    getData,
    dropdownVisible,
    setDropdownVisible,
    visibleHourClassificationModal,
    setVisibleHourClassificationModal,
  }
}

const [HourClassificationProvider, useHourClassificationContext] = constate(
  useHourClassification,
)

export { HourClassificationProvider, useHourClassificationContext }
