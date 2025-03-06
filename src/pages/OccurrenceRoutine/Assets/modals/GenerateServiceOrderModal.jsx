import { Form } from '@ant-design/compatible'
import { Button, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import GenerateServiceOrderModalForm from './GenerateServiceOrderModalForm'

function GenerateServiceOrderModal({ form }) {
  return (
    <Modal
      title="Gerar ordem de serviço"
      visible={false}
      footer={
        <Row type="flex">
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            Gerar ordem de serviço
          </Button>
          <Button type="secondary">Cancelar</Button>
        </Row>
      }
    >
      <GenerateServiceOrderModalForm form={form} />
    </Modal>
  )
}

GenerateServiceOrderModal.propTypes = {
  form: PropTypes.any,
}

const WrappedGenerateServiceOrderModal = Form.create()(
  GenerateServiceOrderModal,
)
export default WrappedGenerateServiceOrderModal
