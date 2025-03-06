import { message } from 'antd'
import axios from 'axios'
import { handleAuthError } from '@utils'

export const axiosType = axios.create()

/** Função de enviarDados para o servidor
 *  feita para substituir a sendDataToServer.
 *   Nas APIs do Back acaba tendo problema com a lista do C#
 *   se utilizar a sendDataToServer
 */

export const sendDataToServerList = async (
  apiHost,
  apiMethod = 'post',
  apiUrl,
  errorMessage,
  body = {},
  returnData = false,
  showSuccessMessage = true,
) => {
  try {
    const response = await apiHost[apiMethod](apiUrl, body)
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

/** Função que cria enums
 *  @param {Array <string>} received - Um array com nome dos enums
 *  @param {string} nameprop - Nome da propriedade do enum
 */
export function createEnums(received, nameprop) {
  return received.map((r, index) => ({ id: index + 1, [nameprop]: r }))
}

export function notNullUndefined(value) {
  return value !== null && value !== undefined
}
