import { apiLog } from '@services/api'
import { handleAuthError, showApiMessages } from '@utils'
import { message } from 'antd'
import { ISearchOptions } from './interfaces/ISearchOptions'
import { IDetailData } from './interfaces/IDetailData'
import { IEnterprise } from './interfaces/IEnterpriseInterface'

export async function getEnterprise(
  setEnterprise: (enterprise: IEnterprise[]) => void,
) {
  try {
    const response = await apiLog({
      method: 'GET',
      url: `/api/Empresa`,
      params: { ocultarEmpresaSemLog: false, empresaLogada: true },
    })
    const { data } = response
    setEnterprise(data || [])
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getSearchOptions(
  setSearchOptions: (data: ISearchOptions) => void,
  setLoadingSearchOptions: (isLoading: boolean) => void,
) {
  try {
    const { data } = await apiLog.get(`/api/Log/Campos/ImportaPlanilha`)

    if (data) {
      setSearchOptions(data)
      setLoadingSearchOptions(false)
    }
  } catch (error) {
    message.error('Não foi possível obter as informações de pesquisa')
  }
}

export async function getDetailData(
  logInicializacaoId: string,
  setLogData: (data: IDetailData[]) => void,
) {
  try {
    const { data } = await apiLog.get(
      `/api/Log/Detalhe?LogInicializacaoId=${logInicializacaoId}`,
    )

    if (data) {
      setLogData(data)
    }
  } catch (error) {
    message.error('Não foi possível obter o detalhe do log')
  }
}
