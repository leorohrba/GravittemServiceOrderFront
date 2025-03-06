import React from 'react'
import { Form, Tabs } from 'antd'
import { hasPermission, NoVisualize } from '@utils'
import GeneralTab from '../Tabs/GeneralTab'
import SchedulingTab from '../Tabs/SchedulingTab'
import { useNewServiceContext } from '../context/newServiceContext'
import Header from './Header'
import NewServiceButton from './NewServiceButton'
import AttachmentsModalConfig from '@components/modals/AttachmentsModal'
import { convertServiceOrderId } from '../../../../pages/ServiceOrder/services/ServiceOrder'

const { TabPane } = Tabs

export default function NewService() {
  const {
    form,
    userPermissions,
    setIsSchedule,
    isSchedule,
    isSaved,
    activeKey,
    setActiveKey,
    generatedOS,
  } = useNewServiceContext()

  const hasAllowInsertAttachmentPermission = hasPermission(
    userPermissions,
    'PermitirIncluirAnexo',
  )
  const [serviceOrderGuid, setServiceOrderGuid] = useState(null)

  useEffect(() => {
    convertServiceOrderId(generatedOS?.serviceOrderId, setServiceOrderGuid)
  }, [isSaved])

  return hasPermission(userPermissions, 'Visualize') ? (
    <div className="px-6">
      <Form layout="vertical" form={form}>
        <div className="flex justify-between w-full">
          <NewServiceButton />
          {isSaved && hasAllowInsertAttachmentPermission && (
            <AttachmentsModalConfig
              entityId={serviceOrderGuid}
              hideModal={false}
              isTable={false}
              offline={true}
              createWithId={{
                condition: true,
                entityId: generatedOS?.serviceOrderId,
              }}
            />
          )}
        </div>
        <br />
        <Tabs
          type="card"
          defaultActiveKey={1}
          onChange={() => setIsSchedule(!isSchedule)}
          activeKey={activeKey}
          onTabClick={key => setActiveKey(key)}
        >
          <TabPane tab="Geral" key={1}>
            <GeneralTab />
          </TabPane>
          <TabPane tab="Agendamento" key={2} forceRender disabled={!isSaved}>
            <SchedulingTab />
          </TabPane>
        </Tabs>
      </Form>
      <Header />
    </div>
  ) : (
    <NoVisualize userPermissions={userPermissions} />
  )
}
