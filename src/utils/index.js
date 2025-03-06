/* eslint-disable no-bitwise */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-redeclare */
/* eslint-disable no-control-regex */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-param-reassign */
import { isValid as isValidCpf } from '@fnando/cpf'
import { Alert, message, Modal, notification, Spin } from 'antd'
import axios from 'axios'
import image2base64 from 'image-to-base64/browser'
import moment from 'moment'
import 'moment-timezone'
import React from 'react'
import { formatMessage, getLocale } from 'umi-plugin-react/locale'

const { confirm } = Modal

export function NoVisualize({ userPermissions }) {
  return userPermissions === null || userPermissions === undefined ? (
    <div className="container">
      <Spin style={{ marginLeft: '50%', marginTop: '10%' }} size="large" />
    </div>
  ) : (
    <Alert
      className="mx-8 my-8"
      message={<h3>Usuário não tem permissão para visualização dos dados!</h3>}
      type="error"
    />
  )
}

export function hasDuplicateField(list, fieldName) {
  let result = false
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (
        i !== j &&
        list[i][fieldName] &&
        list[j][fieldName] &&
        list[i][fieldName].toLowerCase() === list[j][fieldName].toLowerCase()
      ) {
        result = true
        break
      }
    }
    if (result) {
      break
    }
  }
  return result
}

export function confirmDelete(
  length,
  callback,
  title,
  content,
  okText,
  cancelText,
) {
  confirm({
    title: !title
      ? formatMessage({
          id: length === 1 ? 'confirmDeleteSingular' : 'confirmDeletePlural',
        })
      : length === 1
      ? title[0]
      : title[1],
    content: !content ? null : length === 1 ? content[0] : content[1],
    onOk: () => callback(),
    okType: 'danger',
    cancelText: !cancelText
      ? formatMessage({
          id: 'globalComponents.confirmModal.no',
        })
      : cancelText,
    okText: !okText
      ? formatMessage({
          id: 'globalComponents.confirmModal.yes',
        })
      : okText,
    okButtonProps: { size: 'large' },
    cancelButtonProps: { size: 'large' },
  })
}

export function getEnumDefaultOption(
  enums,
  entity,
  property,
  status,
  filterValues,
) {
  return enums
    .find(x => x.entidade === entity && x.propriedade === property)
    ?.valores?.filter(
      x =>
        (!status || (x.statusValidos && x.statusValidos.includes(status))) &&
        (!filterValues || (filterValues && filterValues.includes(x.valor))),
    ).length > 0
    ? enums
        .find(x => x.entidade === entity && x.propriedade === property)
        .valores.filter(
          x =>
            (!status ||
              (x.statusValidos && x.statusValidos.includes(status))) &&
            (!filterValues || (filterValues && filterValues.includes(x.valor))),
        )[0].valor
    : undefined
}

export function enumExists(enums, entity, property, status, value) {
  return (
    enums
      .find(x => x.entidade === entity && x.propriedade === property)
      ?.valores?.findIndex(
        x =>
          x.valor === value &&
          (!status || (x.statusValidos && x.statusValidos.includes(status))),
      ) >= 0
  )
}

export const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  )
}

export const generateRandomIndex = () => Math.floor(Math.random() * 1000000 + 1)

export const findDeepPathByString = (obj, path) => {
  for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
    if (!obj) {
      // eslint-disable-next-line no-continue
      continue
    }
    obj = obj[path[i]]
  }
  return obj
}

export const getDayFromDate = date => {
  return moment(date).format('DD')
}

