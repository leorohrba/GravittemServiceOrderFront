import { Form } from '@ant-design/compatible'
import { Col, Input, InputNumber, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { TextArea } = Input

export const RequiredDevolutionModalForm = ({
  form,
  modalVisible,
  items,
  refreshForm,
  returnedItems,
  type,
  manual,
  canBeUpdated,
}) => {
  const { getFieldDecorator } = form

  useEffect(() => {
    if (modalVisible) {
      refreshForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible, items, manual])

  return (
    <React.Fragment>
      {returnedItems.map((record, i) => (
        <div
          className="pt-4 pl-4 mb-4"
          style={{
            border: '1px solid #E0E0E0',
          }}
          key={i}
        >
          <Form layout="vertical" id={`form-required-devolution-${i}`}>
            <Row>
              <Col>
                <h4>{type === 'Request' ? record.itemDescription : record.partDescription}</h4>
              </Col>
            </Row>
            <Row className="w-full" type="flex">
              <Col style={{ width: '200px' }}>
                <p className="mb-1">
                  {formatMessage({
                    id: 'materialRequest.RequiredDevolution.code',
                  })}
                  : {type === 'Request' ? record.itemCode : record.partCode}
                </p>
                <p className="mb-1">
                  {formatMessage({
                    id: 'materialRequest.RequiredDevolution.quantity',
                  })}
                  : {record.quantityApplied}
                </p>
                {((record.sequenceNumber && type === 'Request') || (record.requestNewSequenceNumber && type === 'ServiceOrder')) && (
                  <p className="mb-2">
                    {type === 'Request' ? 'Documento' : 'Requisição'}
                    : {' '}{type === 'Request' ? record.sequenceNumber : record.requestNewSequenceNumber}
                    {type === 'Request' && (
                      <React.Fragment>
                        <br />
                        <small>
                          <i style={{ color: 'gray' }}>{record.customerName}</i>
                        </small>
                      </React.Fragment>
                    )}
                  </p>
                )}
              </Col>
              <Col style={{ width: '100px', marginTop: '-10px' }}>
                <Form.Item
                  label={formatMessage({
                    id: 'materialRequest.RequiredDevolution.returned',
                  })}
                >
                  {getFieldDecorator(
                    `quantityReturned_${record.serviceOrderPartId}`,
                    {
                      initialValue: null,
                      rules: [
                        {
                          max: Number(record.quantityApplied),
                          transform: value => Number(value),
                          type: 'number',
                          message: formatMessage({
                            id:
                              'materialRequest.RequiredDevolution.valueGreaterThanQuantity',
                          }),
                        },
                      ],
                    },
                  )(
                    <InputNumber
                      autoFocus={i === 0}
                      min={0}
                      disabled={!canBeUpdated}
                      id="input-devolution-quantity"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col style={{ width: '270px', marginTop: '-10px' }}>
                <Form.Item
                  label={formatMessage({
                    id: 'materialRequest.RequiredDevolution.note',
                  })}
                >
                  {getFieldDecorator(
                    `observationReturned_${record.serviceOrderPartId}`,
                    {},
                  )(
                    <TextArea
                      placeholder={formatMessage({
                        id: 'materialRequest.RequiredDevolution.writeHere',
                      })}
                      disabled={!canBeUpdated}
                      autoSize={{
                        minRows: 1,
                        maxRows: 4,
                      }}
                      id="input-devolution-note"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ))}
    </React.Fragment>
  )
}

RequiredDevolutionModalForm.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  items: PropTypes.array,
  refreshForm: PropTypes.func,
  returnedItems: PropTypes.array,
  type: PropTypes.any,
  manual: PropTypes.any,
  canBeUpdated: PropTypes.bool,
}
