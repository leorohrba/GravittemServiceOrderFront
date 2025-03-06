import { Button, message, Modal, Radio } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import CapacityModalExceptionTable from './CapacityModalExceptionTable'
import CapacityModalTable from './CapacityModalTable'

export default function CapacityModal({ capacityModal, setCapacityModal }) {
  const [selectedType, setSelectedType] = useState(1)

  function handleSave() {
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    setCapacityModal(false)
  }

  return (
    <Modal
      title="Capacidade de agendamento"
      visible={capacityModal}
      width="50%"
      onCancel={() => setCapacityModal(false)}
      footer={
        <div className="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            onClick={() => setCapacityModal(false)}
          >
            Cancelar
          </Button>
        </div>
      }
    >
      <Radio.Group
        defaultValue={selectedType}
        onChange={e => setSelectedType(e.target.value)}
      >
        <Radio value={1} className="block mb-2">
          Utilizar capacidade disponível
        </Radio>
        <Radio value={2}>Utilizar capacidade fixa</Radio>
      </Radio.Group>
      {selectedType === 2 && (
        <React.Fragment>
          <CapacityModalTable />
          <CapacityModalExceptionTable />
        </React.Fragment>
      )}
    </Modal>
  )
}

CapacityModal.propTypes = {
  capacityModal: PropTypes.bool,
  setCapacityModal: PropTypes.func,
}
