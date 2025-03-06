/* eslint-disable react-hooks/exhaustive-deps */
import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiMaterialRequest } from '@services/api'
import { handleAuthError, useCombinedRefs } from '@utils'
import { Col, message, Row, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processSearchId = 0
const limit = 250

const NewItemInputItem = React.forwardRef((props, ref) => {
  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)

  const {
    form,
    canBeUpdated,
    autoFocus,
    itemSource,
    setItemSource,
    onChangeItem,
    loadingItem,
    initialValue,
  } = props
  const { getFieldDecorator } = form

  const [itemDescription, setItemDescription] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.setFieldsValue({ itemId: null }) // por causa do bug do antd
  },[])
  
  useEffect(() => {
    setItemDescription('')
  }, [form.getFieldValue('itemId')])

  const debouncedItemDescription = useDebounce(itemDescription, 400)

  useEffect(() => {
    if (debouncedItemDescription) {
      populateItemSearch(debouncedItemDescription)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedItemDescription])

  const handleSearchItem = value => {
    setItemDescription(value)
  }

  const populateItemSearch = description => {
    setItemSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getItems(description)
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
                id: record.itemId,
                code: record.code,
                description: record.description,
                measuringUnitId: record.measuringUnitId,
                measuringUnitCode: record.measuringUnitCode,
                canDecimal: record.canDecimal,
                materialLikeCount: record.materialLikeCount,
                returnRequired: record.returnRequired,
                priceListId: record.priceListId,
                priceListDescription: record.priceListDescription,
                unitValue: record.unitValue || 0,
              }),
            )
          } else {
            setNoResultsMessage('Não foram encontrados itens')
          }
          setItemSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os itens')
        setLoading(false)
      })
  }

  const getItems = description => {
    if (!description) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      itemId: null,
      code: description,
      description,
      priceListId: form.getFieldValue('pricListId'),
    }

    return apiMaterialRequest
      .get(`/api/stock/searchItem`, { params })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.items
        }

        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const itemValidate = (rule, value, callback) => {
    if (value === 0) {
      callback(
        'É necessário informar um item que esteja cadastrado no sistema!',
      )
    } else {
      callback()
    }
  }

  return (
    <React.Fragment>
      <Form.Item label="Item" className="mb-0">
        {getFieldDecorator('itemId', {
          initialValue,
          rules: [
            { required: true, message: 'Campo obrigatório!' },
            { validator: itemValidate },
          ],
        })(
          <Select
            placeholder="Digite o código ou a descrição do item"
            disabled={!canBeUpdated}
            filterOption={false}
            showSearch
            onChange={onChangeItem}
            onSearch={handleSearchItem}
            ref={combinedRef}
            showArrow={false}
            className="select-autocomplete"
            optionLabelProp="label"
            loading={loadingItem}
            autoFocus={
              autoFocus === null || autoFocus === undefined ? false : autoFocus
            }
            notFoundContent={
              loading ? (
                <Spin size="small" />
              ) : itemDescription ? (
                noResultsMessage
              ) : null
            }
          >
            {itemSource.map((record, index) => (
              <Option key={index} value={record.id} label={record.description}>
                <Row style={{ width: '500px' }} type="flex">
                  <Col className="truncate" style={{ width: '390px' }}>
                    {record.description}
                  </Col>
                  <Col className="truncate" style={{ width: '100px' }}>
                    {record.code}
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

NewItemInputItem.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  setItemSource: PropTypes.func,
  itemSource: PropTypes.array,
  onChangeItem: PropTypes.func,
  loadingItem: PropTypes.bool,
  initialValue: PropTypes.number,
}

export default NewItemInputItem
