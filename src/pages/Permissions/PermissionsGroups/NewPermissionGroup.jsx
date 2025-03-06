/**
 * breadcrumb: Novo grupos de permissões
 */
import { Form } from '@ant-design/compatible'
import Breadcrumb from '@components/Breadcrumb'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import NewPermissionGroupForm from './components/NewPermissionGroupForm'
import NewPermissionGroupHeader from './components/NewPermissionGroupHeader'

function NewPermissionGroup({ form }) {
  const id =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('id')
      : null
  const [activedKeys, setActivedKeys] = useState([])
  const [checkedValues, setCheckedValues] = useState([])

  const permissions = [
    {
      collapse: 'Cadastro',
      conteudo: [
        {
          permission: 'Cadastro de cor',
          key: 1,
          children: [
            { key: 1, description: 'Salvar(Incluir, Importar, Alterar)' },
            { key: 2, description: 'Excluir' },
            { key: 3, description: 'Extrair(Imprimir, Exportar, Enviar)' },
          ],
        },
        {
          permission: 'Cadastro de prioridade',
          key: 2,
          children: [
            { key: 4, description: 'Salvar(Incluir, Importar, Alterar)' },
            { key: 5, description: 'Excluir' },
            { key: 6, description: 'Extrair(Imprimir, Exportar, Enviar)' },
          ],
        },
        {
          permission: 'Cadastro de defeitos',
          key: 3,
          children: [
            { key: 7, description: 'Salvar(Incluir, Importar, Alterar)' },
            { key: 8, description: 'Excluir' },
            { key: 9, description: 'Extrair(Imprimir, Exportar, Enviar)' },
          ],
        },
        {
          permission: 'Cadastro de ocorrências',
          key: 4,
          children: [
            { key: 10, description: 'Salvar(Incluir, Importar, Alterar)' },
            { key: 11, description: 'Excluir' },
            { key: 12, description: 'Extrair(Imprimir, Exportar, Enviar)' },
          ],
        },
      ],
    },
    {
      collapse: 'Finanças',
      conteudo: [
        {
          permission: 'Orçamento',
          key: 5,
          children: [
            { key: 13, description: 'Consultar' },
            { key: 14, description: 'Salvar' },
            { key: 15, description: 'Excluir' },
            { key: 16, description: 'Extrair' },
            { key: 17, description: 'Aprovar/Reprovar' },
          ],
        },
      ],
    },
    {
      collapse: 'Serviços',
      conteudo: [
        {
          permission: 'Ordem de serviço',
          key: 6,
          children: [
            { key: 18, description: 'Consultar' },
            { key: 19, description: 'Salvar' },
            { key: 20, description: 'Excluir' },
            { key: 21, description: 'Extrair' },
            { key: 22, description: 'Cancelar' },
            { key: 23, description: 'Agendar' },
            { key: 24, description: 'Orçar serviços' },
          ],
        },
      ],
    },
  ]

  const [editData, setEditData] = useState()
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
  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    setEditData(data.find(d => d.id == id))
  }, [data, id])
  const users = [
    { username: 'joao.carlos', nome: 'João Carlos' },
    { username: 'maria.silva', nome: 'Maria da Silva' },
    { username: 'cristina.pereira', nome: 'Cristina Pereira' },
    { username: 'bruno.souza', nome: 'Beuno Souza' },
    { username: 'hamilton.fagundes', nome: 'Hamilton Fagundes' },
  ]
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
  return (
    <div className="container">
      <Breadcrumb />
      <NewPermissionGroupHeader
        {...{
          searchOptions,
          setTags,
          tags,
          startSearch,
        }}
      />
      <NewPermissionGroupForm
        {...{
          users,
          permissions,
          data,
          setData,
          form,
          activedKeys,
          setActivedKeys,
          checkedValues,
          setCheckedValues,
          editData,
        }}
      />
    </div>
  )
}
NewPermissionGroup.propTypes = { form: PropTypes.any }

const WrappedNewPermissionGroup = Form.create()(NewPermissionGroup)

export default WrappedNewPermissionGroup
