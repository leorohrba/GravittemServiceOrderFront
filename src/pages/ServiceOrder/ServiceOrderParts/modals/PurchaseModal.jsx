/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from '@ant-design/compatible'
import { fieldsValidationToast, handleAuthError } from '@utils'
import { Button, message, Modal, Row , Alert } from 'antd'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import PurchaseModalForm from './PurchaseModalForm'
import { apiMaterialRequest } from '@services/api'
import moment from 'moment'

function PurchaseModal({
  form,
  visible,
  setVisible,
  selectedRows,
  serviceOrderId,
  refreshGrid,
}) {

  const [isSaving, setIsSaving] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])
  const refAlert = React.useRef()
  const refFornecedor = React.useRef()

  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
  }, [visible])
  
  useEffect(() => {
    if (alertMessages.length > 0 && refAlert.current) {
      refAlert.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [alertMessages])
  
  
  function handleSave(e) {
    e && e.preventDefault()
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        savePurchase()
      }
    })
  }
  
  const getQuantity = (d) => d.quantityMissing ? d.quantityMissing : d.quantity

  async function savePurchase() {
    setIsSaving(true)
    const corpo = {
      fornecedorId: form.getFieldValue('fornecedorId'),
      dataCompra: moment().format('YYYY-MM-DD HH:mm:ss'),
      tipoPedidoId: form.getFieldValue('tipoPedidoId'),
      condicaoPagamentoId: form.getFieldValue('condicaoPagamentoId'),
      ordemServicoId: serviceOrderId,
      observacao: form.getFieldValue('observacao'),
      itens: selectedRows.map((d) => ({
         itemId: d.partId,
         localEstoqueId: d.stockLocationId,
         serviceOrderPartId: d.serviceOrderPartId,
         quantidade: getQuantity(d),
         percentualDesconto: (d.unitValue * getQuantity(d)) > 0 ? Math.round(10000 *d.discountValue / (d.unitValue * getQuantity(d))) / 100 : null,
         valorDesconto: d.discountValue,
         valorUnitario: d.unitValue,
         descricaoItem: d.partDescription,
      }))
    }
    try {
      const response = await apiMaterialRequest({
        method: 'POST',
        url: `/api/purchase/GerarPedidoCompra`,
        data: corpo,
      })
      setIsSaving(false)
      const { data } = response
      if (data.isOk) {
        message.success(
          `Pedido ${data.sequenceNumberGenerated} gerado com sucesso!`
        )
        refreshGrid()
        setVisible(false)
      } else {
        setAlertMessages(data.validationMessageList)
        message.error('Não foi possível gerar o pedido de compra!')
      }
      
    } catch (error) {
      handleAuthError(error)
    }
  }  

  return (
    <React.Fragment>
      <Modal
        title="Confirmar pedido"
        visible={visible}
        destroyOnClose
        centered
        width={700}
        onOk={(e) => handleSave(e)}
        onCancel={() => setVisible(false)}
        footer={
          <Row type="flex">
            <Button
              loading={isSaving}
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              onClick={(e) => handleSave(e)}
            >
              {formatMessage({ id: 'saveButton' })}
            </Button>
            <Button
              type="secondary"
              onClick={() => setVisible(false)}
            >
              {formatMessage({ id: 'cancelButton' })}
            </Button>
          </Row>
        }
      >
        <div ref={refAlert}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}
        </div>
        <PurchaseModalForm
          form={form}
          ref={refFornecedor}
        />
      </Modal>
    </React.Fragment>
  )
}

PurchaseModal.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.any,
  setVisible: PropTypes.any,
  selectedRows: PropTypes.array,
  serviceOrderId: PropTypes.any,
  refreshGrid: PropTypes.func,
}

const WrappedPurchaseModal = Form.create()(PurchaseModal)
export default WrappedPurchaseModal
