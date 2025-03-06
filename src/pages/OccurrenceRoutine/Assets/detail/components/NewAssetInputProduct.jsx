import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiAttendance } from '@services/api'
import { handleAuthError, showApiMessages, useCombinedRefs } from '@utils'
import { Checkbox, Col, Input, message, Row, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processSearchId = 0
const limit = 250

const NewAssetInputProduct = React.forwardRef((props, ref) => {
  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)

  const {
    form,
    canBeUpdated,
    autoFocus,
    productSource,
    setProductSource,
    editData,
  } = props

  const { getFieldDecorator } = form

  const [productDescription, setProductDescription] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [productCode, setProductCode] = useState(null)
  const debouncedProductDescription = useDebounce(productDescription, 400)

  useEffect(() => {
    if (debouncedProductDescription) {
      populateProductSearch(debouncedProductDescription)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedProductDescription])

  const handleSearchProduct = value => {
    setProductDescription(value)
  }

  const populateProductSearch = description => {
    setProductSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getProducts(description)
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
                id: record.id,
                description: record.descricao,
                code: record.codigo,
              }),
            )
          } else {
            setNoResultsMessage('Não foram encontrados produtos')
          }
          setProductSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os produtos')
        setLoading(false)
      })
  }

  const getProducts = description => {
    if (!description) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      descricao: description,
      codigo: description,
    }

    return apiAttendance
      .get(`/api/Produto`, { params })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.produto
        }

        showApiMessages(data)

        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  useEffect(() => {
    let result
    if (
      productSource &&
      form.getFieldValue('productId') &&
      !form.getFieldValue('isProductManual')
    ) {
      const product = productSource.find(
        x => x.id === form.getFieldValue('productId'),
      )
      if (product && product.code) {
        result = `Código: ${product.code}`
      }
    }
    setProductCode(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productSource,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    form.getFieldValue('productId'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    form.getFieldValue('isProductManual'),
  ])

  return (
    <React.Fragment>
      <Form.Item
        label={
          <React.Fragment>
            <span>Produto</span>
            {getFieldDecorator('isProductManual', {
              valuePropName: 'checked',
              initialValue: !editData ? false : !editData.idProduto,
            })(
              <Checkbox
                style={{
                  fontWeight: 'normal',
                  padding: 0,
                  float: 'right',
                  height: '19px',
                }}
                disabled={!canBeUpdated}
              >
                Não possui cadastro
              </Checkbox>,
            )}
          </React.Fragment>
        }
        extra={productCode}
      >
        {!form.getFieldValue('isProductManual') ? (
          <React.Fragment>
            {getFieldDecorator('productId', {
              initialValue: !editData
                ? undefined
                : editData.idProduto
                ? editData.idProduto
                : undefined,
              rules: [
                {
                  required: !form.getFieldValue('isProductManual'),
                  message: 'Campo obrigatório',
                },
              ],
            })(
              <Select
                placeholder="Digite o código ou descriçao do produto"
                disabled={!canBeUpdated}
                filterOption={false}
                showSearch
                ref={combinedRef}
                onSearch={handleSearchProduct}
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
                  ) : productDescription ? (
                    noResultsMessage
                  ) : null
                }
              >
                {productSource.map((record, index) => (
                  <Option
                    key={index}
                    value={record.id}
                    label={record.description}
                  >
                    <Row style={{ width: '500px' }} type="flex">
                      <Col className="truncate" style={{ width: '360px' }}>
                        {record.description}
                      </Col>
                      <Col className="truncate" style={{ width: '130px' }}>
                        {record.code}
                      </Col>
                    </Row>
                  </Option>
                ))}
              </Select>,
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getFieldDecorator('productDescription', {
              initialValue: !editData
                ? null
                : editData.idProduto
                ? null
                : editData.descricaoProduto,
              rules: [
                {
                  required: form.getFieldValue('isProductManual'),
                  message: 'Campo obrigatório',
                },
              ],
            })(<Input ref={combinedRef} disabled={!canBeUpdated} />)}
          </React.Fragment>
        )}
      </Form.Item>
    </React.Fragment>
  )
})

NewAssetInputProduct.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  setProductSource: PropTypes.func,
  productSource: PropTypes.array,
  editData: PropTypes.object,
}

export default NewAssetInputProduct
