import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import moment from 'moment'
import LogModalForm from './LogModalForm'
import LogModalTable from './LogModalTable'
import { apiLog } from '@services/api'

function LogModal({ interfaceName, visibleLogModal, setVisibleLogModal }) {
  const [logData, setLogData] = useState([])
  const [initialDate, setInitialDate] = useState(moment())
  const [endDate, setEndDate] = useState(moment())
  const [formVisible, setFormVisible] = useState(true)

  async function getData() {
    const response = await apiLog.get(
      `api/Log/Detalhe/Select?interfaceNome=${interfaceName}&dataInicial=${initialDate.format(
        'MM-DD-YYYY',
      )}${endDate ? `&dataFinal=${endDate.format('MM-DD-YYYY')}` : ''}`,
    )

    setLogData(
      response.data.sort(function(a, b) {
        if (a.data < b.data) {
          return 1
        }
        if (a.data > b.data) {
          return -1
        }
        // a must be equal to b
        return 0
      }),
    )
    setFormVisible(false)
  }
  function handleExit() {
    setVisibleLogModal(false)
    setFormVisible(true)
  }
  return (
    <Modal
      centered
      title="Log de boleto"
      onCancel={() => handleExit()}
      visible={visibleLogModal}
      footer={<Button onClick={() => handleExit()}>Sair</Button>}
    >
      {formVisible ? (
        <LogModalForm
          {...{ initialDate, setInitialDate, endDate, setEndDate, getData }}
        />
      ) : (
        <LogModalTable {...{ logData }} />
      )}
    </Modal>
  )
}

export default LogModal
