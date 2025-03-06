import { Button, Form, message, Modal, Tag } from 'antd'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNotificationManagementDataContext } from '../context/NotificationManagementData'
import LinkDocumentsModalForm from './LinkDocumentsModalForm'
import LinkDocumentsModalTable from './LinkDocumentsModalTable'

export default function LinkDocumentsModal() {
  const {
    documentsModal,
    setDocumentsModal,
    setLinkedDocuments,
  } = useNotificationManagementDataContext()

  const [form] = Form.useForm()
  const [searchValues, setSearchValues] = useState([])
  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  function addDocuments(addAnother) {
    if (selectedRows.length > 0) {
      const newDocument = selectedRows
      setLinkedDocuments(documentData => [...documentData, ...newDocument])
      if (!addAnother) {
        setDocumentsModal(false)
      }
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
    }
  }

  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
    },
  }

  const getSearchValues = () => {
    const values = form.getFieldsValue()
    if (values.searchValue) {
      const newSearchValue = {
        fieldName: 'Ordem de serviço',
        searchField: values.searchValue,
      }
      setSearchValues([...searchValues, { ...newSearchValue }])
      setData([
        {
          key: 2,
          ordemServico: '245876',
          cliente: 'João da Silva',
        },
      ])
    }
  }

  return (
    <Modal
      title="Vincular documentos"
      visible={documentsModal}
      width="55%"
      onCancel={() => setDocumentsModal(false)}
      footer={
        <div className="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={() => addDocuments(false)}
          >
            Salvar
          </Button>
          <Button
            ghost
            style={{
              color: '#4CAF50',
              border: '1px solid #4CAF50',
            }}
            onClick={() => addDocuments(true)}
          >
            Salvar e adicionar outro
          </Button>
          <Button onClick={() => setDocumentsModal(false)}>Cancelar</Button>
        </div>
      }
    >
      <LinkDocumentsModalForm {...{ form, getSearchValues }} />
      <span>
        {searchValues.map(s => (
          <Tag color="blue" closable>
            {s.fieldName}: {s.searchField}
          </Tag>
        ))}
      </span>
      <LinkDocumentsModalTable {...{ rowSelection, data }} />
    </Modal>
  )
}
