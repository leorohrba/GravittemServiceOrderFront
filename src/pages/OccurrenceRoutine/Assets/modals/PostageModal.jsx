import { Form } from '@ant-design/compatible'
import { Button, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import PostageModalForm from './PostageModalForm'

function PostageModal({ form }) {
  return (
    <Modal
      title="Postagem"
      visible={false}
      footer={
        <Row type="flex">
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            Salvar
          </Button>
          <Button type="secondary">Cancelar</Button>
        </Row>
      }
    >
      <PostageModalForm form={form} />
    </Modal>
  )
}

PostageModal.propTypes = {
  form: PropTypes.any,
}

const WrappedPostageModal = Form.create()(PostageModal)
export default WrappedPostageModal
