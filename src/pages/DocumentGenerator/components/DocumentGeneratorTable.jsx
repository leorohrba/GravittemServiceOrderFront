/* eslint-disable no-unused-vars */
import DefaultTable from '@components/DefaultTable'
import { apiLayoutGenerator } from '@services/api'
import { sendDataToServer } from '@utils'
import { Button, Switch, Tooltip } from 'antd'
import React from 'react'
import { useDocumentGeneratorContext } from '../context/DocumentGeneratorContext'

function DocumentGeneratorTable() {
  const originUrl =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('originUrl')
      : ''

  const {
    data,
    setEditData,
    rowSelection,
    loading,
    getData,
  } = useDocumentGeneratorContext()

  function handleClick(record) {
    setEditData(record)
  }

  const onChangeDefaultModel = async recordId => {
    const body = {}
    const serverReturnSuccess = await sendDataToServer(
      apiLayoutGenerator,
      'put',
      `/api/ModeloDocumento/Padrao/${recordId}`,
      'Não foi possível tornar o modelo padrão',
      body,
    )
    if (serverReturnSuccess) {
      getData()
    }
  }

  const duplicateRecord = async recordId => {
    const body = {}
    const serverReturnSuccess = await sendDataToServer(
      apiLayoutGenerator,
      'post',
      `/api/ModeloDocumento/Duplicar/${recordId}`,
      'Não foi possível duplicar o modelo',
      body,
    )
    if (serverReturnSuccess) {
      getData()
    }
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      title: 'Padrão',
      dataIndex: 'padrao',
      render: (isDefault, item) => (
        <Switch
          checked={isDefault}
          onChange={() => onChangeDefaultModel(item.modeloDocumentoId)}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: '20%',
      render: record => (
        <>
          <Tooltip placement="top" title="Duplicar">
            <Button
              onClick={() => {
                duplicateRecord(record.modeloDocumentoId)
              }}
              shape="circle"
              type="primary"
              className="iconButton mr-3"
              ghost
              size="default"
            >
              <i className="fa fa-files-o fa-lg" />
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Editar">
            <a href={`${originUrl}/editor?id=${record.modeloDocumentoId}`}>
              <Button
                onClick={() => {
                  handleClick(record)
                }}
                shape="circle"
                type="primary"
                className="iconButton mr-3"
                ghost
                size="default"
              >
                <i className="fa fa-pencil fa-lg" />
              </Button>
            </a>
          </Tooltip>
          <Tooltip placement="top" title="Gerar PDF">
            <a href={`${originUrl}/print?id=${record.modeloDocumentoId}`}>
              <Button
                onClick={() => {
                  handleClick(record)
                }}
                shape="circle"
                type="primary"
                className="iconButton"
                ghost
                size="default"
              >
                <i className="fa fa-file-pdf-o fa-lg" />
              </Button>
            </a>
          </Tooltip>
        </>
      ),
    },
  ]
  return (
    <div>
      <DefaultTable
        rowSelection={rowSelection}
        columns={columns}
        loading={loading}
        rowKey={record => record.modeloDocumentoId}
        dataSource={data}
        locale={{
          emptyText: (
            <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
              <i
                className="fa fa-exclamation-circle fa-3x m-5"
                aria-hidden="true"
              />
              <h3>
                Não há dados aqui. Para cadastrar clique em <b>Novo perfil.</b>
              </h3>
            </div>
          ),
        }}
      />
    </div>
  )
}

export default DocumentGeneratorTable
