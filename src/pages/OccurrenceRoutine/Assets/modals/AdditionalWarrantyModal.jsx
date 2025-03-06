import { Form } from '@ant-design/compatible'
import { fieldsValidationToast } from '@utils'
import { Button, message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import AdditionalWarrantyModalForm from './AdditionalWarrantyModalForm'
import AdditionalWarrantyModalTable from './AdditionalWarrantyModalTable'

function AdditionalWarrantyModal({ form }) {
  const [editData, setEditData] = useState()
  const [data, setData] = useState([])

  function saveWarranty() {
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else if (editData) {
        editWarranty(values)
      } else {
        addWarranty(values)
      }
    })
  }

  function addWarranty(values) {
    const newWarranty = {
      purchaseDate: values.purchaseDate,
      originalWarrantyDate: values.originalWarrantyDate,
      type: values.type,
      endDate: values.endDate,
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
          purchaseDate: { $set: values.purchaseDate },
          originalWarrantyDate: { $set: values.originalWarrantyDate },
          type: { $set: values.type },
          endDate: { $set: values.endDate },
        },
      }),
    )
    form.resetFields()
    setEditData()
    message.success('Atualizado com sucesso!')
  }

  return (
    <Modal
      title="Garantia adicional"
      visible={false}
      destroyOnClose
      footer={
        <Row type="flex">
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            Salvar
          </Button>
          <Button type="secondary">Cancelar</Button>
        </Row>
      }
    >
      <AdditionalWarrantyModalForm
        form={form}
        saveWarranty={saveWarranty}
        editData={editData}
      />
      <AdditionalWarrantyModalTable data={data} setEditData={setEditData} />
    </Modal>
  )
}

AdditionalWarrantyModal.propTypes = {
  form: PropTypes.any,
}

const WrappedAdditionalWarrantyModal = Form.create()(AdditionalWarrantyModal)
export default WrappedAdditionalWarrantyModal
