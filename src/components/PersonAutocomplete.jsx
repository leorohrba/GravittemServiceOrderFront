import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiFinancial } from '@services/api'
import { handleAuthError, isObjEmpty } from '@utils'
import { AutoComplete, Input, message, Select, Spin, Tag } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

export function PersonAutocomplete({
  setPersonTags,
  personTags,
  editData,
  required,
  type,
  disabled,
  label,
  hideLabel,
  costCenterData,
  setCostCenterData,
  accountPlanData,
  setAccountPlanData,
  financialTitleValue,
  financialTitleType,
  multiSelect,
}) {
  const [personData, setPersonData] = useState([])
  const [personOptions, setPersonOptions] = useState([])
  const [personValue, setPersonValue] = useState('')
  const [loadingPersonData, setLoadingPersonData] = useState(false)
  const debouncedInput = useDebounce(personValue, 400)
  const inputRef = useRef(null)

  const isEdit = !isObjEmpty(editData)
  useEffect(() => {
    isEdit &&
      setPersonTags([{ id: editData.pessoaId, label: editData.pessoaNome }])
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
    const personOptions =
      personData?.itens?.length > 0 &&
      personData.itens
        .filter(item => item.nome)
        .map(item => (
          <Option
            key={item.id}
            value={item.nome}
            document={item.documentoUnico}
            costCenterId={item.centroCustoId}
            costCenterDescription={item.centroCustoDescricao}
            accountPlanPaymentId={item.planoContaDespesaId}
            accountPlanPaymentDescription={item.planoContaDespesaDescricao}
            accountPlanPaymentColaborator={
              item.planoContaDespesaRelativoFuncionario
            }
            accountPlanReceiveId={item.planoContaReceitaId}
            accountPlanReceiveDescription={item.planoContaReceitaDescricao}
            accountPlanReceiveColaborator={
              item.planoContaReceitaRelativoFuncionario
            }
          >
            {item.nome}
          </Option>
        ))
    setPersonOptions(personOptions)
  }, [personData])

  function handleSelectPerson(selected, option, setInputValue, tags, setTags) {
    if (multiSelect) {
      !tags.some(t => t.id === option.key) &&
        setTags([
          ...tags,
          {
            id: option.key,
            label: selected,
            document: option.document,
            costCenterId: option.costCenterId,
            costCenterDescription: option.costCenterDescription,
            accountPlanPaymentId: option.accountPlanPaymentId,
            accountPlanPaymentDescription: option.accountPlanPaymentDescription,
            accountPlanPaymentColaborator: option.accountPlanPaymentColaborator,
            accountPlanReceiveId: option.accountPlanReceiveId,
            accountPlanReceiveDescription: option.accountPlanReceiveDescription,
            accountPlanReceiveColaborator: option.accountPlanReceiveColaborator,
            accountPlanType: option.accountPlanType,
          },
        ])
    } else {
      setTags([
        {
          id: option.key,
          label: selected,
          document: option.document,
          costCenterId: option.costCenterId,
          costCenterDescription: option.costCenterDescription,
          accountPlanPaymentId: option.accountPlanPaymentId,
          accountPlanPaymentDescription: option.accountPlanPaymentDescription,
          accountPlanPaymentColaborator: option.accountPlanPaymentColaborator,
          accountPlanReceiveId: option.accountPlanReceiveId,
          accountPlanReceiveDescription: option.accountPlanReceiveDescription,
          accountPlanReceiveColaborator: option.accountPlanReceiveColaborator,
          accountPlanType: option.accountPlanType,
        },
      ])
    }
    setInputValue(personValue)
    if (costCenterData && financialTitleValue && option.costCenterId) {
      setCostCenterData([
        ...costCenterData.filter(c => c.centroCustoId !== option.costCenterId),
        {
          centroCustoId: option.costCenterId,
          centroCustoDescricao: option.costCenterDescription,
          valor: parseFloat(financialTitleValue.replace(/,/g, '.')),
        },
      ])
    }

    if (
      accountPlanData &&
      financialTitleValue &&
      option.accountPlanPaymentId &&
      financialTitleType === 2
    ) {
      setAccountPlanData([
        ...accountPlanData.filter(
          c => c.planoContaId !== option.accountPlanPaymentId,
        ),
        {
          planoContaId: option.accountPlanPaymentId,
          planoContaDescricao: option.accountPlanPaymentDescription,
          planoContaTipo: option.accountPlanType,
          relativoFuncionario: option.accountPlanPaymentColaborator,
          valor: parseFloat(financialTitleValue.replace(/,/g, '.')),
        },
      ])
    }
    if (
      accountPlanData &&
      financialTitleValue &&
      option.accountPlanReceiveId &&
      financialTitleType === 1
    ) {
      setAccountPlanData([
        ...accountPlanData.filter(
          c => c.planoContaId !== option.accountPlanReceiveId,
        ),
        {
          planoContaId: option.accountPlanReceiveId,
          planoContaDescricao: option.accountPlanReceiveDescription,
          planoContaTipo: option.accountPlanType,
          relativoFuncionario: option.accountPlanReceiveColaborator,
          valor: parseFloat(financialTitleValue.replace(/,/g, '.')),
        },
      ])
    }
  }
  const closeTag = (tagToRemove, tags, setTags) => {
    const newTags = tags.filter(x => x !== tagToRemove)
    setTags(newTags)
  }
  return (
    <React.Fragment>
      <Form.Item
        label={
          label ||
          (!hideLabel &&
            `Pessoa (${
              !loadingPersonData ? personData.count : '...'
            } resultados)`)
        }
        style={{
          marginBottom: 0,
        }}
        required={required}
      >
        <AutoComplete
          value={personValue}
          onChange={e => setPersonValue(e)}
          dataSource={personOptions}
          onSelect={(selected, option) =>
            handleSelectPerson(
              selected,
              option,
              setPersonValue,
              personTags,
              setPersonTags,
            )
          }
          notFoundContent={
            loadingPersonData ? (
              <Spin size="small" />
            ) : (
              <div
                style={{
                  whiteSpace: 'normal',
                }}
                className="flex-wrap"
              >
                Nenhuma pessoa encontrada.
              </div>
            )
          }
          ref={inputRef}
          disabled={disabled}
        >
          <Input.Search placeholder="Digite para filtrar uma pessoa" />
        </AutoComplete>
      </Form.Item>

      <div className="mb-3">
        {personTags &&
          personTags.map(tag => (
            <Tag
              key={tag.id}
              color="blue"
              closable={!disabled}
              onClose={() => closeTag(tag, personTags, setPersonTags)}
              className="my-1"
            >
              {tag.label}
            </Tag>
          ))}
      </div>
    </React.Fragment>
  )
}

PersonAutocomplete.propTypes = {
  hideLabel: PropTypes.bool,
  label: PropTypes.string,
  editData: PropTypes.object,
  personTags: PropTypes.array,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  setPersonTags: PropTypes.func,
}
