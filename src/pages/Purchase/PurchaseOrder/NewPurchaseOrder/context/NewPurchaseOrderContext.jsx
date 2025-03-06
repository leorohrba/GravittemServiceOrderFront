import { Form } from 'antd'
import constate from 'constate'
import moment from 'moment'
import { useEffect, useState } from 'react'

function useNewPurchaseOrder() {
  const [form] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState([])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }
  const [itemsData, setItemsData] = useState([
    {
      id: 1,
      descricao: 'Tirante',
      codigo: '2280',
      dataSolicitacao: moment(),
      solicitado: 18,
      recebido: 12,
      saldo: 12,
      valorUnitario: 10,
      total: 120,
      status: 1,
      motivo: 'Encontrado produto em estoque',
    },
    {
      id: 3,
      descricao: 'Etc',
      codigo: '5894',
      dataSolicitacao: moment(),
      solicitado: 3,
      recebido: 1,
      saldo: 1,
      valorUnitario: 3.5,
      total: 3.5,
      status: 3,
    },
  ])

  const [provider, setProvider] = useState([
    {
      id: 1,
      nome: 'Whirlpool',
    },
  ])

  const [resumeQuantity, setResumeQuantity] = useState(0)
  const [resumeTotal, setResumeTotal] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const resumeValue = itemsData.reduce(
      (accumulator, { total }) => accumulator + parseFloat(total),
      0,
    )
    setResumeTotal(resumeValue)

    const quantity = itemsData.reduce(
      (accumulator, { solicitado }) => accumulator + parseFloat(solicitado),
      0,
    )
    setResumeQuantity(quantity)
  }, [itemsData])

  useEffect(() => {
    setTotal(resumeTotal)
  }, [])

  return {
    form,
    provider,
    itemsData,
    setItemsData,
    selectedRows,
    rowSelection,
    resumeQuantity,
    resumeTotal,
    total,
    setTotal,
  }
}

const [NewPurchaseOrderProvider, useNewPurchaseOrderContext] = constate(
  useNewPurchaseOrder,
)

export { NewPurchaseOrderProvider, useNewPurchaseOrderContext }
