/* eslint-disable jsx-a11y/label-has-associated-control */
import { Form } from '@ant-design/compatible'
import { InfoCircleFilled } from '@ant-design/icons'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { getLocaleDateFormat } from '@utils'
import { Checkbox, Col, DatePicker, Input, Row, Select, Tooltip } from 'antd'
import moment from 'moment'
import { PropTypes } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewRequestFormInputRequester from './NewRequestFormInputRequester'

const { TextArea } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const NewMaterialRequestForm = props => {
  const {
    form,
    canBeUpdated,
    setRequesterSource,
    requesterSource,
    onChangeStatus,
    statusSource,
    reasonSource,
    loadingReason,
    loadingStatus,
    setFormChanged,
    requestNewId,
  } = props

  const { getFieldDecorator } = form
  const [charCount, setCharCount] = useState(0)
  useEffect(() => {
    const observation = form.getFieldValue('observation')
    setCharCount(observation?.length || 0)
  }, [form])

  const dateFormat = getLocaleDateFormat()
  const blockRequisitionTooltip = formatMessage({
    id: 'materialRequest.NewMaterialRequisition.blockRequisitionTooltip',
  })

  function disabledDate(current) {
    return current && current < moment().startOf('day')
  }

  const handleChangeRequester = value => {
    if (form.getFieldValue('isRequisicaoOficina') === null) {
      const x = requesterSource.find(x => x.id === value)
      if (x && x?.isServicoExterno && !x?.isServicoInterno) {
        form.setFieldsValue({ isRequisicaoOficina: 2 })
      } else if (x && x?.isServicoInterno && !x?.isServicoExterno) {
        form.setFieldsValue({ isRequisicaoOficina: 1 })
      }
    }
    setFormChanged(true)
  }

  return (
    <Form layout="vertical" id="form-new-requisition">
      <Row gutter={24}>
        <Col xs={24} sm={24} md={10} lg={10} xl={6}>
          <NewRequestFormInputRequester
            form={form}
            autoFocus
            requestNewId={requestNewId}
            canBeUpdated={canBeUpdated}
            requesterSource={requesterSource}
            setRequesterSource={setRequesterSource}
            onChange={value => handleChangeRequester(value)}
          />
        </Col>
        <Col xs={24} sm={24} md={10} lg={12} xl={6}>
          <Form.Item
            label={formatMessage({
              id: 'materialRequest.NewMaterialRequisition.period',
            })}
          >
            {getFieldDecorator('period', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(
              <RangePicker
                id="rage-requisition-period"
                placeholder={['Data inicial', 'Data final']}
                format={dateFormat}
                disabled={!canBeUpdated || requestNewId > 0}
                disabledDate={disabledDate}
                onChange={() => setFormChanged(true)}
                style={{ width: '100%' }}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={10} lg={12} xl={6} style={{ width: '200px' }}>
          <Form.Item label="Tipo de requisição">
            {getFieldDecorator('isRequisicaoOficina', {
              initialValue: null,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(
              <Select
                placeholder={formatMessage({
                  id: 'materialRequest.AddRequisitionItemModalForm.select',
                })}
                size="default"
                disabled={!canBeUpdated}
                onChange={() => setFormChanged(true)}
              >
                <Option value={1}>Oficina</Option>
                <Option value={2}>Serviço externo</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={6} lg={6} xl={5} style={{ width: '300px' }}>
          <Form.Item
            label={formatMessage({
              id: 'materialRequest.NewMaterialRequisition.status',
            })}
          >
            {getFieldDecorator('actStatusId', {
              initialValue: null,
              getValueFromEvent: onChangeStatus,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(
              <Select
                id="select-item-status"
                showSearch
                placeholder={formatMessage({
                  id: 'materialRequest.AddRequisitionItemModalForm.select',
                })}
                size="default"
                disabled={!canBeUpdated}
                loading={loadingStatus}
                onChange={() => setFormChanged(true)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusSource.map(record => (
                  <Option value={record.id}>{record.description}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={5} style={{ width: '300px' }}>
          <Form.Item
            label={formatMessage({
              id: 'materialRequest.NewMaterialRequisition.reason',
            })}
          >
            {getFieldDecorator('actReasonId', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(
              <Select
                id="select-item-reason"
                showSearch
                placeholder={formatMessage({
                  id: 'materialRequest.AddRequisitionItemModalForm.select',
                })}
                size="default"
                loading={loadingReason}
                onChange={() => setFormChanged(true)}
                disabled={!canBeUpdated}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {reasonSource.map(record => (
                  <Option value={record.id}>{record.description}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <div>
        <Form.Item>
          {getFieldDecorator('isBlocked', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox
              onChange={() => setFormChanged(true)}
              id="checkbox-block-requisition"
              disabled={!canBeUpdated}
            >
              {formatMessage({
                id: 'materialRequest.NewMaterialRequisition.blocked',
              })}
            </Checkbox>,
          )}
          <Tooltip placement="right" title={blockRequisitionTooltip}>
            <InfoCircleFilled />
          </Tooltip>
        </Form.Item>
      </div>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} style={{ width: '400px' }}>
          <Form.Item
            label={
              <div className="flex justify-between">
                <label>Observação</label>
                <SmallTableFieldDescription
                  label={`${charCount}/250`}
                  color="gray"
                />
              </div>
            }
          >
            {getFieldDecorator('observation', {
              rules: [
                {
                  validator: (_, value) => {
                    if (value && value.length > 250) {
                      return Promise.reject(
                        'O número máximo de caracteres é 250',
                      )
                    }
                    return Promise.resolve()
                  },
                },
              ],
            })(
              <TextArea
                id="input-requisition-note"
                rows={1}
                onChange={e => {
                  setFormChanged(true)
                  setCharCount(e.target.value.length)
                }}
                disabled={!canBeUpdated}
                placeholder="Digite aqui"
                autoSize={{
                  minRows: 1,
                  maxRows: 6,
                }}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

NewMaterialRequestForm.propTypes = {
  form: PropTypes.object,
  canBeUpdated: PropTypes.bool,
  setRequesterSource: PropTypes.func,
  requesterSource: PropTypes.array,
  onChangeStatus: PropTypes.func,
  statusSource: PropTypes.array,
  reasonSource: PropTypes.array,
  loadingReason: PropTypes.bool,
  loadingStatus: PropTypes.bool,
  setFormChanged: PropTypes.func,
  requestNewId: PropTypes.number,
}

export default NewMaterialRequestForm
