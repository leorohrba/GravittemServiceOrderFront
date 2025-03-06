import { Button, Modal, Row, Tabs } from 'antd'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import PersonReport from './components/PersonReport'

const { TabPane } = Tabs
  
export default function RegionReportModal({
  visible,
  setVisible,
  userPermissions,
}) {
  
  const [activeTabKey, setActiveTabKey] = useState('1')

  return (
  <React.Fragment>  
    <Modal
      visible={visible}
      title="Relatórios"
      onCancel={() => setVisible(false)}
      centered
      width="80%"
      footer={
        <Row type="flex">
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => setVisible(false)}
          >
            Fechar
          </Button>
        </Row>
      }
    >
      {visible ? (
        <Tabs 
          type="card"
          activeKey={activeTabKey}
          onChange={activeKey => setActiveTabKey(activeKey)}
        >
          <TabPane
            tab="Responsável"
            key="1"
          >
            <PersonReport
              userPermissions={userPermissions}
            />  
          </TabPane>
        </Tabs>
      ) : ( <div style={{ minHeight: '1000px' }} />)}
    </Modal>
  </React.Fragment>  
  )
}

RegionReportModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  userPermissions: PropTypes.array,
}


