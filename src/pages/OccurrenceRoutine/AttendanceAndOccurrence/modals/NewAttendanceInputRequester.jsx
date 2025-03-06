import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiAttendance } from '@services/api'
import { handleAuthError, showApiMessages, useCombinedRefs } from '@utils'
import { Col, message, Row, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processSearchId = 0
const limit = 250
const NewAttendanceInputRequester = React.forwardRef((props, ref) => {
  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)

  const {
    form,
    canBeUpdated,
    autoFocus,
    requesterSource,
    setRequesterSource,
    editData,
    onChangeRequester,
    loadingPlace,
  } = props

  const { getFieldDecorator } = form

  const [requesterName, setRequesterName] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const debouncedRequesterName = useDebounce(requesterName, 400)

  useEffect(() => {
    if (debouncedRequesterName) {
      populateRequesterSearch(debouncedRequesterName)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRequesterName])

  const handleSearchRequester = value => {
    setRequesterName(value)
  }

  const populateRequesterSearch = description => {
    setRequesterSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getRequesters(description)
      .then(records => {
        if (internalProcessSearchId === processSearchId) {
          const source = []
          setNoResultsMessage(null)

          const recordCount = records.length

          if (recordCount > 0) {
            const recordsFiltered =
              recordCount > limit ? records.slice(0, limit) : records
            if (recordCount > limit) {
              message.info(
                `Foram listados somente os primeiros ${limit} registros!`,
              )
            }

            recordsFiltered.map(record =>
              source.push({
                id: record.idCliente,
                name: record.nome,
                document: record.cpfCnpjFormatado,
                personType: record.tipoPessoa,
                personId: record.idPessoa,
              }),
            )
          } else {
            setNoResultsMessage('Não foram encontrados clientes')
          }
          setRequesterSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os clientes')
        setLoading(false)
      })
  }

  const getRequesters = name => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      isCustomer: true,
      nome: name,
    }

    return apiAttendance
      .get(`/api/Pessoa`, { params })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.pessoa
        }

        showApiMessages(data)

        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const getDocument = (source, id) => {
    let result
    if (source && id) {
      const customer = source.find(x => x.id === id)
      if (customer) {
        result = (
          <span>{`${customer.personType === 1 ? 'CPF' : 'CNPJ'}: ${
            customer.document
          }`}</span>
        )
      }
    }
    return result
  }

  return (
    <React.Fragment>
      <Form.Item 
        className="mb-0" 
        label="Cliente"
        extra={getDocument(
          requesterSource,
          form.getFieldValue('requesterId'),
        )}
      >
        {getFieldDecorator('requesterId', {
          initialValue: !editData
            ? undefined
            : editData.idSolicitante
            ? editData.idSolicitante
            : undefined,
          rules: [
            {
              required: false,
              message: 'Campo obrigatório',
            },
          ],
        })(
          <Select
            placeholder="Digite o nome do cliente"
            disabled={!canBeUpdated}
            filterOption={false}
            showSearch
            loading={loadingPlace}
            ref={combinedRef}
            onChange={value => onChangeRequester(value)}
            onSearch={handleSearchRequester}
            showArrow={false}
            className="select-autocomplete"
            optionLabelProp="label"
            autoFocus={
              autoFocus === null || autoFocus === undefined
                ? false
                : autoFocus
            }
            notFoundContent={
              loading ? (
                <Spin size="small" />
              ) : requesterName ? (
                noResultsMessage
              ) : null
            }
          >
            {requesterSource.map((record, index) => (
              <Option key={index} value={record.id} label={record.name}>
                <Row style={{ width: '100%' }} type="flex">
                  <Col className="truncate" style={{ width: '75%' }}>
                    {record.name}
                  </Col>
                  <Col className="truncate" style={{ width: '25%' }}>
                    {record.document}
                  </Col>
                </Row>
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </React.Fragment>
  )
})

NewAttendanceInputRequester.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  setRequesterSource: PropTypes.func,
  requesterSource: PropTypes.array,
  editData: PropTypes.object,
  onChangeRequester: PropTypes.func,
  loadingPlace: PropTypes.bool,
}

export default NewAttendanceInputRequester
