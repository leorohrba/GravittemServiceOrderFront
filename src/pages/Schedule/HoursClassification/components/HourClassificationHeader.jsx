import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Dropdown, Menu } from 'antd'
import React from 'react'
import { useHourClassificationContext } from '../context/HourClassificationContext'
import AddHourClassificationModal from '../modals/AddHourClassificationModal'
import { hasPermission, confirmDelete } from '@utils'

export default function HourClassificationHeader() {
  const {
    selectedRows,
    dropdownVisible,
    setDropdownVisible,
    searchOptions,
    setTags,
    tags,
    userPermissions,
    startSearch,
    setVisibleHourClassificationModal,
    setEditData,
    deleteRecords,
  } = useHourClassificationContext()

  const handleAdd = () => {
    setEditData(null)
    setVisibleHourClassificationModal(true)
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
        />
      </div>
      <AddHourClassificationModal />
      <div className="flex justify-between my-5">
        {selectedRows.length > 0 && hasPermission(userPermissions, 'Exclude') && (
		  <Button onClick={() => handleDelete()} style={{ color: 'red', borderColor: 'red' }}>
			<i className="fa fa-trash fa-lg mr-3" />
			Excluir ({selectedRows.length})
		  </Button>
        )}
        {selectedRows.length === 0 && hasPermission(userPermissions, 'Include') && (
          <Button
            type="primary"
            onClick={() => handleAdd()}
          >
            <i className="fa fa-plus fa-lg mr-3" />
            Nova classificação
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
