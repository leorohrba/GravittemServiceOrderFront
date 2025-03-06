import { Form } from '@ant-design/compatible'
import { Badge, Button, Checkbox, Col, Input, message, Row, Select } from 'antd'
import update from 'immutability-helper'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

const NewStatusModalForm = React.forwardRef((props, ref) => {
  const {
    form,
    editData,
    reasonList,
    setReasonList,
    editReason,
    setEditReason,
    selectedRows,
    setSelectedRows,
    canBeUpdated,
    newStatusModal,
    refreshForm,
    checkInitialStatus,
  } = props

  const { getFieldDecorator } = form
  const refReason = React.useRef()

  useEffect(() => {
    if (refReason.current) {
      refReason.current.focus()
    }
  }, [editReason])

  useEffect(() => {
    if (newStatusModal) {
      refreshForm()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newStatusModal])

  const colorOptions = [
    { color: '#4CAF50' },
    { color: '#FDD835' },
    { color: '#FB8C00' },
    { color: '#D32F2F' },
    { color: '#AB47BC' },
    { color: '#1976D2' },
    { color: '#26C6DA' },
    { color: '#795548' },
    { color: '#F06292' },
    { color: '#3949AB' },
  ]

  const addReason = () => {
    form.validateFieldsAndScroll(['reason'], (err, values) => {
      if (!err) {
        const sameData = reasonList.find(
          d => values.reason.toLowerCase() === d.description.toLowerCase(),
        )
        if (sameData) {
          message.warn('Motivo já adicionado')
        } else {
          const maxAuxIndex = reasonList.map(n => n.key)
          const newData = {
            id: null,
            description: values.reason,
            key:
              Object.keys(maxAuxIndex).length === 0
                ? 0
                : Math.max(...maxAuxIndex) + 1,
          }
          setReasonList([...reasonList, { ...newData }])
          form.resetFields('reason')
          if (refReason.current) {
            refReason.current.focus()
          }
        }
      }
    })
  }

  function cancelEdit() {
    form.resetFields('reason')
    setEditReason(null)
    if (refReason.current) {
      refReason.current.focus()
    }
  }

  function saveEdit() {
    form.validateFieldsAndScroll(['reason'], (err, values) => {
      if (!err) {
        const sameData = reasonList.find(
          d =>
            values.reason.toLowerCase() === d.description.toLowerCase() &&
            d.key !== editReason.key,
        )
        if (sameData) {
          message.warn('Motivo já existe na lista!')
        } else {
          const index = reasonList.findIndex(d => d.key === editReason.key)
          setReasonList(
            update(reasonList, {
              [index]: {
                key: { $set: editReason.key },
                description: { $set: values.reason },
              },
            }),
          )
          form.resetFields('reason')
          setEditReason(null)
          if (refReason.current) {
            refReason.current.focus()
          }
        }
      }
    })
  }

  function deleteReason() {
    let newData = reasonList
    selectedRows.map(s => (newData = newData.filter(d => d.key !== s.key)))
    setReasonList(newData)
    setSelectedRows([])
    message.success(
      formatMessage({
        id: 'successDelete',
      }),
    )
  }

  const onChangeInitial = e => {
    if (e.target.checked) {
      checkInitialStatus()
    }
  }
  const initialValidate = (rule, value, callback) => {
    if (form.getFieldValue('status')) {
      form.validateFieldsAndScroll(['status'])
    }
    callback()
  }

  const statusValidate = (rule, value, callback) => {
    if (value === 2 && form.getFieldValue('initial')) {
      callback(
        "Status não pode estar marcado como 'inicial' se estiver inativo!",
      )
    } else {
      callback()
    }
  }

  return (
    <Form layout="vertical">
      <Row type="flex" gutter={8}>
        <Col style={{ width: '75%' }}>
          <Form.Item label="Descrição">
            {getFieldDecorator('description', {
              initialValue: editData ? editData.descricao : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(<Input ref={ref} autoFocus disabled={!canBeUpdated} />)}
          </Form.Item>
        </Col>
        <Col style={{ width: '25%' }}>
          <Form.Item label="Cor">
            {getFieldDecorator('color', {
              initialValue: editData ? editData.cor : '',
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
                disabled={!canBeUpdated}
                dropdownMenuStyle={{
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                {colorOptions.map(c => (
                  <Option value={c.color}>
                    <i
                      className="fa fa-circle"
                      style={{
                        color: c.color,
                      }}
                    />
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex">
        <Form.Item label="Status" style={{ width: '50%' }}>
          {getFieldDecorator('status', {
            initialValue: editData ? editData.status : 1,
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'requiredFieldMessage',
                }),
              },
              { validator: statusValidate },
            ],
          })(
            <Select
              disabled={!canBeUpdated}
              style={{
                width: '100%',
              }}
            >
              <Option value={1}>
                <Badge style={{ color: 'green' }} color="green" text="Ativo" />
              </Option>
              <Option value={2}>
                <Badge style={{ color: 'red' }} color="red" text="Inativo" />
              </Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item className="ml-4 mt-8">
          {getFieldDecorator('initial', {
            initialValue: editData ? editData.statusInicial : false,
            rules: [{ validator: initialValidate }],
            valuePropName: 'checked',
          })(
            <Checkbox disabled={!canBeUpdated} onChange={onChangeInitial}>
              {formatMessage({
                id: 'occurrenceRoutine.statusAndReason.initial',
              })}
            </Checkbox>,
          )}
        </Form.Item>
      </Row>
      {canBeUpdated && (
        <React.Fragment>
          {selectedRows.length > 0 ? (
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
                marginBottom: '20px',
              }}
              onClick={() => deleteReason()}
            >
              <i className="fa fa-trash fa-lg mr-3" />
              {formatMessage({
                id: 'delete',
              })}{' '}
              ({selectedRows.length})
            </Button>
          ) : (
            <Row>
              <Form.Item className="m-0">
                {getFieldDecorator('reason', {
                  initialValue: editReason ? editReason.description : '',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'requiredFieldMessage',
                      }),
                    },
                  ],
                })(
                  <Input
                    placeholder="Insira um motivo aqui"
                    ref={refReason}
                    className="mr-2 mb-1"
                    style={{ width: '70%' }}
                    onPressEnter={e => {
                      editReason ? saveEdit() : addReason()
                    }}
                  />,
                )}
                {editReason ? (
                  <React.Fragment>
                    <Button type="primary" onClick={() => saveEdit()}>
                      {formatMessage({
                        id: 'saveButton',
                      })}
                    </Button>
                    <Button
                      className="ml-2"
                      type="secondary"
                      onClick={() => cancelEdit()}
                    >
                      {formatMessage({
                        id: 'cancelButton',
                      })}
                    </Button>
                  </React.Fragment>
                ) : (
                  <Button type="primary" onClick={() => addReason()}>
                    {formatMessage({
                      id: 'occurrenceRoutine.statusAndReason.addReason',
                    })}
                  </Button>
                )}
              </Form.Item>
            </Row>
          )}
        </React.Fragment>
      )}
    </Form>
  )
})

NewStatusModalForm.propTypes = {
  editData: PropTypes.object,
  editReason: PropTypes.object,
  form: PropTypes.any,
  setReasonList: PropTypes.any,
  setEditReason: PropTypes.any,
  selectedRows: PropTypes.array,
  setSelectedRows: PropTypes.any,
  reasonList: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  newStatusModal: PropTypes.bool,
  refreshForm: PropTypes.func,
  checkInitialStatus: PropTypes.func,
}

export default NewStatusModalForm
