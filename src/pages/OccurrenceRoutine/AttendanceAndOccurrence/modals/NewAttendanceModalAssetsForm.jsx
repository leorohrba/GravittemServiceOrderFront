/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Button, Badge, Row, Col } from 'antd'
import NewSimpleSearch from '@components/NewSimpleSearch'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
  handleAuthError,
  setParamValues,
  showApiMessages,
} from '@utils'
import { apiAttendance } from '@services/api'

const params = {
  id: [],
  nomeCliente: [],
  descricaoProduto: [],
  numeroSerie: [],
  ativo: [],
  dataCompraInicial: null,
  dataCompraFinal: null,
}

const searchOptions = [
  {
    value: 'descricaoProduto',
    label: 'Ativo',
    type: 'search',
    placeholder: 'Informe a descrição do ativo',
  },
  {
    value: 'nomeCliente',
    label: 'Cliente',
    type: 'search',
    placeholder: 'Informe o nome do cliente',
  },
  {
    value: 'numeroSerie',
    label: 'Número de série',
    type: 'search',
    placeholder: 'Informe o número da série',
  },
  {
    value: 'ativo',
    label: 'Status',
    placeholder: 'Selecione o status',
    type: 'select',
    options: [
      {
        label: 'Ativo',
        value: true,
        render: <Badge style={{ color: 'green' }} color="green" text="Ativo" />,
      },
      {
        label: 'Inativo',
        value: false,
        render: <Badge style={{ color: 'red' }} color="red" text="Inativo" />,
      },
    ],
  },
]

export default function NewAttendanceModalAssetsForm({
  canBeUpdated,
  newAsset,
  setData,
  keyTable, 
  setKeyTable,
  setLoading,
  selectedAssets,
  form,  
}) {

  const [tags, setTags] = useState([])

  function clearParams() {
    params.id = []
    params.nomeCliente = []
    params.descricaoProduto = []
    params.dataCompraInicial = null
    params.dataCompraFinal = null
    params.numeroSerie = []
    params.ativo = []
  }

  function startSearch() {
    clearParams()
    setParamValues(params, searchOptions, tags)
    getData()
  }

  async function getData() {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtivo`,
        data: params,
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {

        const assetsSource = data.ativo.map((record, index) => ({
          idAtivo: record.id,
          idCliente: record.idCliente,
          nomeCliente: record.nomeCliente,
          descricaoProduto: record.descricaoProduto,
          numeroSerie: record.numeroSerie,
        }))
        setData(assetsSource)
        
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  async function getRequesterAssets(requesterId) {
    setLoading(true)
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaAtivo`,
        data: {
          idCliente: [requesterId],
          ativo: [true],
        },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk) {
        const assetsSource = data.ativo.map((record, index) => ({
          idAtivo: record.id,
          idCliente: record.idCliente,
          nomeCliente: record.nomeCliente,
          descricaoProduto: record.descricaoProduto,
          numeroSerie: record.numeroSerie,
          selecionado: !!selectedAssets.find(x => x.idAtivo === record.id),
        }))
        assetsSource.sort((a,b) =>  b.selecionado -  a.selecionado)
        setData(assetsSource)
        setKeyTable(keyTable + 1)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  const handleShowSelectedAssets = () => {
    setData(selectedAssets)
    setKeyTable(keyTable + 1)
  }
  
  return (
  <div>
    <Row type="flex" className="mb-2" gutter={12}>
      <Col>
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          selectOptionsWidth={155}
          searchBoxWidth={280}
          startSearch={startSearch}
          labelButton="Pesquisar"
          screenName="ativos_atendimentos_1"
        />
      </Col>
      {canBeUpdated && form.getFieldValue('requesterId') && (
        <Col>
          <Button type="primary" onClick={() => newAsset()}>
            <i className="mr-2 fa fa-plus" />
            Novo ativo
          </Button>  
        </Col>
      )}
    </Row>
    <Row className="mb-2" type="flex" gutter={12} align="middle">
      <Col>
        <h3 
          className={selectedAssets.length === 0 ? "" : "cursor-pointer primary-color"}
          onClick={() => selectedAssets.length > 0 && handleShowSelectedAssets()}
        >
          {selectedAssets.length === 0 ?
             'Nenhum ativo selecionado' :
             selectedAssets.length === 1 ?
             '1 ativo selecionado' :
             `${selectedAssets.length} ativos selecionados`
          }
        </h3>
      </Col> 
      {form.getFieldValue('requesterId') && (
        <Col className="ml-auto">
          <h3 
            className="cursor-pointer primary-color"
            onClick={() => getRequesterAssets(form.getFieldValue('requesterId'))}
          >
            Mostrar ativos do cliente
          </h3>
        </Col>        
      )}
    </Row>
  </div>  
  )
}

NewAttendanceModalAssetsForm.propTypes = {
  canBeUpdated: PropTypes.bool,
  newAsset: PropTypes.func,
  setData: PropTypes.func,
  keyTable: PropTypes.number, 
  setKeyTable: PropTypes.func,
  setLoading: PropTypes.func,
  selectedAssets: PropTypes.array,
  form: PropTypes.any,  
}