export function setParamValues(params, searchOptions, tags, type) {
  searchOptions.map(searchOption => {
    if (searchOption.type === 'rangeDate') {
      setRangeDateParamValue(
        params,
        searchOption.value,
        tags,
        searchOption.paramValueDateFormat,
        searchOption.pickerType,
      )
    } else if (type === 1) {
      params[searchOption.value] =
        tags
          .filter(s => s.fieldValue === searchOption.value)
          .map(tag => tag.searchFieldValue)
          .join('|') || null
    } else {
      params[searchOption.value] = tags
        .filter(s => s.fieldValue === searchOption.value)
        .map(tag =>
          !isNaN(Number(tag.searchFieldValue))
            ? Number(tag.searchFieldValue)
            : tag.searchFieldValue,
        )
    }
    return true
  })
}

function setRangeDateParamValue(
  params,
  fieldValue,
  tags,
  dateFormat,
  pickerType,
) {
  if (!dateFormat) {
    dateFormat = pickerType === 'time' ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD'
  }
  const paramName1 = `${fieldValue}Inicial`
  const paramName2 = `${fieldValue}Final`
  const tag = tags.find(s => s.fieldValue === fieldValue)
  if (tag) {
    params[paramName1] = tag.searchFieldValue[0].format(dateFormat)
    params[paramName2] = tag.searchFieldValue[1].format(dateFormat)
  } else {
    params[paramName1] = null
    params[paramName2] = null
  }
}

export function showApiMessages(data) {
  if (data.mensagens && data.mensagens.length > 0) {
    const messageBody = (
      <React.Fragment>
        {data.mensagens.map((message, index) => (
          <React.Fragment>
            {!!index && <br />}
            <span>{message}</span>
          </React.Fragment>
        ))}
      </React.Fragment>
    )
    message.error(messageBody)
  } else if (data.mensagem) {
    message.error(data.mensagem)
  }
}

export function showApiNotifications(data, type) {
  if (data.notificacoes && data.notificacoes.length > 0) {
    const messageBody = (
      <React.Fragment>
        {data.notificacoes.map((notification, index) => (
          <React.Fragment>
            {!!index && <br />}
            <span>{notification.mensagem}</span>
          </React.Fragment>
        ))}
      </React.Fragment>
    )

    if (type === 'warning') {
      notification.warning({
        message: 'Atenção!',
        description: messageBody,
      })
    } else {
      notification.error({
        message: 'Atenção!',
        description: messageBody,
      })
    }
  }
}

export function useCombinedRefs(...refs) {
  const targetRef = React.useRef()
  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current
      }
    })
  }, [refs])
  return targetRef
}

export function hasPermission(userPermissions, permission) {
  if (!userPermissions) {
    return false
  }
  try {
    return (
      userPermissions.find(o => o.name === permission) !== undefined ||
      userPermissions.find(o =>
        o.permissions?.find(p => p.name === permission),
      ) !== undefined
    )
  } catch {
    return false
  }
}

export function customDateTimeFormat(value, format) {
  if (!value) {
    return null
  }

  const result = moment(value).format(format)
  return result
}

export function getProcessId() {
  const winProcessId = new URLSearchParams(window.location.search).get(
    'processId',
  )
  const processId =
    winProcessId !== null ? winProcessId : localStorage.getItem('processId')

  localStorage.setItem('processId', processId)

  return processId
}

export async function getPermissions(processNames = '') {
  const userPermissions = []
  const processId = getProcessId()

  if (!processId) {
    notification.error({
      message: 'Permissão negada',
      description:
        'Não foi possível carregar permissões de acesso, tente sair e entrar na sua conta novamente',
    })

    return userPermissions
  }
  // return [{ name: 'Visualize' }]
  return getPermissionsById(processId, processNames)
}

export async function getPermissionsById(processId, processNames = '') {
  let userPermissions = []

  if (!axios.defaults.headers.common.Authorization) {
    getAuthToken()
  }

  const url = `${
    process.env.UMI_API_HOST_PERMISSION
  }/api/permission?processId=${processId}${
    processNames ? `&processName=${processNames}` : ''
  }`
  try {
    const permissionsResponse = await axios.get(url)
    userPermissions = permissionsResponse.data
  } catch (error) {
    handleAuthError(error)
  }
  return userPermissions
}

