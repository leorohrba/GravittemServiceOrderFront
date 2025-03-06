import React, { useState, useEffect } from 'react'
import { apiLayoutGenerator } from '@services/api'
import { handleAuthError } from '@utils'
import { useNewServiceContext } from '../context/newServiceContext'
import { Dropdown, Menu, Button } from 'antd'

const PrintButton = () => {
  const [docsModels, setDocsModels] = useState([])
  const { loadingSave, handlePrint, isSaved } = useNewServiceContext()

  const menu = (
    <Menu>
      {docsModels.map(d => (
        <Menu.Item key={d.modeloDocumentoId} onClick={() => handlePrint(d.modeloDocumentoId)}> {d.nome} </Menu.Item>
      ))}
    </Menu>
  )

  const getDocsModels = async () => {
    try {
      const response = await apiLayoutGenerator.get(
        '/api/ModeloDocumento/Liberado',
        {
          params: { Codigo: 'ServiceOrder' },
        },
      )

      const { data } = response
      if (data) {
        setDocsModels(data)
      }
    } catch (err) {
      handleAuthError(err)
    }
  }

  useEffect(() => {
    getDocsModels()
  }, [])
  

  return (
   <>
   <Dropdown overlay={menu} trigger={['click']} disabled={!isSaved}>
      <Button
        icon={<i className="fa fa-print fa-lg mr-3" />}
        loading={loadingSave}
      >
        Imprimir
      </Button>
      </Dropdown>
  </>
      )
}

export default PrintButton
