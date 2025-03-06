import axios from 'axios'

export const apiSchedule = axios.create({
  baseURL: process.env.UMI_API_HOST_SCHEDULE,
  headers: { Authorization: getAuthToken() },
})

export const apiNotification = axios.create({
  baseURL: process.env.UMI_API_HOST_NOTIFICATION,
  headers: { Authorization: getAuthToken() },
})

export const apiServices = axios.create({
  baseURL: process.env.UMI_API_SERVICE,
  headers: { Authorization: getAuthToken() },
})

export const apiPerson = axios.create({
  baseURL: process.env.UMI_API_HOST_PERSON,
  headers: { Authorization: getAuthToken() },
})

export const apiAttendance = axios.create({
  baseURL: process.env.UMI_API_HOST_ATTENDANCE,
  headers: { Authorization: getAuthToken() },
})

export const apiFiscal = axios.create({
  baseURL: process.env.UMI_API_HOST_FISCAL,
  headers: { Authorization: getAuthToken() },
})

export const apiNewContract = axios.create({
  baseURL: process.env.UMI_API_HOST_NEW_CONTRACT,
  headers: { Authorization: getAuthToken() },
})

export const apiQuestionnaire = axios.create({
  baseURL: process.env.UMI_API_HOST_QUESTIONNAIRE,
  headers: { Authorization: getAuthToken() },
})

export const apiContract = axios.create({
  baseURL: process.env.UMI_API_HOST_CONTRACT,
  headers: { Authorization: getAuthToken() },
})

export const apiMaterialRequest = axios.create({
  baseURL: process.env.UMI_API_HOST_MATERIAL_REQUEST,
  headers: { Authorization: getAuthToken() },
})

export const apiChecklist = axios.create({
  baseURL: process.env.UMI_API_HOST_CHECKLIST,
  headers: { Authorization: getAuthToken() },
})

export const apiComments = axios.create({
  baseURL: process.env.UMI_API_HOST_COMMENT,
  headers: { Authorization: getAuthToken() },
})

export const apiAttachment = axios.create({
  baseURL: process.env.UMI_API_HOST_ATTACHMENT,
  headers: { Authorization: getAuthToken() },
})

export const apiFinancial = axios.create({
  baseURL: process.env.UMI_API_HOST_FINANCIAL,
  headers: { Authorization: getAuthToken() },
})

export const apiSearch = axios.create({
  baseURL: process.env.UMI_API_HOST_SEARCH,
  headers: { Authorization: getAuthToken() },
})

export const apiRegion = axios.create({
  baseURL: process.env.UMI_API_HOST_REGION,
  headers: { Authorization: getAuthToken() },
})

export const apiCRM = axios.create({
  baseURL: process.env.UMI_API_HOST_CRM,
  headers: { Authorization: getAuthToken() },
})

export const apiGravittem = axios.create({
  baseURL: process.env.UMI_API_HOST_GRAVITTEM,
  headers: { Authorization: getAuthToken() },
})

export const apiLayoutGenerator = axios.create({
  baseURL: process.env.UMI_API_LAYOUT_GENERATOR,
  headers: { Authorization: getAuthToken() },
})

export const apiLog = axios.create({
  baseURL: process.env.UMI_API_HOST_LOG,
  headers: { Authorization: getAuthToken() },
})

export const apiService = axios.create({
  baseURL: process.env.UMI_API_SERVICE,
  headers: { Authorization: getAuthToken() },
})

export const apiRegistration = axios.create({
  baseURL: process.env.UMI_API_HOST_REGISTRATION,
  headers: { Authorization: getAuthToken() },
})

export const apiNFSe = axios.create({
  baseURL: process.env.UMI_API_HOST_NFSE,
  headers: { Authorization: getAuthToken() },
})

export const apiBankTransaction = axios.create({
  baseURL: process.env.UMI_API_HOST_BANKTRANSACTION,
  headers: { Authorization: getAuthToken() },
})

function getAuthToken() {
  const umiToken = process.env.UMI_ENV_TOKEN
  const token =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('token')
      : umiToken
  const authTokenData = token !== null ? token : localStorage.getItem('token')
  localStorage.setItem('token', authTokenData)
  return authTokenData
}
