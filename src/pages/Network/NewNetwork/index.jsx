/**
 * breadcrumb: Nova rede
 */
import { Form } from '@ant-design/compatible'
import Breadcrumb from '@components/Breadcrumb'
import { fieldsValidationToast } from '@utils/index'
import { message } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewNetworkFooter from './components/NewNetworkFooter'
import NewNetworkForm from './components/NewNetworkForm'
import NewNetworkTable from './components/NewNetworkTable'

function NewNetwork({ form }) {
  const [selectedRows, setSelectedRows] = useState([])
  const [participantsData, setParticipantsData] = useState([
    { id: 1, nome: 'Vendas', regiao: 'Joinville', status: 1 },
  ])

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  function handleSave() {
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        form.resetFields()
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
      }
    })
  }

  return (
    <div className="container">
      <Breadcrumb />
      <NewNetworkForm
        {...{ form, selectedRows, participantsData, setParticipantsData }}
      />
      <NewNetworkTable
        {...{ participantsData, setParticipantsData, rowSelection }}
      />
      <NewNetworkFooter {...{ handleSave }} />
    </div>
  )
}

NewNetwork.propTypes = {
  form: PropTypes.shape({
    resetFields: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }),
}

const WrappedNewNetwork = Form.create()(NewNetwork)
export default WrappedNewNetwork
