import { Form } from '@ant-design/compatible'
import { fieldsValidationToast } from '@utils'
import { Button, message, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import PrintLabelForm from './PrintLabelForm'

function PrintLabel({ form }) {
  function printLabel() {
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        message.success('Impressão realizada com sucesso!')
        form.resetFields()
      }
    })
  }

  return (
    <Modal
      title="Imprimir etiqueta"
      width={450}
      visible={false}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={printLabel}
          >
            Imprimir etiqueta
          </Button>
          <Button type="secondary">Cancelar</Button>
        </Row>
      }
    >
      <PrintLabelForm form={form} />
    </Modal>
  )
}

PrintLabel.propTypes = {
  form: PropTypes.any,
}

const WrappedPrintLabel = Form.create()(PrintLabel)
export default WrappedPrintLabel
