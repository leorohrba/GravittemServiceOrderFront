import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiAttendance } from '@services/api'
import { handleAuthError, showApiMessages } from '@utils'
import { message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import PersonGroupPopover from '../../PersonGroup/components/PersonGroupPopover'

const { Option } = Select

let processSearchId = 0
const limit = 250

const NewAttendanceInputResponsible = props => {
  const {
    form,
    canBeUpdated,
    autoFocus,
    responsibleSource,
    setResponsibleSource,
    editData,
  } = props
  const { getFieldDecorator } = form

  const [responsibleName, setResponsibleName] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const debouncedResponsibleName = useDebounce(responsibleName, 400)

  useEffect(() => {
    if (debouncedResponsibleName) {
      populateResponsibleSearch(debouncedResponsibleName)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedResponsibleName])

  const handleSearchResponsible = value => {
    setResponsibleName(value)
  }

  const populateResponsibleSearch = name => {
    setResponsibleSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getResponsibles(name)
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
                id: record.idColaborador
                  ? `p-${record.idColaborador}`
                  : `g-${record.idGrupoColaborador}`,
                name: record.nome,
              }),
            )
          } else {
            setNoResultsMessage('Não foram encontrados registros')
          }
          setResponsibleSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os registros')
        setLoading(false)
      })
  }

  const getResponsibles = name => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      nome: name,
    }

    return apiAttendance
      .get(`/api/PessoaGrupoColaborador`, { params })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.pessoaGrupoColaborador
        }

        showApiMessages(data)

        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const showGroup = responsibleId => {
    if (responsibleId && responsibleId.substr(0, 2) === 'g-') {
      return (
        <React.Fragment>
          <span style={{ color: 'gray' }} className="mr-2">
            Grupo de colaboradores
          </span>
          <PersonGroupPopover personGroupId={responsibleId.substr(2)} />
        </React.Fragment>
      )
    }

    return null
  }

  return (
    <React.Fragment>
      <Form.Item
        className="mb-0"
        label="Responsável pelo atendimento"
        extra={showGroup(form.getFieldValue('responsibleId'))}
      >
        {getFieldDecorator('responsibleId', {
          initialValue: !editData
            ? undefined
            : editData.idResponsavelAtendimento
            ? `p-${editData.idResponsavelAtendimento}`
            : editData.idGrupoColaborador
            ? `g-${editData.idGrupoColaborador}`
            : undefined,
        })(
          <Select
            placeholder="Digite o responsável ou grupo de colaboradores"
            disabled={!canBeUpdated}
            allowClear
            filterOption={false}
            showSearch
            onSearch={handleSearchResponsible}
            showArrow={false}
            className="select-autocomplete"
            optionLabelProp="label"
            autoFocus={
              autoFocus === null || autoFocus === undefined ? false : autoFocus
            }
            notFoundContent={
              loading ? (
                <Spin size="small" />
              ) : responsibleName ? (
                noResultsMessage
              ) : null
            }
          >
            {responsibleSource.map((record, index) => (
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

NewAttendanceInputResponsible.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  setResponsibleSource: PropTypes.func,
  responsibleSource: PropTypes.array,
  editData: PropTypes.object,
}

export default NewAttendanceInputResponsible
