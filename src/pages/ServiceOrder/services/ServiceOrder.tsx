import { apiAttachment, apiLog } from '@services/api'
import { handleAuthError, showApiMessages } from '@utils'
import { message } from 'antd'
import { ITag } from '../interfaces/ITag'
import { Params } from '../interfaces/Params'
import { SetStateAction } from 'jotai'
import { Dispatch } from 'react'

export async function getLogDetalheImportacaoClear(
  ownerGuid: number,
  tags: ITag[],
) {
  if (!ownerGuid) return

  try {
    const params: Params = {
      EmpresaId: ownerGuid,
      InterfaceLogNome: 'ImportacaoClear',
    }

    tags.forEach(tag => {
      if (tag.fieldType === 'rangeDate') {
        handleRangeDate(tag.searchFieldValue, params)
      } else if (tag.fieldType === 'select') {
        params[tag.fieldValue] = tag.searchFieldValue
      }
    })

    const { data } = await apiLog.get('/api/Log/Inicializacao', { params })

    if (data) {
      localStorage.setItem('jsonData', JSON.stringify(data))
    } else {
      showApiMessages(data)
    }
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getData(logInicializacaoId: number) {
  try {
    const response = await apiLog({
      method: 'GET',
      url: `/api/Log/Detalhe?LogInicializacaoId=${logInicializacaoId}`,
    })
    const { data } = response

    return data
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getLogDetalhes(ownerGuid: string) {
  if (!ownerGuid) return

  try {
    const { data } = await apiLog.get('/api/Log/Inicializacao', {
      params: { EmpresaId: ownerGuid, InterfaceLogNome: 'ImportacaoClear' },
    })

    if (data) {
      localStorage.setItem('jsonData', JSON.stringify(data))
    } else {
      showApiMessages(data)
    }
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getAnexos(logInicializacaoId: string) {
  if (!logInicializacaoId) return

  try {
    const { data } = await apiAttachment.get(`/api/Anexo/${logInicializacaoId}`)

    if (data) {
      localStorage.setItem('anexos', JSON.stringify(data))
    } else {
      showApiMessages(data)
    }
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getSearchOptions() {
  try {
    const { data } = await apiLog.get(`/api/Log/Campos/ImportaPlanilha`)

    if (data) {
      return data
    }
  } catch (error) {
    message.error('Não foi possível obter as informações de pesquisa')
  }
}

function handleRangeDate(searchFieldValue: string[], params: Params) {
  const [dataInicial, dataFinal] = searchFieldValue
  params.DataInicial = new Date(dataInicial).toISOString().substring(0, 10)
  params.DataFinal = new Date(dataFinal).toISOString().substring(0, 10)
}

export const convertServiceOrderId = async (
  id: number,
  setState: SetStateAction<Dispatch<number>>,
) => {
  try {
    const response = await apiService.post(
      `/api/ConversorOrdemServicoIdParaGuid`,
      {
        EntidadeId: id,
        NomeTabela: 'TSERVICE_ORDER_PHOTOS',
      },
    )
    const { data } = response
    if (data.isOk) {
      setState(data?.idGerado)
    } else {
      message.error(data?.message)
    }
  } catch (error) {
    message.error('Erro ao converter o id da ordem de serviço.')
  }
}
