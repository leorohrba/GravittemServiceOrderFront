/**
 * breadcrumb: Grupos de empresas
 */
import React, { useState } from 'react'
import Breadcrumb from '@components/Breadcrumb'
import PermissionsCompaniesGroupsHeader from './components/PermissionsCompaniesGroupsHeader'
import PermissionsCompaniesGroupsTable from './components/PermissionsCompaniesGroupsTable'

function PermissionsCompaniesGroups() {
  const supports = [
    { id: 1, nome: 'S. CORP' },
    { id: 2, nome: 'S. EPP' },
    { id: 3, nome: 'Implementação' },
  ]
  const companies = [
    { id: 1, nome: 'Atendente Portaria' },
    { id: 2, nome: 'LabServ' },
    { id: 3, nome: 'Manchester' },
    { id: 4, nome: 'Papiro' },
    { id: 5, nome: 'Rachadel' },
  ]

  const [
    newCompaniesGroupModalVisible,
    setNewCompaniesGroupModalVisible,
  ] = useState()
  const [editData, setEditData] = useState()
  const [data, setData] = useState([
    {
      id: 1,
      grupo: 'Clientes EPP',
      status: 'Ativo',
      suportes: [2, 3],
      empresas: [5, 3],
    },
    {
      id: 2,
      grupo: 'Clientes Corp',
      status: 'Ativo',
      suportes: [3],
      empresas: [2, 4],
    },
    {
      id: 3,
      grupo: 'Clientes desligados',
      status: 'Ativo',
      suportes: [1, 2],
      empresas: [2, 5],
    },
  ])
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
  return (
    <div className="container">
      <Breadcrumb />
      <PermissionsCompaniesGroupsHeader
        {...{
          searchOptions,
          setTags,
          tags,
          startSearch,
          data,
          setData,
          newCompaniesGroupModalVisible,
          setNewCompaniesGroupModalVisible,
          companies,
          editData,
          supports,
          setEditData,
        }}
      />
      <PermissionsCompaniesGroupsTable
        {...{
          data,
          setData,
          editData,
          setEditData,
          newCompaniesGroupModalVisible,
          setNewCompaniesGroupModalVisible,
          supports,
          companies,
        }}
      />
    </div>
  )
}
export default PermissionsCompaniesGroups
