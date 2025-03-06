import { Form } from '@ant-design/compatible'
import { Button, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ResellerModalForm from './ResellerModalForm'

function ResellerModal({
  form,
  visibleResellerModal,
  setVisibleResellerModal,
}) {
  const [searchValue, setSearchValue] = useState()

  return (
    <Modal
      title="Revendedor"
      visible={false}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
          >
            Salvar
          </Button>
          <Button type="secondary">Cancelar</Button>
        </Row>
      }
    >
      <ResellerModalForm
        form={form}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    </Modal>
  )
}

ResellerModal.propTypes = {
  form: PropTypes.any,
  setVisibleResellerModal: PropTypes.any,
  visibleResellerModal: PropTypes.bool,
}

const WrappedResellerModal = Form.create()(ResellerModal)
export default WrappedResellerModal
