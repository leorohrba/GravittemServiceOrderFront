import { Button, message, Modal, Row, Tabs } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'
import LinkAssetsModalLinked from './LinkAssetsModalLinked'
import LinkAssetsModalSearch from './LinkAssetsModalSearch'

const { TabPane } = Tabs

export default function LinkAssetsModal() {
  const {
    visibleLinkAssetModal,
    setVisibleLinkAssetModal,
  } = useNewAssetContext()

  const [data, setData] = useState([
    {
      key: 1,
      product: 'Sensor temperatura',
      serialNumber: 'A4321',
      status: 'Ativo',
    },
  ])

  function handleSave() {
    message.success(
      formatMessage({
        id: 'successSave',
      }),
    )
    setVisibleLinkAssetModal(false)
  }

  return (
    <Modal
      title="Vincular ativos"
      visible={visibleLinkAssetModal}
      width="60%"
      bodyStyle={{ paddingTop: 0 }}
      onCancel={() => setVisibleLinkAssetModal(false)}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button onClick={() => setVisibleLinkAssetModal(false)}>
            Cancelar
          </Button>
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
