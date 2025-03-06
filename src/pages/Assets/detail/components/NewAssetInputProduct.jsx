import useDebounce from '@components/useDebounce'
import { apiAttendance } from '@services/api'
import { handleAuthError, showApiMessages } from '@utils'
import { Col, Form, message, Row, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'

const { Option } = Select

const limit = 250

export default function NewAssetInputProduct({
  form,
  canBeUpdated,
  productSource,
  setProductSource,
  editData,
  setVisibleComplementaryDataModal,
}) {
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

    getProducts(description)
      .then(records => {
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
    if (productSource && form.getFieldValue('produto')) {
      const product = productSource.find(
        x => x.id === form.getFieldValue('produto'),
      )
      if (product && product.code) {
        result = `Código: ${product.code}`
      }
    }
    setProductCode(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSource, form.getFieldValue('produto')])

  return (
    <React.Fragment>
      <Form.Item
        label={
          <React.Fragment className="flex items-baseline">
            <div>Produto</div>
            <a
              className="font-normal ml-3"
              onClick={() => setVisibleComplementaryDataModal(true)}
            >
              Detalhes do produto <i className="fa fa-external-link ml-1" />
            </a>
          </React.Fragment>
        }
        name="produto"
        extra={productCode}
        initialValue={
          !editData
            ? undefined
            : editData.idProduto
            ? editData.idProduto
            : undefined
        }
        rules={[
          {
            required: true,
            message: 'Campo obrigatório',
          },
        ]}
      >
        <Select
          placeholder="Digite o código ou descrição do produto"
          disabled={!canBeUpdated}
          filterOption={false}
          showSearch
          onSearch={handleSearchProduct}
          showArrow={false}
          className="select-autocomplete"
          optionLabelProp="label"
          notFoundContent={
            loading ? (
              <Spin size="small" />
            ) : productDescription ? (
              noResultsMessage
            ) : null
          }
        >
          {productSource.map((record, index) => (
            <Option key={index} value={record.id} label={record.description}>
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
        </Select>
      </Form.Item>
    </React.Fragment>
  )
}
