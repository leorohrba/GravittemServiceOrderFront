import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Dropdown, Menu } from 'antd'
import React from 'react'
import { usePurchaseOrderContext } from '../context/PurchaseOrderContext'

export default function PurchaseOrderHeader() {
  const {
    dropdownVisible,
    setDropdownVisible,
    searchOptions,
    setTags,
    tags,
    startSearch,
  } = usePurchaseOrderContext()

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
      <div className="flex my-5">
        <Button type="primary">Novo pedido de compra</Button>
        <Dropdown
          className="ml-auto"
          overlay={
            <Menu>
              <Menu.Item key="1">Configurações</Menu.Item>
            </Menu>
          }
          visible={dropdownVisible}
          trigger={['click']}
          onVisibleChange={visible => setDropdownVisible(visible)}
        >
          <Button>
            <i className="fa fa-ellipsis-v fa-lg" aria-hidden="true" />
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}
