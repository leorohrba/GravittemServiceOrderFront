import { Button, Form, message, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewAssetForm from '../../../Asset/NewAsset/components/NewAssetForm'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

export default function EditAssetModal() {
  const {
    visibleAssetModal,
    setVisibleAssetModal,
  } = useNewServiceOrderContext()

  const [form] = Form.useForm()
  const [tags, setTags] = useState([])

  function saveAsset() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
    })
    setVisibleAssetModal(false)
  }

  return (
    <Modal
      title="Ativo"
      visible={visibleAssetModal}
      width="60%"
      centered
      onCancel={() => setVisibleAssetModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={() => saveAsset()}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            style={{
              marginRight: 'auto',
            }}
            onClick={() => setVisibleAssetModal(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <NewAssetForm {...{ form, tags, setTags }} isModal />
    </Modal>
  )
}
