import { Form } from '@ant-design/compatible'
import { Button, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import InstallerModalForm from './InstallerModalForm'

function InstallerModal({ form }) {
  return (
    <Modal
      title="Instalador"
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
      <InstallerModalForm form={form} />
    </Modal>
  )
}

InstallerModal.propTypes = {
  form: PropTypes.any,
}

const WrappedInstallerModal = Form.create()(InstallerModal)
export default WrappedInstallerModal
