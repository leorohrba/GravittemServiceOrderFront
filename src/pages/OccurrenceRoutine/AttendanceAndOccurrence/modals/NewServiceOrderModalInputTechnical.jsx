import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiContract } from '@services/api'
import { handleAuthError } from '@utils'
import { message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processSearchId = 0
const limit = 250

const NewServiceOrderModalInputTechnical = props => {
  const { form, technicalSource, setTechnicalSource } = props
  const { getFieldDecorator } = form

  const [technicalName, setTechnicalName] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const debouncedTechnicalName = useDebounce(technicalName, 400)

  useEffect(() => {
    if (debouncedTechnicalName) {
      populateTechnicalSearch(debouncedTechnicalName)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTechnicalName])

  const handleSearchTechnical = value => {
    setTechnicalName(value)
  }

  const populateTechnicalSearch = name => {
    setTechnicalSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getTechnicals(name)
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
              source.push({ id: record.technicalId, name: record.name }),
            )
          } else {
            setNoResultsMessage('Não foram encontrados técnicos')
          }
          setTechnicalSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os técnicos')
        setLoading(false)
      })
  }

  const getTechnicals = name => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      name,
    }

    return apiContract
      .get(`/api/services/Technical`, { params })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.technical
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
      <Form.Item label="Técnico">
        {getFieldDecorator('technicalId', {})(
          <Select
            placeholder="Digite o nome do técnico"
            allowClear
            filterOption={false}
            showSearch
            onSearch={handleSearchTechnical}
            showArrow={false}
            className="select-autocomplete"
            optionLabelProp="label"
            notFoundContent={
              loading ? (
                <Spin size="small" />
              ) : technicalName ? (
                noResultsMessage
              ) : null
            }
          >
            {technicalSource.map((record, index) => (
              <Option key={index} value={record.id} label={record.name}>
                {record.name}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </React.Fragment>
  )
}

NewServiceOrderModalInputTechnical.propTypes = {
  form: PropTypes.any,
  setTechnicalSource: PropTypes.func,
  technicalSource: PropTypes.array,
}

export default NewServiceOrderModalInputTechnical