export function getAuthToken() {
  const token =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('token')
      : null

  const authTokenData = token !== null ? token : localStorage.getItem('token')

  localStorage.setItem('token', authTokenData)

  axios.defaults.headers.common.Authorization = authTokenData
}

export function handleAuthError(error) {
  if (
    error?.response !== undefined &&
    (error?.response?.status === 403 || error?.response?.status === 401)
  ) {
    notification.error({
      message: 'Autenticação negada',
      description:
        'Ocorreu um erro de autenticação, tente sair e entrar na sua conta novamente',
    })
  } else if (error?.response?.status !== 400) {
    notification.error({
      message: 'Servidor não encontrado',
      description: 'Não foi possível conectar ao servidor, contate o suporte',
    })
  }
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

export function formatTaskDuration(value) {
  let duration = `${value} minutos`

  if (value > 59 && value < 1440) {
    const hours = Math.floor(value / 60)
    duration = hours.toString()
    const minutes = value - hours * 60
    if (minutes < 10) {
      duration += `:0${minutes.toString()}`
    } else {
      duration += `:${minutes.toString()}`
    }
    duration += ' hs'
  } else if (value >= 1440) {
    const days = Math.round(value / (24 * 60))
    duration = days.toString()
    if (duration > 1) {
      duration += ' dias'
    } else {
      duration += ' dia'
    }
  }

  return duration
}
export function formatTaskDateTime(date, isAllDay) {
  let dateFormated = ''
  try {
    if (isAllDay) {
      dateFormated = moment(date).format('DD MMM')
    } else {
      dateFormated = moment(date).format('DD MMM HH:mm')
    }
  } catch {
    dateFormated = date
  }

  return dateFormated
}

export function customSort(a, b) {
  return !a ? -1 : !b ? 1 : a.toString().localeCompare(b)
}

export function removeAccent(newStringComAcento) {
  let string = newStringComAcento
  const mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
  }

  // eslint-disable-next-line guard-for-in
  for (const letra in mapaAcentosHex) {
    const expressaoRegular = mapaAcentosHex[letra]
    string = string.replace(expressaoRegular, letra)
  }

  return string
}

export function validateByMask(value) {
  const valueWithoutMask = removeNonDigit(value)
  return !(value.indexOf('_') >= 0 && valueWithoutMask.length > 0)
}
export function removeNonDigit(value) {
  try {
    return value.replace(/\D/g, '')
  } catch (error) {
    return false
  }
}

export function removeMask(value) {
  if (value === null || value === undefined) {
    return value
  }
  const result = removeNonDigit(value)
  return result === null ? '' : result
}

export function formatPhone(phone) {
  try {
    if (!phone) {
      // não formatar se for nulo
      return phone
    }
    if (
      phone.indexOf('(') >= 0 ||
      phone.indexOf(')') >= 0 ||
      phone.indexOf('-') >= 0
    ) {
      return phone // entende que o telefone já está formatado
    }

    phone = phone.replace(/\D/g, '') // Remove tudo o que não é dígito
    const { length } = phone
    phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
    phone = phone.replace(/(\d)(\d{4})$/, '$1-$2') // Coloca hífen entre o quarto e o quinto dígitos

    if (length === 8) {
      // entende que o telefone não possui o DDD e retira o parênteses
      phone = phone.split('(').join('')
      phone = phone.split(')').join('')
      phone = phone.split(' ').join('')
    }
  } catch (error) {}

  return phone
}

export function formatZipCode(number) {
  let value = ''

  if (number === '' || number === 0 || number === null) {
    return value
  }
  number = removeNonDigit(number)
  value = zeroesLeft(number.toString(), 8)
  return value.replace(/(\d{5})(\d{3})/g, '$1-$2')
}

export function zeroesLeft(value, digits) {
  if (value.length < digits) {
    let zeroes = ''
    for (let i = 0; i < digits - value.length; i++) {
      zeroes += '0'
    }
    value = zeroes + value
  }
  return value
}

