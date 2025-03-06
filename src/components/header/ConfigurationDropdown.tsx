import useConfigurationModal from '@models/useConfigurationModal'
import { Button, Dropdown, Menu } from 'antd'
import React from 'react'

function ConfigurationDropdown() {
  const { setVisibleConfigurationModal } = useConfigurationModal()

  const configurationMenu = (
    <Menu>
      <Menu.Item key={1} onClick={() => setVisibleConfigurationModal(true)}>
        Configurações
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown className="ml-1" overlay={configurationMenu}>
      <Button className="iconButton ml-2">
        <i className="fa fa-ellipsis-v" aria-hidden="true" />
      </Button>
    </Dropdown>
  )
}

export default ConfigurationDropdown
