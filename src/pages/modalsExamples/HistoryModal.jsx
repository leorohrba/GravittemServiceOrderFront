/* eslint-disable react/no-unused-prop-types */
import HistoryModal from '@components/modals/HistoryModal'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

export default function HistoryModalExample() {
  const [history, setHistory] = useState([])
  const [historyModalVisible, setHistoryModalVisible] = useState(false)
  const entityId = 'b7eb9de6-2ff1-4a74-a25e-eafa2a14efa0'

  return (
    <HistoryModal
      {...{
        history,
        historyModalVisible,
        setHistoryModalVisible,
        setHistory,
        entityId,
      }}
    />
  )
}

HistoryModal.propTypes = {
  data: PropTypes.array,
}
