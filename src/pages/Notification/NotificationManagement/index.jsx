/**
 * breadcrumb: Gestão de notificação
 */
import React from 'react'
import NotificationManagementHeader from './components/NotificationManagementHeader'
import NotificationManagementList from './components/NotificationManagementList'
import { NotificationManagementDataProvider } from './context/NotificationManagementData'
import LinkDocumentsModal from './modals/LinkDocumentsModal'
import NewNotificationModal from './modals/NewNotificationModal'

export default function NotificationManagement() {
  return (
    <div className="container">
      <NotificationManagementDataProvider>
        <NewNotificationModal />
        <LinkDocumentsModal />
        <NotificationManagementHeader />
        <NotificationManagementList />
      </NotificationManagementDataProvider>
    </div>
  )
}
