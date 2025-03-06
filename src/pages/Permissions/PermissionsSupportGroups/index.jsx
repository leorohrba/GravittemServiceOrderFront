/**
 * breadcrumb: Grupos de Suportes
 */
import React, { useState } from 'react'
import PermissionsSupportGroupsHeader from './components/PermissionsSupportGroupsHeader'
import PermissionsSupportGroupsTable from './components/PermissionsSupportGroupsTable'
import Breadcrumb from '@components/Breadcrumb'

function PermissionsSupportGroups() {
  const [editData, setEditData] = useState()
  const [tags, setTags] = useState([])

  const users = [
    { id: 1, nome: 'rodrigo.bertero' },
    { id: 2, nome: 'moacir.kuhn' },
  ]

  const [
    newSupportGroupModalVisible,
    setNewSupportGroupModalVisible,
  ] = useState(false)

  const searchOptions = [
    {
      value: 'descricao',
      label: 'Descrição',
      type: 'search',
    },
    { value: 'codigo', label: 'Código', type: 'search' },
    { value: 'tipo', label: 'Tipo', type: 'search' },
  ]

  const [data, setData] = useState([
    {
      id: 1,
      grupo: 'S. EPP',
      status: 'Ativo',
      grupoEmpresas: 'Corp',
      usuarios: [1, 2],
    },
    {
      id: 2,
      grupo: 'S. Corp',
      status: 'Ativo',
      grupoEmpresas: 'EPP',
      usuarios: [2],
    },
    {
      id: 3,
      grupo: 'Implantação',
      status: 'Ativo',
      grupoEmpresa: 'Corp',
      usuarios: [1],
    },
  ])
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

  return (
    <div className="container">
      <Breadcrumb />
      <PermissionsSupportGroupsHeader
        {...{
          searchOptions,
          setTags,
          tags,
          startSearch,
          data,
          setData,
          newSupportGroupModalVisible,
          setNewSupportGroupModalVisible,
          users,
        }}
      />
      <PermissionsSupportGroupsTable
        {...{
          data,
          setData,
          editData,
          setEditData,
          newSupportGroupModalVisible,
          setNewSupportGroupModalVisible,
          users,
        }}
      />
    </div>
  )
}

export default PermissionsSupportGroups
