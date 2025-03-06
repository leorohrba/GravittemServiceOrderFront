import { Form } from '@ant-design/compatible'
import {
  getLocaleDateFormat,
  minuteToHourMinute,
  getNumberLength,
} from '@utils'
import {
  Alert,
  Badge,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  TimePicker,
  Tooltip,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewAttendanceInputRequester from './NewAttendanceInputRequester'
import NewAttendanceInputResponsible from './NewAttendanceInputResponsible'
import NewAttendancePlaceMapModal from './NewAttendancePlaceMapModal'
import InputMask from 'react-input-mask'

const { Option } = Select
const { TextArea } = Input

export default function NewAttendanceModalGeneral(props) {
  const {
    form,
    newAttendanceModal,
    setResponsibleSource,
    responsibleSource,
    requesterSource,
    setRequesterSource,
    statuses,
    priorities,
    classifications,
    refreshForm,
    canBeUpdated,
    editData,
    alertMessages,
    loading,
    onChangeRequester,
    loadingPlace,
    channels,
    setActiveTabKey,
    attendanceId,
    newScheduleDate,
    newDuration,
    categories,
  } = props

  const { getFieldDecorator } = form
  const format = 'HH:mm'

  const refScheduleDate = React.useRef()
  const refAlert = React.useRef()
  const refRequester = React.useRef()
  const refDuration = React.useRef()
  const refTime = React.useRef()

  const [statusIndex, setStatusIndex] = useState(null)
  const [placeMapModalVisible, setPlaceMapModalVisible] = useState(false)

  useEffect(() => {
    if (alertMessages.length > 0) {
      setActiveTabKey('1')
      if (refAlert.current) {
        refAlert.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertMessages])

  useEffect(() => {
    let index = null

    if (form.getFieldValue('status')) {
      index = statuses.findIndex(x => x.id === form.getFieldValue('status'))
    }

    if (index != null && index > -1 && form.getFieldValue('reason')) {
      const reason = statuses[index].motivos.find(
        x => x.id === form.getFieldValue('reason'),
      )
      if (!reason) {
        form.setFieldsValue({ reason: null })
      }
    }

    setStatusIndex(index != null && index > -1 ? index : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('status'), statuses])

  useEffect(() => {
    if (newAttendanceModal) {
      refreshForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAttendanceModal])

  useEffect(() => {
    if (
      !loading &&
      canBeUpdated &&
      refRequester.current &&
      !newScheduleDate &&
      !newDuration &&
      newAttendanceModal
    ) {
      try {
        refRequester.current.focus()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, canBeUpdated])

  useEffect(() => {
    if (
      !loading &&
      canBeUpdated &&
      refScheduleDate.current &&
      refTime.current &&
      newScheduleDate &&
      !newDuration &&
      newAttendanceModal
    ) {
      try {
        if (
          editData &&
          editData.dataAgendamento &&
          moment(editData.dataAgendamento).format('YYYY-MM-DD') ===
            newScheduleDate.format('YYYY-MM-DD')
        ) {
          refTime.current.focus()
        } else {
          refScheduleDate.current.focus()
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, canBeUpdated])

  useEffect(() => {
    if (
      !loading &&
      canBeUpdated &&
      refDuration.current &&
      newDuration &&
      newAttendanceModal
    ) {
      try {
        refDuration.current.focus()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, canBeUpdated])

  const getDuration = duration => {
    return duration < 1440
      ? moment(minuteToHourMinute(duration), 'HH:mm')
      : moment('23:59', 'HH:mm')
  }

  const getInitialSheduleDate = () => {
    let initialScheduleDate = null
    if (newScheduleDate) {
      initialScheduleDate = newScheduleDate
    } else if (editData && editData.dataAgendamento) {
      initialScheduleDate = moment(editData.dataAgendamento)
    }
    return initialScheduleDate
  }

  const getInitialTime = () => {
    let initialTime = null
    if (newScheduleDate) {
      initialTime = newScheduleDate
    } else if (editData && editData.horarioAgendamento) {
      initialTime = moment(editData.horarioAgendamento)
    }
    return initialTime
  }

  const getDefaultPosition = (readOnly, d) =>
    readOnly && d && d.latitude && d.longitude
      ? [d.latitude, d.longitude]
      : undefined

  const cellPhoneValidate = (rule, value, callback) => {
    const length = getNumberLength(value)
    if (!(length === 10 || length === 11 || length === 0)) {
      callback('Fone incompleto!')
    } else {
      callback()
    }
  }

  return (
    <Form layout="vertical">
      <div ref={refAlert}>
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message.mensagem}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}
      </div>
      <NewAttendancePlaceMapModal
        placeMapModalVisible={placeMapModalVisible}
        setPlaceMapModalVisible={setPlaceMapModalVisible}
        defaultPlace={form.getFieldValue('place')}
        readOnly={!canBeUpdated}
        defaultPosition={getDefaultPosition(!canBeUpdated, editData)}
        onChangePlace={
          canBeUpdated
            ? value => {
                setPlaceMapModalVisible(false)
                form.setFieldsValue({ place: value })
              }
            : undefined
        }
      />
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <NewAttendanceInputRequester
            form={form}
            canBeUpdated={canBeUpdated}
            requesterSource={requesterSource}
            setRequesterSource={setRequesterSource}
            editData={editData}
            autoFocus
            ref={refRequester}
            onChangeRequester={onChangeRequester}
            loadingPlace={loadingPlace}
          />
        </Col>
        <Col span={12}>
          <Form.Item className="mb-0" label="Solicitante">
            {getFieldDecorator('requesterName', {
              initialValue: !editData ? null : editData.nomeSolicitante,
              rules: [
                {
                  required: false,
                  message: 'Campo obrigatório',
                },
              ],
            })(
              <Input
                placeholder="Digite o nome do solicitante"
                disabled={!canBeUpdated}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item
            className="mb-0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.editAttendance.phone',
            })}
          >
            {getFieldDecorator('phone', {
              initialValue: editData ? editData.telefone : '',
              rules: [
                {
                  validator: cellPhoneValidate,
                },
              ],
            })(
              <InputMask
                maskChar={null}
                formatChars={{ '9': '[0-9]', '?': '[0-9 ]' }}
                mask={
                  getNumberLength(form.getFieldValue('phone')) <= 10
                    ? '(99) 9999-9999?'
                    : '(99) 99999-9999'
                }
                className="ant-input"
                disabled={!canBeUpdated}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            className="mb-0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.editAttendance.email',
            })}
          >
            {getFieldDecorator('email', {
              initialValue: editData ? editData.email : null,
              rules: [
                {
                  type: 'email',
                  message: 'E-mail invállido!',
                },
              ],
            })(<Input disabled={!canBeUpdated} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item
            className="mb-0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.classification',
            })}
          >
            {getFieldDecorator('classification', {
              initialValue: editData
                ? editData.idClassificacaoAtendimento
                : undefined,
            })(
              <Select
                showSearch
                allowClear
                size="default"
                disabled={!canBeUpdated}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {classifications.map(record => (
                  <Option value={record.id}>{record.descricao}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item className="mb-0" label="Categoria">
            {getFieldDecorator('category', {
              initialValue: editData
                ? editData.categoriasAtendimento.map(
                    c => c.idCategoriaAtendimento,
                  )
                : undefined,
            })(
              <Select
                showSearch
                mode="tags"
                allowClear
                size="default"
                disabled={!canBeUpdated}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {categories.map(record => (
                  <Option value={record.id}>{record.descricao}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col className="w-full">
          <Form.Item
            className="mb-0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.description',
            })}
          >
            {getFieldDecorator('description', {
              initialValue: editData ? editData.descricao : null,
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'requiredFieldMessage',
                  }),
                },
              ],
            })(<TextArea disabled={!canBeUpdated} />)}
          </Form.Item>
        </Col>
      </Row>
      <div style={{ display: attendanceId ? 'block' : 'none' }}>
        <Row>
          <Col className="w-full">
            <Form.Item
              className="mb-0"
              label={formatMessage({
                id:
                  'occurrenceRoutine.attendanceAndOccurrence.editAttendance.providence',
              })}
            >
              {getFieldDecorator('providence', {
                initialValue: editData ? editData.providencia : null,
              })(
                <TextArea
                  disabled={!canBeUpdated}
                  autoSize={{ minRows: 2, maxRows: 3 }}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>
      <Row>
        <Col className="w-full">
          <Form.Item
            className="mb-0"
            label={
              <React.Fragment>
                <span>Local do atendimento</span>
                <Tooltip title="Consultar mapa do local de atendimento">
                  <i
                    role="button"
                    onClick={() => setPlaceMapModalVisible(true)}
                    className="ml-2 fa fa-globe"
                    style={{ color: '#4CAF50', cursor: 'pointer' }}
                  />
                </Tooltip>
              </React.Fragment>
            }
          >
            {getFieldDecorator('place', {
              initialValue: editData ? editData.localAtendimento : null,
            })(<Input disabled={!canBeUpdated} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <NewAttendanceInputResponsible
            form={form}
            canBeUpdated={canBeUpdated}
            responsibleSource={responsibleSource}
            setResponsibleSource={setResponsibleSource}
            editData={editData}
          />
        </Col>
        <Col span={12}>
          <Form.Item
            className="mb-0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.schedullingDate',
            })}
          >
            {getFieldDecorator('scheduleDate', {
              initialValue: getInitialSheduleDate(),
            })(
              <DatePicker
                disabled={!canBeUpdated}
                format={getLocaleDateFormat()}
                style={{ width: '100%' }}
                ref={refScheduleDate}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item
            className="mb-0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.time',
            })}
          >
            {getFieldDecorator('time', { initialValue: getInitialTime() })(
              <TimePicker
                style={{ width: '100%' }}
                disabled={!canBeUpdated}
                format={format}
                ref={refTime}
                defaultOpenValue={moment('08:00', 'HH:mm')}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            className="mb-0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.duration',
            })}
          >
            {getFieldDecorator('duration', {
              initialValue: newDuration
                ? getDuration(newDuration)
                : editData && editData.duracao
                ? getDuration(editData.duracao)
                : null,
            })(
              <TimePicker
                style={{ width: '100%' }}
                format={format}
                disabled={!canBeUpdated}
                defaultOpenValue={moment('01:00', 'HH:mm')}
                ref={refDuration}
                minuteStep={5}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item
            className="mb=0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.priority',
            })}
          >
            {getFieldDecorator('priority', {
              initialValue: editData ? editData.idPrioridade : undefined,
            })(
              <Select
                showSearch
                allowClear
                size="default"
                disabled={!canBeUpdated}
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
                {priorities.map(record => (
                  <Option label={record.descricao} value={record.id}>
                    <div>
                      <i
                        className="fa fa-exclamation-circle fa-lg mr-3"
                        style={{
                          color: `${record.cor}`,
                        }}
                      />
                      <span>{record.descricao}</span>
                    </div>
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            className="mb=0"
            label={formatMessage({
              id:
                'occurrenceRoutine.attendanceAndOccurrence.newAttendanceModal.status',
            })}
          >
            {getFieldDecorator('status', {
              initialValue: editData
                ? editData.idStatus
                : statuses.length > 0
                ? statuses[0].id
                : undefined,
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
                showSearch
                size="default"
                disabled={!canBeUpdated}
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
                {statuses.map(record => (
                  <Option label={record.descricao} value={record.id}>
                    <Badge color={record.cor} text={record.descricao} />
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={12}>
          <Form.Item className="mb-0" label="Motivo">
            {getFieldDecorator('reason', {
              initialValue:
                editData && editData.idMotivo ? editData.idMotivo : undefined,
            })(
              <Select
                showSearch
                allowClear
                size="default"
                disabled={!canBeUpdated}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusIndex !== null &&
                  statuses[statusIndex].motivos.map(record => (
                    <Option key={record.id} value={record.id}>
                      {record.descricao}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item className="mb-0" label="Canal de atendimento">
            {getFieldDecorator('channel', {
              initialValue: editData ? editData.idCanalAtendimento : undefined,
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
                showSearch
                size="default"
                disabled={!canBeUpdated}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {channels.map(record => (
                  <Option value={record.id}>{record.descricao}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

NewAttendanceModalGeneral.propTypes = {
  form: PropTypes.any,
  newAttendanceModal: PropTypes.bool,
  refreshForm: PropTypes.func,
  setResponsibleSource: PropTypes.func,
  responsibleSource: PropTypes.array,
  requesterSource: PropTypes.array,
  setRequesterSource: PropTypes.func,
  statuses: PropTypes.array,
  priorities: PropTypes.array,
  classifications: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  editData: PropTypes.object,
  loading: PropTypes.bool,
  onChangeRequester: PropTypes.func,
  loadingPlace: PropTypes.bool,
  channels: PropTypes.array,
  alertMessages: PropTypes.array,
  setActiveTabKey: PropTypes.func,
  attendanceId: PropTypes.string,
  newScheduleDate: PropTypes.object,
  newDuration: PropTypes.number,
  categories: PropTypes.array,
}
