/**
 * breadcrumb: Grupos de permissões
 */
import React, { useState } from 'react'
import PermissionsGroupsHeader from './components/PermissionsGroupsHeader'
import PermissionsGroupsTable from './components/PermissionsGroupsTable'
import Breadcrumb from '@components/Breadcrumb'

function PermissionsGroups() {
  const searchOptions = [
    {
      value: 'descricao',
      label: 'Descrição',
      type: 'search',
    },
    { value: 'codigo', label: 'Código', type: 'search' },
    { value: 'tipo', label: 'Tipo', type: 'search' },
  ]
  const [tags, setTags] = useState([])
  function startSearch() {}

  const [data, setData] = useState([
    {
      id: 1,
      grupoPermissao: 'Atendimento',
      empresa: 'Softin Sistemas',
      status: 'Ativo',
      usuarios: [true, false, false, true, false],
      permissoes: {
        permissoesGerais: [1, 3],
        permissoes: [1, 3],
      },
    },
    {
      id: 2,
      grupoPermissao: 'Faturamento',
      empresa: 'Softin Sistemas',
      status: 'Inativo',
      usuarios: [],
      permissoes: {
        permissoesGerais: [],
        permissoes: [],
      },
    },
    {
      id: 3,
      grupoPermissao: 'Estoquista',
      empresa: 'Softin Sistemas',
      status: 'Ativo',
      usuarios: [],
      permissoes: {
        permissoesGerais: [],
        permissoes: [],
      },
    },
    {
      id: 4,
      grupoPermissao: 'Comprador',
      empresa: 'Softin Sistemas',
      status: 'Inativo',
      usuarios: [true, false, false, true, false],
      permissoes: {
        permissoesGerais: [0, 2, 4],
        permissoes: [0, 3],
      },
    },
    {
      id: 5,
      grupoPermissao: 'Auxiliar de estoque',
      empresa: 'Softin Sistemas',
      status: 'Ativo',
      usuarios: [],
      permissoes: {
        permissoesGerais: [],
        permissoes: [],
      },
    },
  ])
  return (
    <div className="container">
      <Breadcrumb />
      <PermissionsGroupsHeader
        {...{
          data,
          setData,
          searchOptions,
          setTags,
          tags,
          startSearch,
        }}
      />
      <PermissionsGroupsTable
        {...{
          data,
          setData,
        }}
      />
    </div>
  )
}
export default PermissionsGroups
