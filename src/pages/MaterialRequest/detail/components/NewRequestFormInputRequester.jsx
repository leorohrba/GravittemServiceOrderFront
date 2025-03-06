/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiMaterialRequest } from '@services/api'
import { handleAuthError, useCombinedRefs } from '@utils'
import { message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processSearchId = 0
const limit = 250

const NewRequestFormInputRequester = React.forwardRef((props, ref) => {
  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)

  const {
    form,
    canBeUpdated,
    autoFocus,
    requesterSource,
    setRequesterSource,
    onChange,
    requestNewId,
  } = props
  const { getFieldDecorator } = form

  const [requesterName, setRequesterName] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    form.setFieldsValue({ requesterId: null }) // por causa do bug do antd
  },[])
  
  useEffect(() => {
    setRequesterName('')
  }, [form.getFieldValue('requesterId')])

  const debouncedItemDescription = useDebounce(requesterName, 400)

  useEffect(() => {
    if (debouncedItemDescription) {
      populateItemSearch(debouncedItemDescription)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedItemDescription])

  const handleSearchRequester = value => {
    setRequesterName(value)
  }

  const populateItemSearch = name => {
    setRequesterSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getRequesters(name)
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
              source.push({ id: record.collaboratorId, name: record.name, isServicoExterno: record.isServicoExterno, isServicoInterno: record.isServicoInterno }),
            )
          } else {
            setNoResultsMessage('Não foram encontrados solicitantes')
          }
          setRequesterSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os solicitantes')
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
      id: null,
      name,
    }

    return apiMaterialRequest
      .get(`/api/stock/collaborator`, { params })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.collaborator
        }

        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  return (
    <React.Fragment>
      <Form.Item label="Solicitante" className="mb-0">
        {getFieldDecorator('requesterId', {
          initialValue: null,
          rules: [{ required: true, message: 'Campo obrigatório!' }],
        })(
          <Select
            placeholder="Digite o nome do solicitante"
            disabled={!canBeUpdated || requestNewId > 0}
            filterOption={false}
            showSearch
            onSearch={handleSearchRequester}
            ref={combinedRef}
            onChange={onChange}
            showArrow={false}
            className="select-autocomplete"
            optionLabelProp="label"
            autoFocus={
              autoFocus === null || autoFocus === undefined ? false : autoFocus
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
                {record.name}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </React.Fragment>
  )
})

NewRequestFormInputRequester.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  setRequesterSource: PropTypes.func,
  requesterSource: PropTypes.array,
  onChange: PropTypes.func,
  requestNewId: PropTypes.number,
}

export default NewRequestFormInputRequester
