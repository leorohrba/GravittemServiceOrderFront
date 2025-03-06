/* eslint-disable react-hooks/exhaustive-deps */
import constate from 'constate'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { apiSchedule } from '@services/api'
import { Form, message } from 'antd'
import { hasPermission , handleAuthError, getPermissions   } from '@utils'
import { formatMessage } from 'umi-plugin-react/locale'

function useNewCalendar(props) {

  const { calendarId, setCalendarId, onClose } = props
  const [selectedRows, setSelectedRows] = useState([])
  const [visibleAddDateModal, setVisibleAddDateModal] = useState(false)
  const [editSpecialDate, setEditSpecialDate] = useState(null)
  const [datesTable, setDatesTable] = useState([])
  const [hoursTable, setHoursTable] = useState([]) // key, dia, hora, intervalo
  const [userPermissions, setUserPermissions] = useState(null)
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [enums, setEnums] = useState([])
  const [loading, setLoading] = useState(false)
  const [editData, setEditData] = useState(null)
  const [timeZones, setTimeZones] = useState([])
  const [alertMessages, setAlertMessages] = useState([])
  const refContent = React.useRef()

  const [form] = Form.useForm()
  
  useEffect(() => {
    form.resetFields()
    if (editData) {
      const source = []
      editData.datasEspeciais && editData.datasEspeciais.map((d, index) => {
        d.key = index
        source.push(d)
        return true
      })
      setDatesTable(source)
      enums.length > 0 && setHoursTableData(editData.horasTrabalhadas || [])
    } else {
      setDatesTable([])
      enums.length > 0 && setHoursTableData([])
    }
  }, [editData, enums])

  const getTime = (value) => {
    const m = moment().startOf('day')
    const t = value.split(':')
    if (t.length < 2) {
      return m
    }
    m.add(parseInt(t[0]), 'hours')
    m.add(parseInt(t[1]), 'minutes')
    return m
  }

  function setHoursTableData(data) {
    const source = []
    enums.find(x => x.entidade === 'HorasTrabalhadas' && x.propriedade === 'Dia').valores.map((d, index) => {
      const item = data.find(x => x.dia === d.valor)
      source.push({
        key: index,
        id: item?.id,
        dia: d.valor,
        diaDescricao: d.descricao,
        hora: item?.horaInicial ? [getTime(item?.horaInicial), getTime(item?.horaFinal)] : [],
        intervalo: item?.intervaloInicial ? [getTime(item?.intervaloInicial), getTime(item?.intervaloFinal)] : [],
      })
      return true
    })
    setHoursTable(source)
  }

  useEffect(() => {
    setCanBeUpdated((calendarId && hasPermission(userPermissions, 'Alter')) || (!calendarId && hasPermission(userPermissions, 'Include')))
  }, [calendarId, userPermissions])
  
  useEffect(() => {
    if (calendarId) {
      getData(calendarId)
    }
  },[calendarId])

  useEffect(() => {
    setPermissions()
    getEnums()
    getTimeZones()
   }, [])

   async function getEnums() {
    try {
      const response = await apiSchedule({
        method: 'GET',
        url: `/api/Enumerador`,
        params: { entidade: 'Calendario|HorasTrabalhadas|DataEspecial' }
      })
      const { data } = response
      setEnums(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getTimeZones() {
    try {
      const response = await apiSchedule({
        method: 'GET',
        url: `/api/Calendario/FusoHorario`,
      })
      const { data } = response
      setTimeZones(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getData(id) {
    setLoading(true)
    setSelectedRows([])
    try {
      const response = await apiSchedule({
        method: 'GET',
        url: `/api/Calendario`,
        params: { id },
      })
      setLoading(false)
      const { data } = response
      if (data?.length === 0) {
         message.error('Calendário não encontrado!')
      } else {
        setEditData(data[0])
      }
    } catch (error) {
      handleAuthError(error)
    }
  }    

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  const rowSelection = {
    selectedRowKeys: selectedRows.map(d => d.key),
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  function handleSave(close) {
    setAlertMessages([])
    form.validateFields().then(values => {
      save(values, close)
    })
    .catch(errorInfo => {
        form.scrollToField(errorInfo.errorFields[0].name[0])
        message.error('Preencha o(s) campo(s) demarcado(s) corretamente!')
    })
  }

  async function save(values, close) {
    setLoading(true)
    const body = {
      id: editData?.id,
      descricao: values.descricao,
      fusoHorarioId: values.fusoHorarioId,
      status: values.status,
      horarioVerao: values.horarioVerao,
      horasTrabalhadas: hoursTable.filter(d => !(d.hora?.length !== 2 && d.intervalo?.length !== 2)).map((d) => ({
        id: d.id,
        dia: d.dia,
        horaInicial: d.hora?.length === 2 ? d.hora[0].format('HH:mm') : null,
        horaFinal: d.hora?.length === 2 ? d.hora[1].format('HH:mm') : null,  
        intervaloInicial: d.intervalo?.length === 2 ? d.intervalo[0].format('HH:mm') : null,
        intervaloFinal: d.intervalo?.length === 2 ? d.intervalo[1].format('HH:mm') : null,  
      })),
      datasEspeciais: datesTable.map((d) => ({
        id: d.id,
        descricao: d.descricao,
        data: d.data,
        tipo: d.tipo,
        recorrente: d.recorrente,
      }))
    }
    try {
      const response = await apiSchedule({
        method: 'POST',
        url: `/api/Calendario`,
        data: body,
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )

        if (alertMessages.length > 0 && refContent.current) {
          refContent.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }

        if (close) {
          onClose()
        } else if (calendarId !== data.idGerado) {
            setCalendarId(data.idGerado)
          } else {
            getData(calendarId)
          }
        
      } else {
        setAlertMessages(data.notificacoes)
        message.error('Operação não realizada!')
      }

    } catch (error) {
      handleAuthError(error)
    }
  }    

  return {
    form,
    handleSave,
    refContent,
    alertMessages,
    timeZones,
    canBeUpdated,
    loading,
    editData,
    setEditData,
    enums,
    calendarId,
    setCalendarId,
    onClose,
    selectedRows,
    setSelectedRows,
    datesTable,
    setDatesTable,
    rowSelection,
    hoursTable,
    setHoursTable,
    visibleAddDateModal,
    setVisibleAddDateModal,
    editSpecialDate,
    setEditSpecialDate,
  }
}

const [NewCalendarProvider, useNewCalendarContext] = constate(useNewCalendar)

export { NewCalendarProvider, useNewCalendarContext }
