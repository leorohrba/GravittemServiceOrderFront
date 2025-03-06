import { AxiosInstance } from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { handleAuthError } from '@utils'

import { apiNewContract } from '@services/api'

export async function getServiceUtils(
  url: string,
  setState: Dispatch<SetStateAction<any>>,
  setLoading: Dispatch<SetStateAction<boolean>> = null,
  api: AxiosInstance = apiNewContract,
  campoJson = null,
  params = null,
) {
  try {
    setLoading && setLoading(true)
    const response = await api({
      method: 'GET',
      url: url,
      params: params
    })
    setState && setState(campoJson ? response.data?.[campoJson] : response.data || [])
    setLoading && setLoading(false)
    return response.data
  } catch (error) {
    setLoading && setLoading(true)
    handleAuthError(error)
  }
}
