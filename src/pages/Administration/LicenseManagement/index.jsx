/**
 * breadcrumb: Gestão de licenças
 */
import LicenseManagementHeader from './components/LicenseManagementHeader'
import LicenseManagementTable from './components/LicenseManagementTable'
import { LicenseManagementProvider } from './context/LicenseManagementContext'
import JustifyModal from './modals/JustifyModal'

export default function LicenseManagement() {
  return (
    <div className="container">
      <LicenseManagementProvider>
        <JustifyModal />
        <LicenseManagementHeader />
        <LicenseManagementTable />
      </LicenseManagementProvider>
    </div>
  )
}
