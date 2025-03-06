import { Button, Form, message, Modal, Row, Tabs } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'
import ComplementaryDataModalComposition from './ComplementaryDataModalComposition'
import ComplementaryDataModalData from './ComplementaryDataModalData'

const { TabPane } = Tabs

export default function ComplementaryDataModal() {
  const {
    visibleComplementaryDataModal,
    setVisibleComplementaryDataModal,
  } = useNewAssetContext()

  const [form] = Form.useForm()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
      setVisibleComplementaryDataModal(false)
    })
  }
  return (
    <Modal
      title="Dados complementares"
      bodyStyle={{ paddingTop: 0 }}
      visible={visibleComplementaryDataModal}
      destroyOnClose
      onCancel={() => setVisibleComplementaryDataModal(false)}
      width="60%"
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSave}
          >
            Salvar
          </Button>
          <Button onClick={() => setVisibleComplementaryDataModal(false)}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <Tabs type="card">
        <TabPane key={1} tab="Dados">
          <ComplementaryDataModalData />
        </TabPane>
        <TabPane key={2} tab="Composição">
          <ComplementaryDataModalComposition />
        </TabPane>
      </Tabs>
    </Modal>
  )
}
