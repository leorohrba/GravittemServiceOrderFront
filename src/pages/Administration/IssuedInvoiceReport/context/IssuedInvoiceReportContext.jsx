import { apiFinancial } from '@services/api'
import { handleAuthError } from '@utils'
import { useGetDataFromServer } from '@utils/customHooks'
import { Form, message } from 'antd'
import constate from 'constate'
import moment from 'moment'
import { useState } from 'react'

function useIssuedInvoiceReport() {
  const [form] = Form.useForm()
  const [reportData, setReportData] = useState()
  const [loadingData, setLoadingData] = useState(false)
  const [filterTags, setFilterTags] = useState([])
  const [tags, setTags] = useState()
  const [periodType, setPeriodType] = useState(2)
  const [selectedPeriod, setSelectedPeriod] = useState()
  const [personTags, setPersonTags] = useState([])
  const [reportPeriod, setReportPeriod] = useState()
  const [reportPeriodType, setReportPeriodType] = useState()

  const [otherFilterOptions, loadingFilterOptions] = useGetDataFromServer(
    apiFinancial,
    `/api/TransacaoBancaria/Campos`,
    'Não foi possível obter as opções de filtro',
    true,
  )

  const getReport = () => {
    form
      .validateFields()
      .then(values => {
        generateReport()
      })
      .catch(error => {
        form.scrollToField(error.errorFields[0].name[0])
      })
  }

  const generateReport = async () => {
    setLoadingData(true)
    try {
      const params = {
        administration: true,
        empresasIds: personTags.map(t => t.id).join('|'),
        periodoVencimento:
          periodType === 1
            ? `${moment(selectedPeriod[0]).format('YYYY-MM-DD')}|${moment(
                selectedPeriod[1],
              )
                .add(1, 'day')
                .format('YYYY-MM-DD')}`
            : '',
        periodoEmissao:
          periodType === 2
            ? `${moment(selectedPeriod[0]).format('YYYY-MM-DD')}|${moment(
                selectedPeriod[1],
              )
                .add(1, 'day')
                .format('YYYY-MM-DD')}`
            : '',
        periodoPagamento:
          periodType === 3
            ? `${moment(selectedPeriod[0]).format('YYYY-MM-DD')}|${moment(
                selectedPeriod[1],
              )
                .add(1, 'day')
                .format('YYYY-MM-DD')}`
            : '',
        periodoDeposito:
          periodType === 4
            ? `${moment(selectedPeriod[0]).format('YYYY-MM-DD')}|${moment(
                selectedPeriod[1],
              )
                .add(1, 'day')
                .format('YYYY-MM-DD')}`
            : '',
        numeroTitulo: filterTags
          .filter(t => t.fieldValue === 'NumeroTitulo')
          .map(t => t.searchFieldValue)
          .join('|'),
        nossoNumero: filterTags
          .filter(t => t.fieldValue === 'NossoNumero')
          .map(t => t.searchFieldValue)
          .join('|'),
        pagador: filterTags
          .filter(t => t.fieldValue === 'Pagador')
          .map(t => t.searchFieldValue)
          .join('|'),
        numeroBoleto: filterTags
          .filter(t => t.fieldValue === 'NumeroBoleto')
          .map(t => t.searchFieldValue)
          .join('|'),
        contaCorrente: filterTags
          .filter(t => t.fieldValue === 'ContaCorrente')
          .map(t => t.searchFieldValue)
          .join('|'),
        status: filterTags
          .filter(t => t.fieldValue === 'Status')
          .map(t => t.searchFieldValue)
          .join('|'),
        fatura: filterTags
          .filter(t => t.fieldValue === 'Fatura')
          .map(t => t.searchFieldValue)
          .join('|'),
      }
      setTags(JSON.stringify(filterTags))
      setReportPeriod(selectedPeriod)
      setReportPeriodType(periodType)
      const response = await apiFinancial.get(`api/TransacaoBancaria`, {
        params,
      })
      if (response) {
        setReportData(response.data)
        setLoadingData(false)
      }
    } catch (error) {
      handleAuthError(error)
      if (error.response?.data?.notificacoes?.length > 0) {
        message.error(error.response.data.notificacoes?.[0].mensagem)
      } else if (error.response?.data?.mensagem) {
        message.error(error.response.data.mensagem)
      }
      setLoadingData(false)
    }
  }

  return {
    form,
    reportData,
    loadingData,
    getReport,
    generateReport,
    periodType,
    setPeriodType,
    selectedPeriod,
    setSelectedPeriod,
    otherFilterOptions,
    loadingFilterOptions,
    tags,
    setTags,
    filterTags,
    setFilterTags,
    personTags,
    setPersonTags,
    reportPeriod,
    reportPeriodType,
  }
}

const [IssuedInvoiceReportProvider, useIssuedInvoiceReportContext] = constate(
  useIssuedInvoiceReport,
)

export { IssuedInvoiceReportProvider, useIssuedInvoiceReportContext }