export const getNumberLength = text => {
  if (!text) {
    return 0
  }
  return text.replace(/\D/g, '').length
}

export function formatCellPhone(cellPhone, force) {
  try {
    if (!cellPhone) {
      // não formatar se for nulo
      return cellPhone
    }
    if (force) {
      cellPhone = cellPhone.replace(/\D/g, '')
    }
    if (
      cellPhone.indexOf('(') >= 0 ||
      cellPhone.indexOf(')') >= 0 ||
      cellPhone.indexOf('-') >= 0
    ) {
      return cellPhone // entende que o celular já está formatado
    }

    cellPhone = cellPhone.replace(/\D/g, '') // Remove tudo o que não é dígito
    const { length } = cellPhone
    cellPhone = cellPhone.replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
    cellPhone = cellPhone.replace(/(\d)(\d{4})$/, '$1-$2') // Coloca hífen entre o quarto e o quinto dígitos

    if (length === 9) {
      // entende que o celular não possui o DDD e retira o parênteses
      cellPhone = cellPhone.split('(').join('')
      cellPhone = cellPhone.split(')').join('')
      cellPhone = cellPhone.split(' ').join('')
    }
  } catch (error) {}

  return cellPhone
}

export function replaceAll(str, find, replace) {
  try {
    return str.split(find).join(replace)
  } catch {
    return str
  }
}

export function removeNumberFormatting(value) {
  if (value === null || value === undefined) {
    return null
  }

  value = replaceAll(value, 'R$', '')
  value = replaceAll(value, '%', '')
  value = replaceAll(value, ' ', '')
  value = replaceAll(value, '.', '')
  value = replaceAll(value, ',', '.')
  value = replaceAll(value, '_', '')

  if (value === '') {
    value = null
  }

  return value
}

export function addBrlCurrencyToNumber(number) {
  // Create our number formatter.
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  return formatter.format(number)
}

export function formatNumber(number, fractionDigits) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(number)
}

export function buildAddressLine1(name, number, neighborhood) {
  let result = name
  if (number) {
    result += `, ${number}`
  }
  if (neighborhood) {
    result += ` - ${neighborhood}`
  }
  return result
}

export function buildAddressLine2(cityName, stateAbbreviation) {
  let result = cityName
  if (stateAbbreviation) {
    result += ` - ${stateAbbreviation}`
  }
  return result
}

export function getLocaleCurrency() {
  return getLocale() === 'pt-BR' ? 'BRL' : 'USD'
}

export function getLocaleDateFormat() {
  return getLocale() === 'pt-BR' ? 'DD/MM/YYYY' : 'MM/DD/YYYY'
}

export function getLocalePrefix() {
  return getLocale() === 'pt-BR' ? 'R$ ' : '$ '
}

export function getLocaleDecimalSeparator() {
  return getLocale() === 'pt-BR' ? ',' : '.'
}

export function getLocaleThousandSeparator() {
  return getLocale() === 'pt-BR' ? '.' : ','
}

export function fieldsValidationToast(err, useNotification, showFieldsDebug) {
  let Message
  if (Object.keys(err).length === 1) {
    Message = formatMessage({
      id: 'errorSaveSingleField',
    })
  } else {
    Message = formatMessage({
      id: 'errorSaveMultipleFields',
    })
  }
  if (useNotification) {
    notification.error({
      message: Message,
      description: showFieldsDebug ? JSON.stringify(err) : null,
    })
  } else {
    if (showFieldsDebug) {
      Message += `\n${JSON.stringify(err)}`
    }
    message.error(Message)
  }
}

export function fieldsValidationToastNew(err) {
  if (err?.errorFields.length === 1) {
    message.error(
      formatMessage({
        id: 'errorSaveSingleField',
      }),
    )
  } else {
    message.error(
      formatMessage({
        id: 'errorSaveMultipleFields',
      }),
    )
  }
}

