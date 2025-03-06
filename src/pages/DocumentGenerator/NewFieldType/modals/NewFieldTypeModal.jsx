import { apiLayoutGenerator } from '@services/api'
import { isObjEmpty, sendDataToServer } from '@utils'
import { Button, Form, Modal, Row } from 'antd'
import React, { useEffect } from 'react'
import { useNewFieldTypeContext } from '../context/DocumentGeneratorContext'
import NewFieldTypeModalForm from './NewFieldTypeModalForm'

export default function NewFieldTypeModal() {
  const [form] = Form.useForm()
  const documentTypeId =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('documentTypeId')
      : ''
  const {
    newFieldTypeModalVisible,
    setNewFieldTypeModalVisible,
    getData,
    editData,
    setEditData,
  } = useNewFieldTypeContext()
  const isEdit = !isObjEmpty(editData)
  useEffect(() => {
    if (isEdit) {
      setNewFieldTypeModalVisible(true)
    }
  }, [isEdit])

  useEffect(() => {
    if (!newFieldTypeModalVisible) {
      setEditData({})
    }
  }, [newFieldTypeModalVisible])

  const onSave = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onCreate(values)
      })
      .catch(info => {
        // eslint-disable-next-line no-console
        console.log('Validate Failed:', info)
      })
  }

  const onCreate = async values => {
    const body = {
      descricao: values.descricao,
      status: values.status ? 1 : 2,
      icone: values.icone,
      tipoDocumentoId: documentTypeId,
      categoriaObjetoId: editData.categoriaObjetoId
        ? editData.categoriaObjetoId
        : '',
    }
    const serverReturnSuccess = await sendDataToServer(
      apiLayoutGenerator,
      'post',
      `/api/CategoriaObjeto`,
      'Não foi possível salvar as informações',
      body,
    )
    if (serverReturnSuccess) {
      setNewFieldTypeModalVisible(false)
      getData()
    }
  }

  return (
    <Modal
      title="Cadastrar tipo de campo"
      visible={newFieldTypeModalVisible}
      destroyOnClose
      onCancel={() => setNewFieldTypeModalVisible(false)}
      footer={
        <Row>
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={onSave}
          >
            Salvar
          </Button>
          <Button onClick={() => setNewFieldTypeModalVisible(false)}>
            Voltar
          </Button>
        </Row>
      }
    >
      <NewFieldTypeModalForm form={form} />
    </Modal>
  )
}
