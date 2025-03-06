import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { fieldsValidationToast } from '@utils'
import { Button, message, Modal, Row } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import MultipleEditModalForm from './MultipleEditModalForm'

function MultipleEditModal({
  form,
  multipleEditModal,
  setMultipleEditModal,
  data,
  selectedData,
  setData,
}) {
  const { validateFieldsAndScroll } = form
  const [changeAccess, setChangeAccess] = useState(1)
  const [changeDocuments, setChangeDocuments] = useState(1)
  const [changeLines, setChangeLines] = useState(1)
  const [changeStatus, setChangeStatus] = useState(1)

  function saveParticipants() {
    validateFieldsAndScroll(
      [
        'selectedAccess',
        'selectedDocuments',
        'selectedLines',
        'selectedStatus',
      ],
      (err, values) => {
        if (err) {
          fieldsValidationToast(err)
        } else {
          const access = changeAccess === 2 ? values.selectedAccess : null
          const documents =
            changeDocuments === 2 ? values.selectedDocuments : null
          const lines = changeLines === 2 ? values.selectedLines : null
          const status = changeStatus === 2 ? values.selectedStatus : null

          if (
            !(
              changeAccess === 1 &&
              changeDocuments === 1 &&
              changeLines === 1 &&
              changeStatus === 1
            )
          ) {
            let newData = data
            selectedData.map(r => {
              const index = data.findIndex(d => d.key === r.key)
              const currentData = data.find(d => d.key === r.key)
              newData = update(newData, {
                [index]: {
                  acesso: {
                    $set: access || currentData.acesso,
                  },
                  documentos: {
                    $set: documents || currentData.documentos,
                  },
                  linhas: {
                    $set: lines || currentData.linhas,
                  },
                  status: { $set: status || currentData.status },
                },
              })
              return true
            })
            setData(newData)
            message.success(
              formatMessage({
                id: 'successSave',
              }),
            )
          }
          setMultipleEditModal(false)
          setChangeStatus(1)
          setChangeAccess(1)
          setChangeDocuments(1)
          setChangeLines(1)
        }
      },
    )
  }

  return (
    <Modal
      title={formatMessage({
        id: 'contract.newContract.multipleEdit',
      })}
      visible={multipleEditModal}
      destroyOnClose
      onCancel={() => setMultipleEditModal(false)}
      footer={
        <Row type="flex" justify="space-between" align="middle">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={saveParticipants}
          >
            {formatMessage({ id: 'saveButton' })}
          </Button>
          <Button
            type="secondary"
            style={{
              marginRight: 'auto',
            }}
            onClick={() => setMultipleEditModal(false)}
          >
            {formatMessage({ id: 'cancelButton' })}
          </Button>
          <SmallTableFieldDescription
            label={`${selectedData.length} selecionados`}
            fontStyle="italic"
          />
        </Row>
      }
    >
      <MultipleEditModalForm
        {...{
          form,
          setChangeAccess,
          setChangeDocuments,
          setChangeLines,
          setChangeStatus,
          changeAccess,
          changeDocuments,
          changeLines,
          changeStatus,
        }}
      />
    </Modal>
  )
}

MultipleEditModal.propTypes = {
  data: PropTypes.array,
  multipleEditModal: PropTypes.bool,
  form: PropTypes.any,
  selectedData: PropTypes.array,
  setData: PropTypes.any,
  setMultipleEditModal: PropTypes.any,
}

export default MultipleEditModal
