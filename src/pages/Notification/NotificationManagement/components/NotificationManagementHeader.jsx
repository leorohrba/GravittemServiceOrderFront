import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Select } from 'antd'
import React from 'react'
import { useNotificationManagementDataContext } from '../context/NotificationManagementData'

const { Option } = Select

export default function NotificationManagementHeader() {
  const {
    tags,
    setTags,
    searchOptions,
    startSearch,
    setNewNotificationModal,
    selectedViewType,
    setSelectedViewType,
  } = useNotificationManagementDataContext()

  return (
    <div>
      <div className="flex justify-end">
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          startSearch={startSearch}
        />
      </div>
      <div className="flex justify-between mt-8">
        <Button type="primary" onClick={() => setNewNotificationModal(true)}>
          Nova notificação
        </Button>
        <Select
          defaultValue={selectedViewType}
          onChange={e => setSelectedViewType(e)}
          style={{ width: '130px' }}
        >
          <Option value="sent">Enviadas</Option>
          <Option value="received">Recebidas</Option>
        </Select>
      </div>
    </div>
  )
}
