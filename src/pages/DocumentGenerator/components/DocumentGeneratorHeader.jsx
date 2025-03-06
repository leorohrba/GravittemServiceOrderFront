/* eslint-disable no-unused-vars */
import NewSimpleSearch from '@components/NewSimpleSearch'
import { apiLayoutGenerator } from '@services/api'
import {
  confirmDelete,
  handleAuthError,
  showApiMessages,
  showApiNotifications,
} from '@utils'
import { Button, message } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import Link from 'umi/link'
import { useDocumentGeneratorContext } from '../context/DocumentGeneratorContext'

function DocumentGeneratorHeader() {
  const originUrl =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('originUrl')
      : ''
  const {
    dropdownVisible,
    setDropdownVisible,
    searchOptions,
    setTags,
    tags,
    startSearch,
    selectedRows,
    setLoading,
    getData,
    setSelectedRows,
  } = useDocumentGeneratorContext()

  async function deleteRecords() {
    try {
      const response = await apiLayoutGenerator({
        method: 'DELETE',
        url: `/api/ModeloDocumento`,
        data: {
          modeloDocumentoIds: selectedRows.map(
            record => record.modeloDocumentoId,
          ),
        },
        headers: { 'Content-Type': 'application/json' },
      })

      const { data } = response

      if (data.isOk) {
        getData()
        message.success(
          formatMessage({
            id: 'successDelete',
          }),
        )
        if (data.notificacoes?.length > 0) {
          showApiNotifications(data, 'warning')
        }
        setSelectedRows([])
      } else {
        showApiNotifications(data)
        showApiMessages(data)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }
  return (
    <div>
      <div className="flex justify-end">
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          startSearch={startSearch}
        />
      </div>
      {selectedRows.length === 0 ? (
        <div className="flex my-5">
          <div className="flex justify-between">
            <a href={`${originUrl}/editor`}>
              <Button type="primary">Novo modelo de proposta</Button>
            </a>
          </div>
          <div className="flex justify-between ml-5">
            <Link to="/DocumentGenerator/NewFieldType">
              <Button type="primary">Novo tipo de campo</Button>
            </Link>
          </div>
          <div className="flex justify-between ml-5">
            <Link to="/DocumentGenerator/NewField">
              <Button type="primary">Novo campo</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="my-5">
          <Button
            style={{
              color: 'red',
              borderColor: 'red',
            }}
            onClick={() =>
              confirmDelete(
                selectedRows.length,
                deleteRecords,
                ['Excluir modelo de proposta?', 'Excluir modelos de proposta?'],
                [
                  'Deseja excluir o modelo de proposta?',
                  'Deseja excluir os modelos de propostas selecionados?',
                ],
                'Excluir',
                'Cancelar',
              )
            }
          >
            <i className="fa fa-trash fa-lg mr-3" />
            Excluir ({selectedRows.length})
          </Button>
        </div>
      )}
      {/*
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">Configurações</Menu.Item>
            </Menu>
          }
          visible={dropdownVisible}
          trigger={['click']}
          onVisibleChange={visible => setDropdownVisible(visible)}
          className="ml-1"
        >
          <Button>
            <i className="fa fa-ellipsis-v fa-lg" aria-hidden="true" />
          </Button>
        </Dropdown>
        */}
    </div>
  )
}

export default DocumentGeneratorHeader
