/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, message, Modal, Row } from 'antd'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewCalendarContext } from '../context/NewCalendarContext'
import AddSpecialDateModalForm from './AddSpecialDateModalForm'
import moment from 'moment'

export default function AddSpecialDateModal() {

  const [form] = Form.useForm()
  
  const {
    datesTable,
    setDatesTable,
    visibleAddDateModal,
    setVisibleAddDateModal,
    editSpecialDate,
    enums,
    canBeUpdated,
  } = useNewCalendarContext()

  useEffect(() => {
    if (visibleAddDateModal) {
      form.resetFields()
    }
  },[visibleAddDateModal, editSpecialDate])  

  function handleSave() {
    form.validateFields().then(values => {

      const tipo = enums.find(x => x.entidade === 'DataEspecial' && x.propriedade === 'Tipo').valores.find(x => x.valor === values.tipo)
      let key = editSpecialDate?.key
      if (editSpecialDate === null) {
        const maxIndex = datesTable.map(n => n.key)
        key = Object.keys(maxIndex).length === 0 ? 0 : Math.max(...maxIndex) + 1
        datesTable.push({ key })
      }
      const i = datesTable.findIndex(d => d.key === key)
      if (i < 0) {
        message.error('Erro na atualização da data especial!')
        return
      }

      datesTable[i].descricao = values.descricao
      datesTable[i].data = moment(values.data).format('YYYY-MM-DD')
      datesTable[i].tipo = values.tipo
      datesTable[i].tipoDescricao = tipo?.descricao
      datesTable[i].recorrente = values.recorrente
      setDatesTable([...datesTable])

      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      handleClose()
    })
  }

  function handleClose() {
    setVisibleAddDateModal(false)
  }

  return (
    <Modal
      title={editSpecialDate ? 'Editar data especial' : 'Adicionar data especial'}
      visible={visibleAddDateModal}
      destroyOnClose
      centered
      onCancel={handleClose}
      footer={
        <Row>
          <Button
            disabled={!canBeUpdated}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => handleSave()}
          >
            Salvar
          </Button>
          <Button type="secondary" className="ml-3" onClick={handleClose}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <AddSpecialDateModalForm {...{ form, editSpecialDate }} />
    </Modal>
  )
}
