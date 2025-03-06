import SearchPersonModal from '@components/modals/SearchPersonModal'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import useDebounce from '@components/useDebounce'
import { apiFinancial } from '@services/api'
import { handleAuthError, isObjEmpty } from '@utils'
import { Badge, Button, Form, message, Select, Spin, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

export default function NewPersonAutocomplete({
  selectedPerson,
  setSelectedPerson,
  editData = {},
  required = false,
  type,
  disabled = false,
}) {
  const [personData, setPersonData] = useState([])
  const [personOptions, setPersonOptions] = useState([])
  const [personValue, setPersonValue] = useState('')
  const [loadingPersonData, setLoadingPersonData] = useState(false)
  const debouncedInput = useDebounce(personValue, 400)
  const inputRef = useRef(null)
  const [visibleSearchPersonModal, setVisibleSearchPersonModal] = useState(
    false,
  )

  const isEdit = !isObjEmpty(editData)
  useEffect(() => {
    if (isEdit) {
      setSelectedPerson({ id: editData.pessoaId, label: editData.pessoaNome })
      getPersonData(editData.pessoaNome)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    getPersonData(debouncedInput)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  useEffect(() => {
    getPersonData(debouncedInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getPersonData(input) {
    setLoadingPersonData(true)
    try {
      const response = await apiFinancial.get(
        `/api/Pessoa/Autocomplete?query=${input}${
          type ? `&tipoConsulta=${type}` : ''
        }`,
      )
      setPersonData({
        itens: response.data.pessoas,
        count: response.data.total,
      })
      setLoadingPersonData(false)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os dados de pessoa')
    }
  }

  useEffect(() => {
    const options =
      personData?.itens?.length > 0
        ? personData.itens.map(item => (
            <Option
              key={item.id}
              value={item.nome}
              document={item.documentoUnico}
              disabled={item.bloqueado}
            >
              <div className="flex">
                <span>
                  {item.nome}
                  {item.documentoUnico && (
                    <React.Fragment>
                      <br />
                      <SmallTableFieldDescription
                        label={item.documentoUnico}
                        fontStyle="italic"
                        color="gray"
                      />
                    </React.Fragment>
                  )}
                  {item.endereco && (
                    <React.Fragment>
                      <br />
                      <SmallTableFieldDescription
                        label={item.endereco}
                        fontStyle="italic"
                        color="gray"
                      />
                    </React.Fragment>
                  )}
                </span>
                {item.registros && (
                  <Tooltip
                    placement="top"
                    title={
                      <div>
                        {item.registros} registros encontrados com esse CPF.
                        <a href="#0"> Clique aqui para ver detalhes.</a>
                      </div>
                    }
                  >
                    <Badge
                      className="ml-auto mr-3 mt-1"
                      count={item.registros}
                      style={{
                        backgroundColor: '#f56a00',
                      }}
                    />
                  </Tooltip>
                )}
                {item.bloqueado && (
                  <Tooltip
                    placement="top"
                    title={<div>Cadastro bloqueado. Motivo: {item.motivo}</div>}
                  >
                    <i
                      className="fa fa-lock fa-lg mr-3 ml-auto mt-1"
                      style={{ color: '#f5222d' }}
                    />
                  </Tooltip>
                )}
                {item.novo && (
                  <Badge
                    className="ml-auto mr-5 mt-3"
                    count={
                      <span
                        className="text-center"
                        style={{
                          color: 'white',
                          borderRadius: '12px',
                          width: '40px',
                          height: '20px',
                          padding: '2px',
                          backgroundColor: '#2d73d0',
                        }}
                      >
                        <small className="font-bold">Novo</small>
                      </span>
                    }
                  />
                )}
              </div>
            </Option>
          ))
        : []
    setPersonOptions(options)
  }, [personData])

  function handleSelectPerson(selected, option) {
    setSelectedPerson({
      id: option.key,
      label: selected,
      document: option.document,
    })
    setPersonValue(selected)
  }

  function handleClear() {
    setSelectedPerson(null)
    setPersonValue('')
  }

  return (
    <React.Fragment>
      <SearchPersonModal
        {...{
          visibleSearchPersonModal,
          setVisibleSearchPersonModal,
          handleSelectPerson,
        }}
      />
      <Form.Item
        label={
          <span className="flex items-baseline">
            <div>Pessoa</div>
            {selectedPerson && <a className="font-normal ml-3">Editar</a>}
          </span>
        }
        style={{
          width: '100%',
        }}
        required={required}
        initialValue={isEdit ? selectedPerson : ''}
      >
        <Select
          value={personValue}
          showSearch
          onSearch={e => setPersonValue(e)}
          onSelect={(selected, option) => handleSelectPerson(selected, option)}
          suffixIcon={<i className="fa fa-search" />}
          loading={loadingPersonData}
          allowClear
          onClear={handleClear}
          notFoundContent={
            loadingPersonData ? (
              <Spin size="small" />
            ) : (
              <div
                style={{
                  whiteSpace: 'normal',
                  color: 'black',
                }}
                className="flex-wrap"
              >
                Nenhum resultado encontrado com o termo <b>{personValue}</b>.
                Clique para cadastrar ou{' '}
                <Button
                  type="link"
                  className="px-0"
                  onClick={() => setVisibleSearchPersonModal(true)}
                >
                  refinar a busca
                </Button>
                .
              </div>
            )
          }
          ref={inputRef}
          disabled={disabled}
        >
          {personOptions}
        </Select>
      </Form.Item>
    </React.Fragment>
  )
}
