import { Button, Form, message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'
import AdditionalWarrantyModalForm from './AdditionalWarrantyModalForm'
import AdditionalWarrantyModalTable from './AdditionalWarrantyModalTable'

export default function AdditionalWarrantyModal() {
  const {
    visibleAdditionalWarrantyModal,
    setVisibleAdditionalWarrantyModal,
  } = useNewAssetContext()

  const [editData, setEditData] = useState()
  const [data, setData] = useState([])

  const [form] = Form.useForm()

  function saveWarranty() {
    form.validateFields().then(values => {
      if (editData) {
        editWarranty(values)
      } else {
        addWarranty(values)
      }
    })
  }

  function addWarranty(values) {
    const newWarranty = {
      key: data.length,
      dataCompra: values.dataCompra,
      terminoGarantiaOriginal: values.terminoGarantiaOriginal,
      tipo: values.tipo.label,
      terminoGarantia: values.terminoGarantia,
    }
    form.resetFields()
    setData([...data, newWarranty])
    message.success('Adicionado com sucesso!')
  }

  function editWarranty(values) {
    const index = data.findIndex(d => d.key === editData.key)
    setData(
      update(data, {
        [index]: {
          key: { $set: editData.key },
          dataCompra: { $set: values.dataCompra },
          terminoGarantiaOriginal: { $set: values.terminoGarantiaOriginal },
          tipo: { $set: values.tipo.label },
          terminoGarantia: { $set: values.terminoGarantia },
        },
      }),
    )
    form.resetFields()
    setEditData()
    message.success('Atualizado com sucesso!')
  }

  function handleSave() {
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    form.resetFields()
    setVisibleAdditionalWarrantyModal(false)
  }

  return (
    <Modal
      title="Garantia adicional"
      visible={visibleAdditionalWarrantyModal}
      destroyOnClose
      onCancel={() => setVisibleAdditionalWarrantyModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button onClick={() => setVisibleAdditionalWarrantyModal(false)}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <AdditionalWarrantyModalForm {...{ form, saveWarranty, editData }} />
      <AdditionalWarrantyModalTable {...{ data, setEditData }} />
    </Modal>
  )
}
