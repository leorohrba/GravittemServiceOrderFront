import { Button, message, Modal, Tag } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import SearchParticipantModalForm from './SearchParticipantModalForm'
import SearchParticipantModalTable from './SearchParticipantModalTable'

function SearchParticipantModal({
  form,
  participantModal,
  setParticipantModal,
  setParticipantsData,
}) {
  const [searchValues, setSearchValues] = useState([])
  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  function addParticipant(addAnother) {
    if (selectedRows.length > 0) {
      const newParticipant = selectedRows
      setParticipantsData(participantData => [
        ...participantData,
        ...newParticipant,
      ])
      if (!addAnother) {
        setParticipantModal(false)
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
        fieldName: 'Município',
        searchField: values.searchValue,
      }
      setSearchValues([...searchValues, { ...newSearchValue }])
      setData([
        {
          key: 2,
          nome: 'Atende Portaria',
          documento: '28.995.658/0001-36',
          endereco: 'Av. Álvaro Ramos, 2201',
          complemento: 'Sâo Paulo, SP - 02852-258',
          contato: '(11) 3232-3232',
          email: 'comercial@atendeportaria.com.br',
        },
        {
          key: 3,
          nome: 'Atende Portaria',
          documento: '28.995.658/0001-36',
          endereco: 'Av. Álvaro Ramos, 2201',
          complemento: 'Sâo Paulo, SP - 02852-258',
          contato: '(11) 3232-3232',
          email: 'comercial@atendeportaria.com.br',
        },
      ])
    }
  }

  return (
    <Modal
      title="Pesquisar participantes"
      visible={participantModal}
      width="60%"
      destroyOnClose
      onCancel={() => setParticipantModal(false)}
      footer={
        <div className="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={() => addParticipant(false)}
          >
            Salvar
          </Button>
          <Button
            ghost
            style={{
              color: '#4CAF50',
              border: '1px solid #4CAF50',
            }}
            onClick={() => addParticipant(true)}
          >
            Salvar e adicionar outro
          </Button>
          <Button onClick={() => setParticipantModal(false)}>Cancelar</Button>
        </div>
      }
    >
      <SearchParticipantModalForm {...{ form, getSearchValues }} />
      <span>
        {searchValues.map(s => (
          <Tag color="blue" closable>
            {s.fieldName}: {s.searchField}
          </Tag>
        ))}
      </span>
      <SearchParticipantModalTable {...{ rowSelection, data }} />
    </Modal>
  )
}

SearchParticipantModal.propTypes = {
  form: PropTypes.shape({
    getFieldsValue: PropTypes.func,
  }),
  participantModal: PropTypes.bool,
  setParticipantsData: PropTypes.func,
  setParticipantModal: PropTypes.func,
}

export default SearchParticipantModal
