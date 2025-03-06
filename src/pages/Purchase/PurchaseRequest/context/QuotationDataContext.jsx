import { Form } from 'antd'
import constate from 'constate'
import { useEffect, useState } from 'react'

function useQuotationData() {
  const [form] = Form.useForm()
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [data, setData] = useState([
    {
      id: 1,
      item: 'Tirante',
      codigo: '2280',
      quantidade: 10,
      unidade: 'Unidade',
      valorUnitario: 2.5,
      valorTotal: 25,
    },
    {
      id: 3,
      item: 'Etc',
      codigo: '5894',
      quantidade: 5.5,
      unidade: 'Metro',
      valorUnitario: 3,
      valorTotal: 16.5,
    },
  ])

  const fornecedor = {
    nome: 'Millium Tem De Tudo',
    email: 'patricia@millium.com.br',
  }
  const solicitante = 'comercial@softin.com.br'

  const frete = form.getFieldValue('frete')

  useEffect(() => {
    const newSub = data.reduce(
      (accumulator, { valorTotal }) => accumulator + parseFloat(valorTotal),
      0,
    )
    setSubtotal(newSub)
    setTotal(newSub + parseFloat(frete) || 0)
  }, [frete, data])

  return {
    form,
    data,
    setData,
    subtotal,
    total,
    fornecedor,
    solicitante,
    showFeedback,
    setShowFeedback,
  }
}

const [QuotationDataProvider, useQuotationDataContext] = constate(
  useQuotationData,
)

export { QuotationDataProvider, useQuotationDataContext }
