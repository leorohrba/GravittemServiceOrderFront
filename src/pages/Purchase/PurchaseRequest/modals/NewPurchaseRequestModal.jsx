import { isObjEmpty } from '@utils'
import { Button, Form, message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { usePurchaseRequestContext } from '../context/PurchaseRequestContext'
import NewPurchaseRequestModalForm from './NewPurchaseRequestModalForm'

export default function NewPurchaseRequestModal() {
  const {
    visiblePurchaseRequestModal,
    setVisiblePurchaseRequestModal,
    data,
    setData,
    editData,
    setEditData,
  } = usePurchaseRequestContext()

  const [form] = Form.useForm()

  const isEdit = !isObjEmpty(editData)

  function handleSave() {
    form.validateFields().then(values => {
      const newData = {
        descricao: values.item,
        solicitado: values.solicitado,
        motivo: values.motivo,
      }
      setData([...data, { ...newData }])
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      handleClose()
    })
  }

  function handleEdit() {
    form.validateFields().then(values => {
      const index = data.findIndex(d => d === editData)
      setData(
        update(data, {
          [index]: {
            descricao: { $set: values.item },
            solicitado: { $set: values.solicitado },
            motivo: { $set: values.motivo },
          },
        }),
      )
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      handleClose()
    })
  }

  function handleClose() {
    setEditData({})
    form.resetFields()
    setVisiblePurchaseRequestModal(false)
  }

  return (
    <Modal
      title="Solicitação de compra"
      destroyOnClose
      visible={visiblePurchaseRequestModal}
      onCancel={handleClose}
      footer={
        <Row>
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => (isEdit ? handleEdit() : handleSave())}
          >
            Salvar
          </Button>
          <Button type="secondary" className="ml-3" onClick={handleClose}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <NewPurchaseRequestModalForm {...{ form }} />
    </Modal>
  )
}
