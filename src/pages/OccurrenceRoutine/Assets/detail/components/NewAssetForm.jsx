/* eslint-disable react/jsx-boolean-value */
import { Form } from '@ant-design/compatible'
import { getLocaleDateFormat } from '@utils'
import { Badge, Col, DatePicker, Input, Row, Select } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewAssetInputCustomer from './NewAssetInputCustomer'
import NewAssetInputProduct from './NewAssetInputProduct'

const { Option, OptGroup } = Select

const NewAssetForm = React.forwardRef((props, ref) => {
  const {
    form,
    canBeUpdated,
    setCustomerSource,
    customerSource,
    setProductSource,
    productSource,
    emptyReasonSource,
    editData,
    newAssetModal,
    refreshForm,
    disableCustomer,
    loading,
    assetId,
  } = props

  useEffect(() => {
    if (newAssetModal && refreshForm !== undefined) {
      refreshForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAssetModal])

  const { getFieldDecorator } = form
  const refProduct = React.useRef(null)
  
  useEffect(() => {
    if (
      !loading &&
      canBeUpdated &&
      ref.current &&
      !form.getFieldValue('customerId') &&
      !assetId &&
      !newAssetModal
    ) {
      ref.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, canBeUpdated, editData])
  

  useEffect(() => {
    if (
      !loading &&
      canBeUpdated &&
      refProduct.current &&
      !form.getFieldValue('productId') &&
      !assetId &&
      newAssetModal
    ) {
      try {
        refProduct.current.focus()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, canBeUpdated, editData])

  const selectAfter = (
    <div>
      {getFieldDecorator('emptyReason', {
        initialValue: editData ? editData.idNumeroSerieNaoInformado || null : null,
      })(
        <Select
          disabled={!canBeUpdated}
          style={{ width: 35 }}
          dropdownMatchSelectWidth={250}
          optionLabelProp="label"
          onChange={() => {
            form.setFieldsValue({ serialNumber: null })
            form.validateFields('serialNumber', { force: true })
          }}
        >
          <OptGroup
            label={formatMessage({
              id: 'occurrenceRoutine.assets.newAsset.emptyReason',
            })}
          >
            {emptyReasonSource.map(r => (
              <Option label="" value={r.id}>{r.descricao}</Option>
            ))}
          </OptGroup>
        </Select>,
      )}
    </div>
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

  return (
    <Form layout="vertical">
      <Row type="flex" gutter={16}>
        <Col span={10} style={{ width: '500px' }}>
          <NewAssetInputCustomer
            form={form}
            canBeUpdated={canBeUpdated && !disableCustomer}
            customerSource={customerSource}
            setCustomerSource={setCustomerSource}
            editData={editData}
            autoFocus
            ref={ref}
          />
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={10} style={{ width: '500px' }}>
          <NewAssetInputProduct
            form={form}
            canBeUpdated={canBeUpdated}
            productSource={productSource}
            setProductSource={setProductSource}
            editData={editData}
            ref={refProduct}
          />
        </Col>
        <Col span={8}>
          <Form.Item
            label={formatMessage({
              id: 'occurrenceRoutine.assets.newAsset.version',
            })}
          >
            {getFieldDecorator('version', {
              initialValue: editData ? editData.versao : null,
            })(<Input disabled={!canBeUpdated} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item
            label={formatMessage({
              id: 'occurrenceRoutine.assets.newAsset.purchaseDate',
            })}
          >
            {getFieldDecorator('purchaseDate', {
              initialValue: !editData
                ? null
                : editData.dataCompra
                ? moment(editData.dataCompra)
                : null,
            })(
              <DatePicker
                disabled={!canBeUpdated}
                style={{
                  width: '100%',
                }}
                format={getLocaleDateFormat()}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item
            label={formatMessage({
              id: 'occurrenceRoutine.assets.newAsset.serialNumber',
            })}
            extra={getEmptyReason(
              form.getFieldValue('serialNumber'),
              form.getFieldValue('emptyReason'),
            )}
          >
            {getFieldDecorator('serialNumber', {
              initialValue: editData ? editData.numeroSerie : null,
              rules: [
                {
                  required: !form.getFieldValue('emptyReason'),
                  message: formatMessage({ id: 'requiredFieldMessage' }),
                },
              ],
            })(<Input 
              disabled={!canBeUpdated} 
              addonAfter={selectAfter}
            />
              )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={formatMessage({
              id: 'occurrenceRoutine.assets.newAsset.invoiceNumber',
            })}
          >
            {getFieldDecorator('invoiceNumber', {
              initialValue: editData ? editData.numeroNotaFiscal : null,
            })(<Input disabled={!canBeUpdated} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={6}>
          <Form.Item
            label={formatMessage({
              id: 'occurrenceRoutine.assets.newAsset.identification',
            })}
          >
            {getFieldDecorator('identification', {
              initialValue: editData ? editData.identificacao : null,
            })(<Input disabled={!canBeUpdated} />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={formatMessage({
              id: 'occurrenceRoutine.assets.newAsset.installationDate',
            })}
          >
            {getFieldDecorator('installationDate', {
              initialValue: !editData
                ? null
                : editData.dataInstalacao
                ? moment(editData.dataInstalacao)
                : null,
            })(
              <DatePicker
                disabled={!canBeUpdated}
                style={{
                  width: '100%',
                }}
                format={getLocaleDateFormat()}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={formatMessage({
              id: 'occurrenceRoutine.assets.status',
            })}
          >
            {getFieldDecorator('status', {
              initialValue: editData ? editData.ativo : true,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'requiredFieldMessage' }),
                },
              ],
            })(
              <Select
                disabled={!canBeUpdated}
                placeholder={formatMessage({
                  id: 'select',
                })}
              >
                <Option value={true}>
                  <Badge
                    style={{ color: 'green' }}
                    color="green"
                    text="Ativo"
                  />
                </Option>
                <Option value={false}>
                  <Badge style={{ color: 'red' }} color="red" text="Inativo" />
                </Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
})

NewAssetForm.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  setCustomerSource: PropTypes.func,
  customerSource: PropTypes.array,
  setProductSource: PropTypes.func,
  productSource: PropTypes.array,
  emptyReasonSource: PropTypes.array,
  editData: PropTypes.object,
  refreshForm: PropTypes.func,
  newAssetModal: PropTypes.bool,
  disableCustomer: PropTypes.bool,
  loading: PropTypes.bool,
  assetId: PropTypes.number,
}

export default NewAssetForm
