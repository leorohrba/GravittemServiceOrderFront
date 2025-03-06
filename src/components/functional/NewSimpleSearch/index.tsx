import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { getLocaleDateFormat } from '@utils'
import { useSearchOptions } from '@utils/customHooks/screens'
import { Button, Input, message } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { NewSimpleSearchDropdown } from './NewSimpleSearchDropdown'
import { NewSimpleSearchForm } from './NewSimpleSearchForm'
import { NewSimpleSearchTags } from './NewSimpleSearchTags'

const InputGroup = Input.Group
let executeStartSearch = false

function NewSimpleSearch({
  enableAdvancedSearch,
  inputSize,
  searchStyle,
  hideSaveSearch,
  form,
  startSearch,
  tags,
  setTags,
  selectOptionsWidth,
  searchBoxWidth,
  defaultType,
  screenName,
  getSelectLabel,
  labelButton,
  hideSearchButton,
  ...rest
}) {
  const [searchOptions, loadingSearchOptions] = useSearchOptions()

  useEffect(() => {
    if (executeStartSearch) {
      startSearch()
    }
    executeStartSearch = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags])

  const searchValue = form.getFieldValue('fieldName_0')
  const searchBoxValue = form.getFieldValue('searchBox_0')

  const getSearchValues = searchBoxValue => {
    const field = searchOptions.find(s => s.value === searchValue)
    if (
      !field ||
      field.type === 'select' ||
      !searchBoxValue ||
      (field.type === 'rangeDate' &&
        (searchBoxValue.length === 0 || !searchBoxValue[0]))
    ) {
      startSearch()
    } else {
      executeStartSearch = true
      updateTags(searchValue, searchBoxValue)
    }
    field?.type === 'search' && form.resetFields('searchBox_0')
  }

  const updateTags = (fieldName, searchFieldValue) => {
    const field = searchOptions.find(s => s.value === fieldName)

    if (
      field.type === 'rangeDate' &&
      (!searchFieldValue[0] || !searchFieldValue[1])
    ) {
      // Significa que o usuário clicou no botão de limpar data do componente, neste caso não é feito nada
      executeStartSearch = false
      return
    }
    let newSearchFieldValue = searchFieldValue
    if (
      field.type === 'search' &&
      (searchFieldValue === '' || !searchFieldValue)
    ) {
      startSearch()
      return
    }
    if (field.type === 'search' && field.dataType === 'integer') {
      if (!Number.isInteger(Number(searchFieldValue))) {
        message.warning('Valor deve ser um número inteiro!')
        executeStartSearch = false
        return
      }
      newSearchFieldValue = Math.abs(parseInt(searchFieldValue))
    }

    const maxIndex = tags.map(n => n.key)
    const tagAlreadyExists = tags.some(
      tag =>
        tag.fieldName === field.label &&
        tag.searchFieldValue === newSearchFieldValue,
    )

    let searchField =
      field.type === 'rangeDate'
        ? `${newSearchFieldValue[0].format(
            field.pickerType === 'month'
              ? 'MMMM/YYYY'
              : field.pickerType === 'time'
              ? 'HH:mm'
              : getLocaleDateFormat(),
          )}~${newSearchFieldValue[1].format(
            field.pickerType === 'month'
              ? 'MMMM/YYYY'
              : field.pickerType === 'time'
              ? 'HH:mm'
              : getLocaleDateFormat(),
          )}`
        : newSearchFieldValue

    if (field.type === 'select' && getSelectLabel) {
      // TODO: Esta opção é para mostrar o label nas tags. A lógica do else if abaixo deverá ser implementada para que seja mostrada o label na tag e não o value
      const option = field.options.find(s => s.value === newSearchFieldValue)
      if (option) {
        searchField = option.label || newSearchFieldValue
      }
    } else if (field.type === 'select') {
      const objKey = typeof newSearchFieldValue === 'string' ? 'label' : 'value'
      const option = field.options.find(s => s[objKey] === newSearchFieldValue)
      if (option) {
        searchField = option.label || newSearchFieldValue
        newSearchFieldValue = option.value
      }
    }

    // se a tag não existir, adicionar a tag
    if (!tagAlreadyExists) {
      const newTag = {
        key: Object.keys(maxIndex).length === 0 ? 0 : Math.max(...maxIndex) + 1,
        fieldName: field.label,
        fieldValue: field.value,
        searchField,
        searchFieldValue: newSearchFieldValue,
        fieldType: field.type,
        pickerType: field.pickerType,
      }

      const rangeDateTagIndex =
        field.type === 'rangeDate'
          ? tags.findIndex(tag => tag.fieldName === field.label)
          : -1
      // se for campo período, substituir o valor do período
      if (rangeDateTagIndex > -1) {
        const newTagData = update(tags, {
          [rangeDateTagIndex]: {
            searchField: {
              $set: newTag.searchField,
            },
            searchFieldValue: {
              $set: newTag.searchFieldValue,
            },
          },
        })
        setTags(newTagData)
        // caso não seja, adicionar a tag
      } else {
        setTags([...tags, { ...newTag }])
      }
      // se a tag já existir, mostrar mensagem
    } else {
      if (field.type !== 'rangeDate') {
        message.warning('Esse filtro já existe')
      } else if (executeStartSearch) {
        startSearch()
      }
      executeStartSearch = false
    }
  }

  return (
    <div style={searchStyle}>
      {searchOptions?.length > 0 && (
        <InputGroup className="flex">
          <NewSimpleSearchForm
            {...{
              searchOptions,
              form,
              updateTags,
              getSearchValues,
              inputSize,
              searchBoxWidth,
              defaultType,
              selectOptionsWidth,
            }}
          />
          {!hideSearchButton && (
            <Button
              type="primary"
              loading={!searchOptions}
              className="rounded-l-none"
              onClick={() => getSearchValues(searchBoxValue)}
            >
              <i className="fa fa-search" aria-hidden="true" />
              {labelButton && <span className="ml-2">{labelButton}</span>}
            </Button>
          )}
          {!hideSaveSearch && searchOptions.length > 0 && (
            <NewSimpleSearchDropdown
              {...{
                searchOptions,
                tags,
                getSearchValues,
                updateTags,
                setTags,
                screenName,
                startSearch,
              }}
            />
          )}
        </InputGroup>
      )}
      <NewSimpleSearchTags {...{ setTags, tags, form }} />
    </div>
  )
}

NewSimpleSearch.propTypes = {
  defaultType: PropTypes.string,
  enableAdvancedSearch: PropTypes.bool,
  form: PropTypes.object,
  hideSaveSearch: PropTypes.object,
  inputSize: PropTypes.string,
  screenName: PropTypes.string,
  searchBoxWidth: PropTypes.number,
  searchOptions: PropTypes.array,
  searchStyle: PropTypes.object,
  selectOptionsWidth: PropTypes.number,
  setTags: PropTypes.func,
  startSearch: PropTypes.func,
  tags: PropTypes.array,
  getSelectLabel: PropTypes.bool,
  labelButton: PropTypes.string,
}

export default Form.create({ name: 'simple_search' })(NewSimpleSearch)