export function timeToDecimal(t) {
  const arr = t.split(':')
  const dec = parseInt((arr[1] / 6) * 10, 10)

  return parseFloat(`${parseInt(arr[0], 10)}.${dec < 10 ? '0' : ''}${dec}`)
}

export function minuteToHourMinute(t) {
  let minutes = t
  const hours = Math.floor(minutes / 60)
  minutes -= hours * 60
  return `${zeroesLeft(hours.toString(), 2)}:${zeroesLeft(
    minutes.toString(),
    2,
  )}`
}

export function getMinutesDuration(duration) {
  if (!duration) {
    return null
  }
  let minutes = parseInt(duration.format('mm'), 10)
  const hours = parseInt(duration.format('HH'), 10)
  minutes += hours * 60
  return minutes
}

export const iconFile = (url, fileName, extension) => {
  if (extension === '.xls' || extension === '.xlsx') {
    return (
      <i
        className="mr-2 fa fa-file-excel-o fa-3x"
        style={{ color: '#1f6f45' }}
      />
    )
  }
  if (extension === '.doc' || extension === '.docx') {
    return (
      <i
        className="mr-2 fa fa-file-word-o fa-3x"
        style={{ color: '#2c5695' }}
      />
    )
  }
  if (extension === '.pdf') {
    return (
      <i className="mr-2 fa fa-file-pdf-o fa-3x" style={{ color: '#d74c42' }} />
    )
  }
  if (extension && extension.match(/.(jpg|jpeg|png|gif|bmp|svg)$/i)) {
    return <img src={url} height={64} width={64} alt={fileName} />
  }
  return <i className="mr-2 fa fa-file-o fa-3x" style={{ color: '#3182ce' }} />
}

export function isEmail(email) {
  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  return re.test(String(email).toLowerCase())
}

export function mountSearchQuery(tags) {
  let query = ''
  // eslint-disable-next-line array-callback-return
  tags.map((tag, index) => {
    const indexOfTag = query.indexOf(`${tag.fieldValue}=`)
    if (indexOfTag !== -1) {
      const positionToInsert = indexOfTag + tag.fieldValue.length + 1
      if (tag.fieldType === 'select') {
        query = [
          query.slice(0, positionToInsert),
          `${tag.searchFieldValue}|`,
          query.slice(positionToInsert),
        ].join('')
      } else {
        query = [
          query.slice(0, positionToInsert),
          `${tag.searchField}|`,
          query.slice(positionToInsert),
        ].join('')
      }
    } else {
      query += '&'
      if (tag.fieldType === 'rangeDate') {
        const splittedRangeDate = tag.searchFieldValue
        const rangeDate = `${moment(splittedRangeDate[0])
          .utc()
          .format('YYYY-MM-DD')}|${moment(splittedRangeDate[1])
          .utc()
          .format('YYYY-MM-DD')}`
        query += `${tag.fieldValue}=${rangeDate}`
      } else if (tag.fieldType === 'select') {
        query += `${tag.fieldValue}=${tag.searchFieldValue}`
      } else {
        query += `${tag.fieldValue}=${tag.searchField}`
      }
    }
  })
  return query
}

export function updateQueryStringTable(searchQuery, pagination, sorter) {
  const newSearchQuery = new URLSearchParams(searchQuery)
  newSearchQuery.set('tamanhoPagina', pagination.pageSize)
  newSearchQuery.set('paginaAtual', pagination.current)
  if (sorter.field && sorter.order) {
    const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'
    const ordenateBy = `${sorter.field}|${sortOrder}`
    newSearchQuery.set('ordenarPor', ordenateBy)
  } else {
    newSearchQuery.set('ordenarPor', '')
  }
  const decodedQueryString = decodeURIComponent(newSearchQuery.toString())
  return decodedQueryString
}

