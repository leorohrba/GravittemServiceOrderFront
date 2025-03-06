import { apiService } from "@services/api";
import { handleAuthError, exportExcelFormat } from '@utils'

export async function getExportExcel(
    params: any, 
    setLoading: (loading: boolean) => void
  ) {
    setLoading(true)
    try {
      const response = await apiService({
        url: `/api/BuscarHorasApontadasView/Excel`,
        method: 'GET',
        responseType: 'blob',
        params,
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${exportExcelFormat(`relatório_horas_apontadas`)}.xlsx`,
      )
      document.body.appendChild(link)
      link.click()
      setLoading(false)
    } catch (error) {
      handleAuthError(error)
      setLoading(false)
    }
  }