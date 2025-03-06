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

const NewAssetInputCustomer = React.forwardRef((props, ref) => {
  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)

  const {
    form,
    canBeUpdated,
    autoFocus,
    customerSource,
    setCustomerSource,
    editData,
  } = props
  const { getFieldDecorator } = form

  const [customerName, setCustomerName] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const debouncedCustomerName = useDebounce(customerName, 400)

  useEffect(() => {
    if (debouncedCustomerName) {
      populateCustomerSearch(debouncedCustomerName)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCustomerName])

  const handleSearchCustomer = value => {
    setCustomerName(value)
  }

  const populateCustomerSearch = name => {
    setCustomerSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getCustomers(name)
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
              }),
            )
          } else {
            setNoResultsMessage('Não foram encontrados clientes')
          }
          setCustomerSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os clientes')
        setLoading(false)
      })
  }

  const getCustomers = name => {
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
        label="Cliente"
        extra={getDocument(customerSource, form.getFieldValue('customerId'))}
      >
        {getFieldDecorator('customerId', {
          initialValue: editData ? editData.idCliente : undefined,
          rules: [{ required: true, message: 'Campo obrigatório' }],
        })(
          <Select
            placeholder="Digite o nome do cliente"
            disabled={!canBeUpdated}
            filterOption={false}
            showSearch
            onSearch={handleSearchCustomer}
            showArrow={false}
            ref={combinedRef}
            className="select-autocomplete"
            optionLabelProp="label"
            autoFocus={
              autoFocus === null || autoFocus === undefined ? false : autoFocus
            }
            notFoundContent={
              loading ? (
                <Spin size="small" />
              ) : customerName ? (
                noResultsMessage
              ) : null
            }
          >
            {customerSource.map((record, index) => (
              <Option key={index} value={record.id} label={record.name}>
                <Row style={{ width: '500px' }} type="flex">
                  <Col className="truncate" style={{ width: '330px' }}>
                    {record.name}
                  </Col>
                  <Col className="truncate" style={{ width: '170px' }}>
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

NewAssetInputCustomer.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  setCustomerSource: PropTypes.func,
  customerSource: PropTypes.array,
  editData: PropTypes.object,
}

export default NewAssetInputCustomer
