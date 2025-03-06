import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Dropdown, Menu } from 'antd'
import React from 'react'
import { useCalendarContext } from '../context/CalendarContext'
import { hasPermission, confirmDelete } from '@utils'

function CalendarHeader() {
  const {
    dropdownVisible,
    setDropdownVisible,
    searchOptions,
    setTags,
    tags,
    startSearch,
    setCalendarId,
    setScreen,
    selectedRows,
    deleteRecords,
    userPermissions,
  } = useCalendarContext()

  const handleClick = () => {
    setCalendarId(null)
    setScreen('Edit')
  }

  const handleDelete = () => {
    confirmDelete(selectedRows.length, 
      deleteRecords,
      ['Excluir registro?','Excluir registros?'],
      ['O registro selecionado será excluido. Deseja continuar?','Os registros selecionados serão excluidos. Deseja continuar?'],
      'Excluir','Cancelar'
     )
  }

  return (
    <div>
      <div className="flex justify-end">
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          startSearch={startSearch}
          selectOptionsWidth={220}
          getSelectLabel
        />
      </div>
      <div className="flex justify-between my-5">
        {selectedRows.length === 0 && hasPermission(userPermissions, 'Include') && (
          <Button onClick={() => handleClick()} type="primary">
            <i className="fa fa-plus fa-lg mr-3" />
            Novo calendário
          </Button>
        )}
        {selectedRows.length > 0 && hasPermission(userPermissions, 'Exclude') && (
          <Button onClick={() => handleDelete()} style={{ color: 'red', borderColor: 'red' }}>
            <i className="fa fa-trash fa-lg mr-3" />
            Excluir ({selectedRows.length})
          </Button>
        )}
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">Configurações</Menu.Item>
            </Menu>
          }
          visible={dropdownVisible}
          trigger={['click']}
          onVisibleChange={visible => setDropdownVisible(visible)}
          className="ml-auto"
        >
          <Button>
            <i className="fa fa-ellipsis-v fa-lg" aria-hidden="true" />
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default CalendarHeader
