import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { formatDateInput } from '@utils/components'
import { DatePicker, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker

export function NewSimpleSearchForm({
  searchOptions,
  form,
  fieldNameIndex,
  setSearchValues,
  getSearchValues,
  inputSize,
  updateTags,
  searchBoxWidth,
  selectOptionsWidth,
  defaultType,
  disableAutoFocus,
  isSaveSearch,
}) {
  const initialOption =
    defaultType || (searchOptions.length > 0 ? searchOptions[0].value : null)
  const { getFieldDecorator } = form

  const [placeholder, setPlaceholder] = useState(
    searchOptions.length > 0 ? searchOptions[0].placeholder : null,
  )
  const [searchType, setSearchType] = useState(
    searchOptions.length > 0 ? searchOptions[0].type : null,
  )

  const [pickerType, setPickerType] = useState(
    searchOptions.length > 0 ? searchOptions[0].pickerType : null,
  )

  const [selectOptions, setSelectOptions] = useState(
    searchOptions.length > 0 ? searchOptions[0].options : null,
  )

  const [searchLabel, setSearchLabel] = useState('')
  const [showAction, setShowAction] = useState(['click'])

  const inputSearch = useRef(null)
  const inputSelect = useRef(null)
  const inputRange = useRef(null)

  const fieldNameDescription = `fieldName_${fieldNameIndex || 0}`
  const searchBoxDescription = `searchBox_${fieldNameIndex || 0}`

  function changeType(value) {
    for (let i = 0; i < searchOptions.length; i++) {
      if (searchOptions[i].value === value) {
        setSearchLabel(searchOptions[i].value)
        setSearchType(searchOptions[i].type)
        setPickerType(searchOptions[i].pickerType)
        setPlaceholder(searchOptions[i].placeholder)
        setSelectOptions(searchOptions[i].options)
        break
      }
    }
    form.setFieldsValue({
      [searchBoxDescription]: searchType === 'rangeDate' ? [] : undefined,
    })
  }

  function regexInput(e) {
    const reg = /^-?\d*(\.\d*)?$/
    if (!reg.test(e.target.value) || e.target.value === '' || e.target.value === '-') {
      // form.setFieldsValue({[searchBoxDescription]: e.target.value})
      e.target.value = ""
    }
  }

  useEffect(() => {
    // dar o foco no componente quando o tipo mudar
    !disableAutoFocus && focusOnComponent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLabel])

  useEffect(() => {
    !disableAutoFocus && focusOnComponent()
    // mudar o search se houver um padrão
    if (defaultType) {
      changeType(defaultType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultType])

  function focusOnComponent() {
    if (inputSearch.current != null && searchType === 'search') {
      inputSearch.current.focus()
    }

    if (inputSelect.current != null && searchType === 'select') {
      inputSelect.current.focus()
    }

    if (inputRange.current != null && searchType === 'rangeDate') {
      inputRange.current.focus()
    }
  }

  const changeSelect = optionSelected => {
    if (
      optionSelected !== null &&
      optionSelected !== '' &&
      optionSelected !== undefined
    ) {
      // OBS: valor pode ser 0 (zero) ou 'false'
      updateTags &&
        updateTags(form.getFieldValue(fieldNameDescription), optionSelected)
    }
  }

  const onRangePickerChange = value => {
    let v1 = null
    let v2 = null
    if (value[0]) {
      v1 = pickerType === 'time' ? value[0] : value[0].startOf('day')
    }
    if (value[1]) {
      v2 = pickerType === 'time' ? value[1] : value[1].endOf('day')
    }
    const valueWork = [v1, v2]
    updateTags &&
      updateTags(form.getFieldValue(fieldNameDescription), valueWork)
  }

  const addFilterToTag = e => {
    e.target.value &&
      updateTags &&
      updateTags(form.getFieldValue(fieldNameDescription), e.target.value)
    form.resetFields(searchBoxDescription)
  }

  return (
    <Form
      style={{
        display: 'flex',
        height: '33px',
      }}
    >
      <Form.Item>
        {getFieldDecorator(fieldNameDescription, {
          initialValue: initialOption,
        })(
          <Select
            onFocus={() => setShowAction(['focus', 'click'])}
            style={{
              width: selectOptionsWidth || 150,
            }}
            className="select-search-options"
            id="select-search-options"
            onChange={e => changeType(e)}
          >
            {searchOptions.map((
              searchOption,
              index, // eslint-disable-next-line react/no-array-index-key
            ) => (
              <Option key={index} value={searchOption.value}>
                {searchOption.label}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item
        style={{
          width: searchBoxWidth || 300,
        }}
        onChange={e =>
          searchType === 'rangeDate' &&
          formatDateInput(
            e.target.value,
            form,
            searchBoxDescription,
            inputRange,
            true,
          )
        }
      >
        {searchType === 'search' &&
          getFieldDecorator(searchBoxDescription, { initialValue: '' })(
            <Input
              id="simple-search"
              className="rounded-none"
              placeholder={placeholder}
              size={inputSize}
              onPressEnter={e => !isSaveSearch && addFilterToTag(e)}
              ref={inputSearch}
            />,
          )}
        {searchType === 'specialCode' &&
          getFieldDecorator(searchBoxDescription, { initialValue: '' })(
            <Input
              id="simple-search"
              className="rounded-none"
              placeholder={placeholder}
              size={inputSize}
              onPressEnter={e => !isSaveSearch && addFilterToTag(e)}
              ref={inputSearch}
              maxLength={3}
              onChange={e => regexInput(e)}
            />,
          )}
        {searchType === 'select' &&
          getFieldDecorator(
            searchBoxDescription,
            {},
          )(
            <Select
              placeholder={placeholder}
              className="no-select-border fix-arrow-click"
              style={{
                width: '100%',
              }}
              onChange={optionSelected => changeSelect(optionSelected)}
              ref={inputSelect}
              showSearch
              allowClear
              showAction={showAction}
              optionFilterProp="children"
              filterOption={(input, option) => {
                let checkFilter = -1
                try {
                  checkFilter = option.props.label
                    .toLowerCase()
                    .indexOf(input.toLowerCase())
                } catch {
                  checkFilter = -1
                }
                return checkFilter >= 0
              }}
            >
              {selectOptions.map((
                option,
                index, // eslint-disable-next-line react/no-array-index-key
              ) => (
                <Option label={option.label} key={index} value={option.value}>
                  {option.render ? (
                    option.render
                  ) : (
                    <div>
                      {option.icon && (
                        <i
                          className={`mr-2 fa ${option.icon}`}
                          style={{ color: option.color || 'black' }}
                        />
                      )}
                      {option.color ? (
                        <span style={{ color: option.color }}>
                          {option.label}
                        </span>
                      ) : (
                        <span>{option.label}</span>
                      )}
                    </div>
                  )}
                </Option>
              ))}
            </Select>,
          )}
        {searchType === 'rangeDate' &&
          getFieldDecorator(searchBoxDescription, { initialValue: [] })(
            <RangePicker
              className="no-range-picker-border"
              allowClear={false}
              format={
                pickerType === 'month'
                  ? 'MMMM/YYYY'
                  : pickerType === 'time'
                  ? 'HH:mm'
                  : 'DD/MM/YYYY'
              }
              placeholder={!pickerType && ['Data inicial', 'Data final']}
              ref={inputRange}
              onChange={onRangePickerChange}
              picker={pickerType || 'date'}
              style={{
                width: '100%',
              }}
            />,
          )}
      </Form.Item>
    </Form>
  )
}

NewSimpleSearchForm.propTypes = {
  defaultType: PropTypes.bool,
  disableAutoFocus: PropTypes.bool,
  isSaveSearch: PropTypes.bool,
  fieldNameIndex: PropTypes.number,
  form: PropTypes.object,
  getSearchValues: PropTypes.func,
  inputSize: PropTypes.number,
  searchBoxWidth: PropTypes.number,
  searchOptions: PropTypes.array,
  selectOptionsWidth: PropTypes.number,
  setSearchValues: PropTypes.func,
  updateTags: PropTypes.func,
}
