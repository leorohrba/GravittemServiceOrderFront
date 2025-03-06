import React, { Fragment } from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { hasPermission } from '@utils'
import useUserPermissions from '@models/useUserPermissions'

function ExportDropdown(props) {
  const { data, exportExcel, exportPDF } = props

  const { userPermissions } = useUserPermissions()

  const permissionToExport = hasPermission(userPermissions, 'ExportarParaExcel')

  const exportMenu = () => (
    <Menu>
      <Menu.Item key={1} onClick={() => exportExcel()}>
        Excel
      </Menu.Item>
      <Menu.Item key={2} onClick={() => exportPDF()}>
        PDF
      </Menu.Item>
    </Menu>
  )

  return (
    <Fragment>
      {permissionToExport && (
        <Dropdown overlay={exportMenu} disabled={data?.length === 0}>
          <Button disabled={!data}>
            <i className="antd-dropdown fa fa-download fa-lg mr-3" /> Exportar
          </Button>
        </Dropdown>
      )}
    </Fragment>
  )
}

export default ExportDropdown
