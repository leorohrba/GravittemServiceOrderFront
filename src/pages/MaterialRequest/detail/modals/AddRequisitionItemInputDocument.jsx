/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiMaterialRequest } from '@services/api'
import { handleAuthError } from '@utils'
import { Button, Col, message, Row, Select, Spin, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select
let processSearchId = 0

const AddRequisitionItemInputDocument = props => {
  const {
    form,
    canBeUpdated,
    autoFocus,
    onChangeDocumentOrigin,
    documentOriginSource,
    setDocumentOriginSource,
    statusSource,
    requesterId,
    period,
    isRequisicaoOficina,
  } = props
  const { getFieldDecorator } = form

  const [documentDescription, setDocumentDescription] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.setFieldsValue({ documentOriginId: null }) // por causa do bug do antd
  }, [])

  useEffect(() => {
    setDocumentDescription('')
  }, [form.getFieldValue('documentOriginId')])

  const debouncedDocumentDescription = useDebounce(documentDescription, 400)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedDocumentDescription) {
      populateDocumentSearch(debouncedDocumentDescription)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDocumentDescription])

  const handleSearchDocument = value => {
    setDocumentDescription(value)
  }

  const populateDocumentSearch = description => {
    setDocumentOriginSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getDocuments(description)
      .then(records => {
        if (internalProcessSearchId === processSearchId) {
          const source = []
          setNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                documentId: record.documentId,
                sequenceNumber: record.sequenceNumber,
                customerName: record.customerName,
                inProgress: record.inProgress,
                collaboratorId: record.collaboratorId,
                actStatusCode: record.actStatusCode,
                documentType: record.documentType,
                roadMapDate: record.roadMapDate,
                entryDateFactory: record.entryDateFactory,
              }),
            )
          } else {
            setNoResultsMessage('Documento inválido')
          }
          setDocumentOriginSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os documentos')
        setLoading(false)
      })
  }

  const getDocuments = description => {
    if (!description) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      documentType: 1,
      documentId: null,
      sequenceNumber: description,
    }

    return apiMaterialRequest
      .get(`/api/stock/DocumentOrigin`, { params })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.documentOrigin
        }

        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const documentValidate = (rule, value, callback) => {
    const status = statusSource.find(
      x => x.id === form.getFieldValue('actStatusId'),
    )

    if (value) {
      const documentOrigin = documentOriginSource.find(
        x => x.documentId === value,
      )
      if (!documentOrigin) {
        // throw new Error('Documento inválido!')
        callback('Documento inválido!')
      } else if (
        !documentOrigin.inProgress &&
        (!status ||
          (status && !(status.code === 'CONC' || status.code === 'CANC')))
      ) {
        // throw new Error('Documento finalizado!')
        callback('Documento finalizado!')
      } else if (documentOrigin.collaboratorId !== requesterId) {
        // throw new Error('Documento não está vinculado ao solicitante!')
        callback('OS não está vinculado ao solicitante!')
      } else if (!period) {
        callback('Período da requisição não informado!')
      } else if (isRequisicaoOficina !== 1 && !documentOrigin.roadMapDate) {
        callback('OS não roteirizada!')
      } else if (
        isRequisicaoOficina !== 1 &&
        !(
          moment(documentOrigin.roadMapDate).format('YYYY-MM-DD') >=
            period[0].format('YYYY-MM-DD') &&
          moment(documentOrigin.roadMapDate).format('YYYY-MM-DD') <=
            period[1].format('YYYY-MM-DD')
        )
      ) {
        callback(
          `OS roteirizada fora do período da requisição! (${moment(
            documentOrigin.roadMapDate,
          ).format('DD/MM/YYYY')})`,
        )
      } else if (
        isRequisicaoOficina === 1 &&
        !documentOrigin.entryDateFactory
      ) {
        callback('OS sem data de entrada na oficina!')
      } else if (
        isRequisicaoOficina === 1 &&
        !(
          moment(documentOrigin.entryDateFactory).format('YYYY-MM-DD') >=
            period[0].format('YYYY-MM-DD') &&
          moment(documentOrigin.entryDateFactory).format('YYYY-MM-DD') <=
            period[1].format('YYYY-MM-DD')
        )
      ) {
        callback(
          `OS com data de entrada na oficina fora do período da requisição! (${moment(
            documentOrigin.entryDateFactory,
          ).format('DD/MM/YYYY')})`,
        )
      } else {
        callback()
      }
    } else if (!value && status && status.code === 'APLI') {
      // throw new Error('Campo obrigatório!')
      callback('Campo obrigatório!')
    } else {
      callback()
    }
  }

  const clearDocument = () => {
    setDocumentOriginSource([])
    form.setFieldsValue({ documentOriginId: null })
    onChangeDocumentOrigin(null)
  }

  return (
    <Row type="flex">
      <Col
        style={{
          width: form.getFieldValue('documentOriginId') ? '85%' : '100%',
        }}
      >
        <Form.Item label="Documento de origem" className="mb-0">
          {getFieldDecorator('documentOriginId', {
            initialValue: null,

            rules: [
              {
                validator: documentValidate,
              },
            ],
          })(
            <Select
              placeholder="Número do documento"
              disabled={!canBeUpdated}
              filterOption={false}
              showSearch
              onChange={onChangeDocumentOrigin}
              onSearch={handleSearchDocument}
              showArrow={false}
              className="select-autocomplete"
              autoFocus={
                autoFocus === null || autoFocus === undefined
                  ? false
                  : autoFocus
              }
              notFoundContent={
                loading ? (
                  <Spin size="small" />
                ) : documentDescription ? (
                  noResultsMessage
                ) : null
              }
            >
              {documentOriginSource.map((record, index) => (
                <Option key={index} value={record.documentId}>
                  {record.sequenceNumber}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
      {form.getFieldValue('documentOriginId') && (
        <Col className="ml-1" style={{ marginTop: '32px' }}>
          <Tooltip title="Limpar documento">
            <Button
              size="small"
              shape="circle"
              disabled={!canBeUpdated}
              onClick={() => clearDocument()}
            >
              <i className="fa fa-eraser" style={{ color: 'gray' }} />
            </Button>
          </Tooltip>
        </Col>
      )}
    </Row>
  )
}

AddRequisitionItemInputDocument.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onChangeDocumentOrigin: PropTypes.func,
  setDocumentOriginSource: PropTypes.func,
  documentOriginSource: PropTypes.array,
  statusSource: PropTypes.array,
  requesterId: PropTypes.number,
  period: PropTypes.any,
  isRequisicaoOficina: PropTypes.any,
}

export default AddRequisitionItemInputDocument
