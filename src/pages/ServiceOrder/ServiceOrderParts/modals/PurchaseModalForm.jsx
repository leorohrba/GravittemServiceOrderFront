/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from '@ant-design/compatible'
import NewAutoComplete from '@components/NewAutoComplete'
import NewSelect from '@components/NewSelect'
import { apiMaterialRequest } from '@services/api'
import {
  Col,
  Input,
  Row,
} from 'antd'
import { handleAuthError } from '@utils'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { TextArea } = Input
const PurchaseModalForm = React.forwardRef((props, ref) => {
  
  const {  form  } = props

  useEffect(() => {
    getTipoPedido()
    getCondicaoPagamento()
  },[])

  async function getTipoPedido() {
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/Purchase/TipoPedidoCompra`,
      })
      const { data } = response
      setTipoPedido(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }  

  async function getCondicaoPagamento() {
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/Purchase/CondicaoPagamento`,
      })
      const { data } = response
      setCondicaoPagamento(data || [])
    } catch (error) {
      handleAuthError(error)
    }
  }  

  const { getFieldDecorator } = form
  const [tipoPedido, setTipoPedido] = useState([])
  const [fornecedor, setFornecedor] = useState([])
  const [condicaoPagamento, setCondicaoPagamento] = useState([])

  return (
    <Form layout="vertical">
      <Row gutter={12} type="flex">
        <Col span={12}>
          <NewAutoComplete
            form={form}
            ref={ref}
            autoFocus
            source={fornecedor}
            setSource={setFornecedor}
            defaultValue={null}
            fieldName="fornecedorId"
            serviceApi={apiMaterialRequest}
            api="/api/purchase/fornecedor"
            paramName="nome"
            label="Fornecedor"
            placeholder="Digite o nome do fornecedor"
            recordId="id"
            recordDescription="nome"
            required
          />
        </Col>  
        <Col span={12}>
          <NewSelect
            form={form}
            options={tipoPedido}
            optionValue="id"
            optionLabel="descricao"
            fieldName="tipoPedidoId"
            label="Tipo do pedido"
            placeholder="Selecione..."
            required
            defaultValue={null}
            optionLabelProp="label"
          />  
        </Col>  
      </Row>
      <Row>
        <Col span={12}>
          <NewSelect
            form={form}
            options={condicaoPagamento}
            optionValue="id"
            optionLabel="descricao"
            fieldName="condicaoPagamentoId"
            defaultValue={null}
            label="Condição de pagamento"
            placeholder="Selecione..."
            required
            optionLabelProp="label"
          />  
        </Col>  
      </Row>
      <Row className="w-full">
        <Col span={24}>
          <Form.Item label="Observação" className="mb-0">
            {getFieldDecorator('observacao')(<TextArea className="w-full" />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
})

PurchaseModalForm.propTypes = {
  form: PropTypes.any,
}

export default PurchaseModalForm
