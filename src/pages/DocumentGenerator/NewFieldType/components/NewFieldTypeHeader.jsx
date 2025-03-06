import Breadcrumb from '@components/Breadcrumb'
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
import { useNewFieldTypeContext } from '../context/DocumentGeneratorContext'

export default function NewFieldTypeHeader() {
  const {
    setNewFieldTypeModalVisible,
    selectedRows,
    getData,
    setSelectedRows,
    setLoading,
  } = useNewFieldTypeContext()
  async function deleteRecords() {
    try {
      const response = await apiLayoutGenerator({
        method: 'DELETE',
        url: `/api/CategoriaObjeto`,
        data: {
          categoriaObjetoIds: selectedRows.map(
            record => record.categoriaObjetoId,
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
      <Breadcrumb />
      {selectedRows.length === 0 ? (
        <div className="mt-8">
          <Button
            type="primary"
            onClick={() => setNewFieldTypeModalVisible(true)}
          >
            Novo tipo de campo
          </Button>
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
    </div>
  )
}
