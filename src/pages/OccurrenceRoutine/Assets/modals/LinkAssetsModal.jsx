import { Button, Modal, Row, Tabs } from 'antd'
import React, { useState } from 'react'
import LinkAssetsModalLinked from './LinkAssetsModalLinked'
import LinkAssetsModalSearch from './LinkAssetsModalSearch'

const { TabPane } = Tabs

function LinkAssetsModal() {
  const [data, setData] = useState([
    {
      key: 1,
      product: 'Sensor temperatura',
      serialNumber: 'A4321',
      status: 'Ativo',
    },
  ])

  return (
    <Modal
      title="Vincular ativos"
      visible={false}
      width="60%"
      bodyStyle={{ paddingTop: 0 }}
      footer={
        <Row type="flex">
          <Button style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            Salvar
          </Button>
          <Button type="secondary">Cancelar</Button>
        </Row>
      }
    >
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Vinculados" key="1">
          <LinkAssetsModalLinked data={data} setData={setData} />
        </TabPane>
        <TabPane tab="Pesquisar" key="2">
          <LinkAssetsModalSearch data={data} setData={setData} />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default LinkAssetsModal
