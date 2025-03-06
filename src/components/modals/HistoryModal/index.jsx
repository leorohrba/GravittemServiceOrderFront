/* eslint-disable react/no-unused-prop-types */
import { apiFinancial } from '@services/api'
import { handleAuthError } from '@utils'
import { Button, Empty, message, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import HistoryModal from './HistoryModal'
import HistoryModalTimeline from './HistoryModalTimeline'

export default function HistoryModalConfig({
  entityId,
  history,
  setHistory,
  hideModal,
  historyModalVisible,
  setHistoryModalVisible,
  buttonClassName,
  showLabel,
  hideLabel,
  showInMenu,
  api,
}) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (entityId && (historyModalVisible || hideModal)) {
      getHistory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, historyModalVisible, hideModal])

  async function getHistory() {
    setLoading(true)
    try {
      const response = api
        ? await api.get(`/api/Historico/${entityId}`)
        : await apiFinancial.get(`/api/Historico/${entityId}`)
      setHistory(response.data)
      setLoading(false)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter o histórico')
    }
  }

  return (
    <React.Fragment>
      {hideModal ? (
        history.length > 0 ? (
          <Spin size="large" spinning={loading}>
            <HistoryModalTimeline {...{ history }} />
          </Spin>
        ) : (
          <Empty />
        )
      ) : (
        <React.Fragment>
          {showLabel ? (
            <div
              role="button"
              className="py-2 px-4 cursor-pointer"
              onClick={() => setHistoryModalVisible(true)}
            >
              Histórico
            </div>
          ) : showInMenu ? (
            <div role="button" onClick={() => setHistoryModalVisible(true)}>
              Histórico
            </div>
          ) : hideLabel ? (
            <Button
              className={buttonClassName}
              disabled={!entityId}
              onClick={() => setHistoryModalVisible(true)}
              shape="circle"
              type="primary"
              ghost
            >
              <i className="fa fa-clock-o fa-lg" />
            </Button>
          ) : (
            <Button
              className={buttonClassName}
              disabled={!entityId}
              onClick={() => setHistoryModalVisible(true)}
              quantity={history.length}
            >
              <i className="fa fa-clock-o fa-lg mr-3" />
              Histórico
            </Button>
          )}
          <HistoryModal
            {...{
              historyModalVisible,
              setHistoryModalVisible,
              history,
              loading,
            }}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

HistoryModalConfig.propTypes = {
  buttonClassName: PropTypes.string,
  entityId: PropTypes.string,
  hideModal: PropTypes.bool,
  history: PropTypes.array,
  historyModalVisible: PropTypes.bool,
  setHistory: PropTypes.func,
  setHistoryModalVisible: PropTypes.func,
  showLabel: PropTypes.bool,
  api: PropTypes.any,
}
