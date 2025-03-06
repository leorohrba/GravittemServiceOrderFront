/* eslint-disable react-hooks/exhaustive-deps  */
import { apiRegion } from '@services/api'
import { handleAuthError, setParamValues, showApiMessages } from '@utils'
import { Spin, Badge } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PersonReportHeader from './PersonReportHeader'
import PersonReportTable from './PersonReportTable'

const params = {}

const initialOptions = [
    {
      value: 'colaboradorNome',
      label: 'Responsável',
      type: 'search',
      placeholder: 'Nome do responsável',
    },
    {
      value: 'regiaoNome',
      label: 'Região',
      type: 'search',
      placeholder: 'Nome da região',
    },
    {
      value: 'regiaoStatus',
      label: 'Status',
      type: 'select',
      placeholder: 'Status da região',
      options: [
        { label: 'Ativo', 
          value: 1, 
          render: <Badge style={{ color: 'green' }} color="green" text="Ativo" />  
        },
        { label: 'Inativo', 
          value: 2, 
          render: <Badge style={{ color: 'red' }} color="red" text="Inativo" />  
        },
      ],
    },
    {
      value: 'tipoVinculo',
      label: 'Tipo de vínculo',
      placeholder: 'Tipo de vínculo',
      type: 'select',
      options: [{ value: 1, label: 'Única' } , { value: 2, label: 'Por dia de semana' } ],
    },
    {
      value: 'diaSemana',
      label: 'Dia da semana',
      placeholder: 'Dia da semana',
      type: 'select',
      options: [
         { value: 2, label: 'Segunda-feira' }, 
         { value: 3, label: 'Terça-feira' }, 
         { value: 4, label: 'Quarta-feira' }, 
         { value: 5, label: 'Quinta-feira' }, 
         { value: 6, label: 'Sexta-feira' }, 
         { value: 7, label: 'Sábado' }, 
         { value: 1, label: 'Domingo' }, 
      ],
    },
    {
      value: 'municipio',
      label: 'Município',
      type: 'search',
      placeholder: 'Nome do município',
    },
    {
      value: 'estadoSigla',
      label: 'Estado',
      placeholder: 'Selecione o estado',
      type: 'select',
      options: [],
    },
    {
      value: 'rua',
      label: 'Rua',
      type: 'search',
      placeholder: 'Nome da rua',
    },
    {
      value: 'bairro',
      label: 'Bairro',
      type: 'search',
      placeholder: 'Bairro vinculado a região',
    },
    {
      value: 'cep',
      label: 'Cep',
      type: 'search',
      placeholder: 'Informe o cep',
    },
    {
      value: 'delimitadoPor',
      label: 'Região delimitada por',
      placeholder: 'Tipo de delimitação',
      type: 'select',
      options: [{ value: 2, label: 'CEP' } , { value: 3, label: 'Bairro/município' }, { value: 1, label: 'Sem delimitação' } ],
    },
  ]
  
export default function PersonReport({
  userPermissions
}) {
  
  const [searchOptions, setSearchOptions] = useState(initialOptions)
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])
  
  useEffect(() => {
    clearParams()
    getStates()
    getData()
  },[])
  
  useEffect(() => {
    const source = [
      {
        columns: [
          'Região',
          'Responsável',
          'Dia da semana',
          'Status',
        ],
        data: [],
      },
    ]

    data.map(d =>
      source[0].data.push([
        d.regiaoNome,
        d.colaboradorNome,
        d.diaSemanaDescricao,
        d.regiaoStatusDescricao,
      ]),
    )

    setDataExport(source)
  }, [data])
  

  function clearParams() {
    params.colaboradorNome = []
    params.regiaoNome = []
    params.tipoVinculo = []
    params.municipio = []
    params.bairro = []
    params.cep = []
    params.estadoSigla = []
    params.rua = []
    params.delimitadoPor = []
    params.diaSemana = []
    params.regiaoStatus = []
  }

  async function getStates() {
    try {
      const response = await apiRegion({
        method: 'GET',
        url: `/api/Estado`,
        params: { paisId: 1 },
      })
      const { data } = response
      if (data.isOk) {
        const states = data.estado.map(d => ({ label: d.nome, value: d.sigla }))
        const index = searchOptions.findIndex(x => x.value === 'estadoSigla')
        if (index > -1) {
          searchOptions[index].options = states
          setSearchOptions([...searchOptions])
        }

      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  async function getData() {
    setLoading(true)
    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/PessoaRegiao/Select`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        setData(data.relatorioPessoaRegiao)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function startSearch() {
    clearParams()
    setParamValues(params, searchOptions, tags)
    getData()
  }

  return (
  <div className="container">  
    <Spin size="large" spinning={loading}>

      <PersonReportHeader
        startSearch={startSearch}
        tags={tags}
        setTags={setTags}
        searchOptions={searchOptions}
        dataExport={dataExport}
        userPermissions={userPermissions}
      />

      <PersonReportTable
        data={data}
      />

    </Spin>
  </div>  
  )
}

PersonReport.propTypes = {
  userPermissions: PropTypes.array,
}


