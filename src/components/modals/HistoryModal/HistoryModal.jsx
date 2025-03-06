/* eslint-disable react/no-unused-prop-types */
import { Button, Empty, Modal, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import HistoryModalTimeline from './HistoryModalTimeline'

export default function HistoryModal({
  historyModalVisible,
  setHistoryModalVisible,
  history,
  getHistory,
  loading,
}) {
  return (
    <div>
      <Modal
        okButtonProps={{ hidden: true }}
        footer={
          <Row type="flex" align="left">
            <Button align="left" onClick={() => setHistoryModalVisible(false)}>
              Voltar
            </Button>
          </Row>
        }
        centered
        visible={historyModalVisible}
        title="Histórico"
        mode="alternate"
        cancelText="Voltar"
        onCancel={() => setHistoryModalVisible(false)}
      >
        <Spin size="large" spinning={loading}>
          {history.length > 0 ? (
            <HistoryModalTimeline {...{ history }} />
          ) : (
            <Empty />
          )}
        </Spin>
      </Modal>
    </div>
  )
}

HistoryModal.propTypes = {
  history: PropTypes.array,
  setHistoryModalVisible: PropTypes.func,
  historyModalVisible: PropTypes.bool,
  getHistory: PropTypes.func,
  loading: PropTypes.bool,
}
