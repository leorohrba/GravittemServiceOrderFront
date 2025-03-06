/* eslint-disable react/jsx-boolean-value */
import { PlusOutlined } from '@ant-design/icons'
import { getLocaleDateFormat } from '@utils'
import { Col, DatePicker, Form, Input, Row, Select, Tag, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useNewAssetContext } from '../context/NewAssetContext'
import NewAssetInputCustomer from './NewAssetInputCustomer'
import NewAssetInputProduct from './NewAssetInputProduct'

const { Option, OptGroup } = Select

export default function NewAssetForm({ form }) {
  const {
    editData,
    canBeUpdated,
    customerSource,
    setCustomerSource,
    productSource,
    setProductSource,
    emptyReasonSource,
    tags,
    setTags,
    setVisibleResellerModal,
    setVisibleInstallerModal,
    setVisibleComplementaryDataModal
  } = useNewAssetContext()

  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const refTag = React.useRef()

  const selectAfter = (
    <Form.Item
      noStyle
      className="mb-0"
      name="numeroSerieNaoInformado"
      initialValue={
        editData ? editData.idNumeroSerieNaoInformado || null : null
      }
    >
      <Select
        disabled={!canBeUpdated}
        style={{ width: 35 }}
        dropdownMatchSelectWidth={250}
        optionLabelProp="label"
        onChange={() => {
          form.setFieldsValue({ serialNumber: null })
          form.validateFields('numeroSerie', { force: true })
        }}
      >
        <OptGroup label="Motivo de não preenchimento">
          {emptyReasonSource.map(r => (
            <Option label="" value={r.id}>
              {r.descricao}
            </Option>
          ))}
        </OptGroup>
      </Select>
    </Form.Item>
  )

  const getEmptyReason = (serialNumber, emptyReasonId) => {
    let result
    if (!serialNumber && emptyReasonId) {
      const emptyReason = emptyReasonSource.find(x => x.id === emptyReasonId)
      if (emptyReason) {
        result = emptyReason.descricao
      }
    }
    return result
  }

  function handleInputConfirm() {
    let newTags = tags
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue]
    }
    setTags(newTags)
    setInputValue('')
    setInputVisible(false)
  }

  const removeTag = tag => {
    const newTags = tags.filter(x => x !== tag)
    setTags(newTags)
  }

  useEffect(() => {
    if (inputVisible && refTag.current) {
      refTag.current.focus()
    }
  }, [inputVisible])

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16}>
        <Col span={10} style={{ width: '500px' }}>
          <NewAssetInputCustomer
            form={form}
            canBeUpdated={canBeUpdated}
            customerSource={customerSource}
            setCustomerSource={setCustomerSource}
            editData={editData}
            autoFocus
          />
        </Col>
        <Col span={10} style={{ width: '500px' }}>
          <NewAssetInputProduct
            form={form}
            canBeUpdated={canBeUpdated}
            productSource={productSource}
            setProductSource={setProductSource}
            editData={editData}
            setVisibleComplementaryDataModal={setVisibleComplementaryDataModal}
          />
        </Col>
        <Col span={4}>
          <Form.Item
            label="Versão"
            name="versao"
            initialValue={editData ? editData.versao : null}
          >
            <Input disabled={!canBeUpdated} />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item
            label={
              <div className="flex items-baseline">
                <div>Data de compra</div>
                <a
                  className="font-normal ml-3"
                  onClick={() => setVisibleResellerModal(true)}
                >
                  Revendedor
                </a>
              </div>
            }
            extra={editData && editData.localCompra}
            name="dataCompra"
            initialValue={
              !editData
                ? null
                : editData.dataCompra
                ? moment(editData.dataCompra)
                : null
            }
          >
            <DatePicker
              disabled={!canBeUpdated}
              style={{
                width: '100%',
              }}
              format={getLocaleDateFormat()}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Término de garantia"
            name="garantia"
            initialValue={
              !editData
                ? null
                : editData.dataGarantia
                ? moment(editData.dataGarantia)
                : null
            }
          >
            <DatePicker
              disabled={!canBeUpdated}
              style={{
                width: '100%',
              }}
              format={getLocaleDateFormat()}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Número de série"
            name="numeroSerie"
            initialValue={editData ? editData.numeroSerie : null}
            ruler={[
              {
                required: !form.getFieldValue('numeroSerieNaoInformado'),
                message: formatMessage({ id: 'requiredFieldMessage' }),
              },
            ]}
            extra={getEmptyReason(
              form.getFieldValue('numeroSerie'),
              form.getFieldValue('numeroSerieNaoInformado'),
            )}
          >
            <Input disabled={!canBeUpdated} addonAfter={selectAfter} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Número de nota fiscal"
            name="numeroNotaFiscal"
            initialValue={editData ? editData.numeroNotaFiscal : null}
          >
            <Input disabled={!canBeUpdated} />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item
            label="Identificação"
            name="identificacao"
            initialValue={editData ? editData.identificacao : null}
          >
            <Input disabled={!canBeUpdated} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Número de patrimônio"
            name="patrimonio"
            initialValue={editData ? editData.patrimonio : null}
          >
            <Input disabled={!canBeUpdated} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={
              <div className="flex items-baseline">
                <div>Data de instalação</div>
                <a
                  className="font-normal ml-3"
                  onClick={() => setVisibleInstallerModal(true)}
                >
                  Instalador
                </a>
              </div>
            }
            extra={editData && editData.tecnico}
            name="dataInstalacao"
            initialValue={
              !editData
                ? null
                : editData.dataInstalacao
                ? moment(editData.dataInstalacao)
                : null
            }
          >
            <DatePicker
              disabled={!canBeUpdated}
              style={{
                width: '100%',
              }}
              format={getLocaleDateFormat()}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Status"
            name="status"
            initialValue={editData ? editData.status : ''}
            ruler={[
              {
                required: true,
                message: formatMessage({ id: 'requiredFieldMessage' }),
              },
            ]}
          >
            <Select
              disabled={!canBeUpdated}
              placeholder={formatMessage({
                id: 'select',
              })}
            >
              <Option value={true}>Ativo</Option>
              <Option value={false}>Inativo</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Motivo"
            name="motivo"
            initialValue={editData ? editData.motivo : ''}
          >
            <Select
              disabled={!canBeUpdated}
              placeholder={formatMessage({
                id: 'select',
              })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Tags" className="mb-0 mt-2">
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20
          const tagElem = (
            <Tag key={tag} closable onClose={() => removeTag(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          )
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          )
        })}
        {inputVisible ? (
          <Input
            type="text"
            size="small"
            style={{
              width: 120,
            }}
            value={inputValue}
            ref={refTag}
            onChange={e => setInputValue(e.target.value)}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag
            onClick={() => setInputVisible(true)}
            style={{
              background: '#fff',
              borderStyle: 'dashed',
            }}
          >
            <PlusOutlined /> Nova tag
          </Tag>
        )}
      </Form.Item>
    </Form>
  )
}
