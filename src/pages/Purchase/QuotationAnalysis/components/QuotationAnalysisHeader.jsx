import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Dropdown, Menu } from 'antd'
import React from 'react'
import { useQuotationAnalysisContext } from '../context/QuotationAnalysisContext'

export default function QuotationAnalysisHeader() {
  const {
    dropdownVisible,
    setDropdownVisible,
    searchOptions,
    setTags,
    tags,
    startSearch,
  } = useQuotationAnalysisContext()

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
