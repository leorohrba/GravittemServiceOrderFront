/**
 * breadcrumb: Usuarios
 */
import React, { useState } from 'react'
import Breadcrumb from '@components/Breadcrumb'
import UsersListTable from './components/UsersListTable'
import UsersListHeader from './components/UsersListHeader'

function UsersList() {
  const [editData, setEditData] = useState()
  const [newUserModalVisible, setNewUserModalVisible] = useState()
  const [tags, setTags] = useState([])
  const searchOptions = [
    {
      value: 'descricao',
      label: 'Descrição',
      type: 'search',
    },
    { value: 'codigo', label: 'Código', type: 'search' },
    { value: 'tipo', label: 'Tipo', type: 'search' },
  ]
  function startSearch(fieldName, searchFieldValue) {
    // setData([
    //   {
    //     codigo: '002',
    //     descricao: 'nanana',
    //     tipo: 'Standard',
    //     valorUnitario: 200.0,
    //   },
    // ])
  }
  const [data, setData] = useState([
    {
      id: 1,
      email: 'flavio@softin.com.br',
      nome: 'flavio.bertolossi',
      status: 'Ativo',
    },
    {
      id: 2,
      email: 'maria@gmail.com',
      nome: 'maria.kuhn',
      status: 'Bloqueado',
    },
    {
      id: 3,
      email: 'maria@outlook.com',
      nome: 'maria.ribeiro',
      status: 'Inativo',
    },
  ])

  return (
    <div className="container">
      <Breadcrumb />
      <UsersListHeader
        {...{
          searchOptions,
          editData,
          setEditData,
          data,
          setData,
          setTags,
          tags,
          startSearch,
          newUserModalVisible,
          setNewUserModalVisible,
        }}
      />
      <UsersListTable
        {...{
          data,
          setData,
          newUserModalVisible,
          setNewUserModalVisible,
          setEditData,
        }}
      />
    </div>
  )
}

export default UsersList
