/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { message, Spin } from 'antd'
import NewAttendanceModalAssetsForm from './NewAttendanceModalAssetsForm'
import NewAttendanceModalAssetsTable from './NewAttendanceModalAssetsTable'
import NewAssetModal from '../../Assets/modals/NewAssetModal'
import {
  handleAuthError,
  showApiMessages,
} from '@utils'
import { apiAttendance } from '@services/api'

export default function NewAttendanceModalAssets(props) {
  
  const { form, 
          assets, 
          selectedAssets, 
          setSelectedAssets,
          canBeUpdated,
          requesterSource,
          setRequesterSource,          
          userPermissions,
          handleChangeRequesterFromAssets,
          onChange,
        } = props 
        
  const [newAssetModal, setNewAssetModal] = useState(false)
  const [keyAssetModal, setKeyAssetModal] = useState(0)
  const [assetId, setAssetId] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [data, setData] = useState([])
  const [keyTable, setKeyTable] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  
  useEffect(() => {
    setData(assets)
    setKeyTable(keyTable + 1)
  },[assets])
  
  useEffect(() => {
    const source = []
    selectedAssets.map((d) => {
      if (data.find(x => x.idAtivo === d.idAtivo)) {
       source.push(d)
      }
      return true
    })
    setSelectedRows(source)
  },[data, selectedAssets])
  
  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      handleSelectAssets(selectedRow)
    },
    selectedRowKeys: selectedRows.map(record => record.idAtivo),
    getCheckboxProps: record => ({
      disabled: !canBeUpdated,
    }),
  }
  
  const handleSelectAssets = (rows) => {
    let requesterId = null
    
    if (rows?.length > 0) {
      requesterId = rows[0].idCliente
      if (selectedAssets.find(x => x.idCliente !== requesterId) || rows.find(x => x.idCliente !== requesterId)) {
        message.error('Não é possível selecionar ativos de diferentes clientes!')
        return
      }
    }      

    rows.map((d) => {
      if (!selectedAssets.find(x => x.idAtivo === d.idAtivo)) {
        selectedAssets.push(d)
      }
      return true
    })
    
    selectedRows.map((d) => {
      const index = selectedAssets.findIndex(x => x.idAtivo === d.idAtivo)
      if (index >= 0 && !rows.find(x => x.idAtivo === d.idAtivo)) {
        selectedAssets.splice(index, 1)
      }
      return true
    })

    setSelectedAssets([...selectedAssets])
    
    if (rows.length > 0 && requesterId && (!form.getFieldValue('requesterId') || form.getFieldValue('requesterId') !== requesterId)) {
      getRequester(requesterId)
    }      
    
    if (onChange !== undefined) {
      onChange()
    }
  }

  async function getRequester(requesterId) {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Pessoa`,
        params: { idCliente: requesterId },
      })
      const { data } = response
      if (data.isOk && data.pessoa.length > 0) {
        const record = data.pessoa[0]
        const source = [{
                id: record.idCliente,
                name: record.nome,
                document: record.cpfCnpjFormatado,
                personType: record.tipoPessoa,
                personId: record.idPessoa,
              }]
        setRequesterSource(source)
        form.setFieldsValue({ requesterId })
        handleChangeRequesterFromAssets(source, requesterId)        
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  
  useEffect(() => {
    setSearchValue('')
  // eslint-disable-next-line react-hooks/exhaustive-deps        
  },[assets])

  const newAsset = (id) => {
    setAssetId(id)
    setNewAssetModal(true)
    setKeyAssetModal(keyAssetModal + 1)
  }
  
  const refreshAssets = (asset) => {
    if (!asset) {
      return
    }
    const index = data.findIndex(x => x.idAtivo === asset.id)
    let d
    if (index > -1) {
       d = data[index]
       data[index].descricaoProduto = asset.descricaoProduto
       data[index].numeroSerie = asset.numeroSerie
    }
    else 
    {
      d = {
            idAtivo: asset.id,
            idCliente: asset.idCliente,
            descricaoProduto: asset.descricaoProduto,
            numeroSerie: asset.numeroSerie,
            nomeCliente: requesterSource.find(x => x.id === asset.idCliente)?.name,
          }
      data.push(d)
    }
    setData([...data])    
    if (!selectedAssets.find(x => x.idAtivo === asset.id)) {
      selectedAssets.push(d)
      setSelectedAssets([...selectedAssets])
    }        
  }

  return (
    <div className="mb-2">
    
      <Spin size="large" spinning={loading}>
        
        <NewAssetModal
          assetId={assetId}
          refreshData={refreshAssets}
          defaultCustomer={requesterSource.find(x => x.id === form.getFieldValue('requesterId'))}
          userPermissions={userPermissions}
          newAssetModal={newAssetModal}
          setNewAssetModal={setNewAssetModal}
          key={keyAssetModal}
          disableCustomer
        />
      
        <NewAttendanceModalAssetsForm
          canBeUpdated={canBeUpdated}
          newAsset={newAsset}
          setData={setData}
          keyTable={keyTable}
          setKeyTable={setKeyTable}
          selectedAssets={selectedAssets}
          setLoading={setLoading}
          form={form}
        />
        
        <NewAttendanceModalAssetsTable 
          rowSelection={rowSelection} 
          data={data}
          searchValue={searchValue}
          canBeUpdated={canBeUpdated}
          editAsset={newAsset}
          keyTable={keyTable}  
          userPermissions={userPermissions}        
        />

      </Spin>
      
    </div>
  )
}

NewAttendanceModalAssets.propTypes = {
  form: PropTypes.any,
  assets: PropTypes.array,
  selectedAssets: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  requesterSource: PropTypes.array,
  userPermissions: PropTypes.array,
  handleChangeRequesterFromAssets: PropTypes.func,
  onChange: PropTypes.func,
}
