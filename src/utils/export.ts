import { apiFinancial, apiBankTransaction } from '@services/api'
import { exportExcelFormat, handleAuthError, getFileName } from '@utils'
import { message } from 'antd'
import { axiosType } from './generics'

/** Aqui ficam métodos para exportação de arquivos */

/** Função global da aplicação na hora de exportar.
 *  Ela envia os dados para a api criar o excel
 */
export const exportExcel = async (
  nome,
  filtros,
  colunas,
  valores,
  nomeArquivo,
  setLoadingExport,
) => {
  setLoadingExport(true)
  try {
    const body = {
      nomeRelatorio: nome,
      filtros,
      colunas,
      valores,
    }
    const response = await apiFinancial({
      url: `/api/Excel`,
      method: 'POST',
      responseType: 'blob',
      data: {
        ...body,
      },
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${exportExcelFormat(nomeArquivo)}.xlsx`)
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    handleAuthError(error)
  }
  setLoadingExport(false)
}

/** Função genérica para baixar PDF da api */
export async function getPDFApi(
  api: typeof axiosType,
  method: string,
  endpoint: string,
  params: object,
  service: string,
  masculine: boolean,
  open: boolean,
  isLoop: boolean,
) {
  try {
    const response = await api({
      method,
      url: endpoint,
      params,
      responseType: 'blob', // important
    })
    const { data } = response
    const url = window.URL.createObjectURL(
      new Blob([data], { type: response.headers['content-type'] }),
    )
    const link = document.createElement('a')
    const contentDisposition = response.headers['content-disposition']
    const fileName = getFileName(contentDisposition)
    link.href = url
    link.setAttribute('download', `${fileName}.pdf`)
    document.body.appendChild(link)
    return open ? window.open(url) : link.click()
  } catch (error) {
    const preposition = masculine ? 'do' : 'da'
    const endPhrase = `${preposition} ${service}!`
    return isLoop
      ? false
      : message.error(`Erro ao fazer download  ${endPhrase}`)
  }
}

/** Função específica para download do Boleto nas telas do Faturamento e
 * do Financeiro
 */
export function getBillPDFApi(
  bankTransactionId: string,
  operatorType: number,
  open: boolean,
  isLoop: boolean,
) {
  const params = {
    transacaoBancariaId: bankTransactionId,
    tipoOperador: operatorType,
  }
  return getPDFApi(
    apiBankTransaction,
    'GET',
    '/api/Boleto/GerarBoletoPDF',
    params,
    'Boleto',
    true,
    open,
    isLoop,
  )
}