export const getExportData = async (
  { apiHost, screenName },
  searchQuery,
  customDataPath,
) => {
  try {
    // retirar paginação da exportação
    const newTableSearchQuery = new URLSearchParams(searchQuery)
    newTableSearchQuery.delete('tamanhoPagina')
    const newTableSearchQueryDecoded = decodeURIComponent(
      newTableSearchQuery.toString(),
    )
    const response = await apiHost.get(
      `/api/${screenName}?${newTableSearchQueryDecoded}`,
    )
    if (customDataPath) {
      return findDeepPathByString(response, customDataPath)
    }
    return response.data.itens
  } catch (error) {
    handleAuthError(error)
    message.error('Não foi possível obter os dados da exportação')
  }
  return []
}
export function showNotifications(notifications, title) {
  if (notifications.length > 0) {
    const messageBody = (
      <React.Fragment>
        {notifications.map((notification, index) => (
          <React.Fragment>
            {!!index && <br />}
            <span>{notification}</span>
          </React.Fragment>
        ))}
      </React.Fragment>
    )

    notification.error({
      message: title || 'Atenção!',
      description: messageBody,
    })
  }
}

export function getHash() {
  const hash =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('hash')
      : null

  const hashData = hash !== null ? hash : localStorage.getItem('hash')
  localStorage.setItem('hash', hashData)
  return hashData
}

export function isObjEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function getFileName(contentDisposition) {
  let fileName = contentDisposition.substring(
    contentDisposition.indexOf("''") + 2,
    contentDisposition.length,
  )
  fileName = decodeURI(fileName).replace(/\+/g, ' ')
  return fileName
}

export const checkDateIsTodayOrAfterToday = date =>
  !moment(date).isSameOrBefore(moment(), 'day')

export const checkDateIsBeforeToday = date =>
  moment(date).isSameOrBefore(moment(), 'day')

export const dateToUTC = date => {
  const tz = moment.tz.guess() || 'UTC'
  return moment(date)
    .tz(tz)
    .format()
}

export const removeCommaFromNumber = value =>
  parseFloat(value.toString().replace(/,/g, '.'))

export const validateCpfInput = (rule, value, cb) => {
  if (value.split('_').join('').length === 14) {
    if (isValidCpf(value)) return cb()
    return cb(true)
  }
  return cb()
}

export const getAllNumbersFromString = stringToParse =>
  stringToParse.match(/\d/g).join('')

export const sendDataToServer = async (
  apiHost,
  apiMethod = 'post',
  apiUrl,
  errorMessage,
  body = {},
  returnData = false,
  showSuccessMessage = true,
) => {
  try {
    const response = await apiHost[apiMethod](apiUrl, {
      ...body,
    })
    const { data } = response

    if (data.isOk) {
      showSuccessMessage &&
        message.success(
          apiMethod === 'put'
            ? 'Dados atualizados com sucesso'
            : 'Dados salvos com sucesso',
        )
      if (returnData) {
        return data
      }
      return true
    }
    if (data.notificacoes && data.notificacoes.length > 0) {
      data.notificacoes.forEach(n => message.error(n.mensagem, 5))
    } else if (data.mensagem) {
      message.error(data.mensagem)
    } else {
      message.error(errorMessage)
    }
  } catch (error) {
    handleAuthError(error)
    if (error.response.data?.notificacoes?.length > 0) {
      message.error(error.response.data.notificacoes?.[0].mensagem)
    } else if (error.response.data?.mensagem) {
      message.error(error.response.data.mensagem)
    } else {
      message.error(errorMessage)
    }
    return false
  }
  return false
}

export const insertIf = (condition, ...elements) => {
  return condition ? elements : []
}

export function objHasProperty(object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}

export const exportExcelFormat = screenName =>
  `${moment().format('DD-MM-YYYY-HH-mm')}_${screenName}`

export const getImgToBase64 = async img => {
  const result = await image2base64(img).then(response => {
    return `data:image/png;base64,${response}`
  })
  return result || ''
}
