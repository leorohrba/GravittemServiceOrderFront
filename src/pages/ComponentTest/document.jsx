import { Form } from '@ant-design/compatible'
import Document from '@components/Document'
import PropTypes from 'prop-types'
import React from 'react'

export function Test({ form }) {
  const startSearch = () => {}
  return (
    <div className="flex items-center justify-center">
      <Document
        form={form}
        label="Documento de origem"
        fixedTypeWidth={170}
        startSearch={startSearch}
        // initialValue={!isObjEmpty(editData) ? editData.documentoOrigem : ''}
      />
    </div>
  )
}

Test.propTypes = {
  form: PropTypes.object,
}

const WrappedSimpleSearch = Form.create({ name: 'simple_search' })(Test)

export default WrappedSimpleSearch
