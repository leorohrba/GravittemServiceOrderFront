import { Form } from '@ant-design/compatible'
import { getLocaleDateFormat } from '@utils'
import { Col, DatePicker, Input, Row, Select, TimePicker, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import NewServiceOrderModalInputTechnical from './NewServiceOrderModalInputTechnical'

const { TextArea } = Input
const { Option } = Select

export function NewServiceOrderModalForm(props) {
  const {
    form,
    serviceOrderModalVisible,
    refreshForm,
    attendance,
    manufacturers,
    serviceOrderTypes,
    priorities,
    classifications,
    channels,
    loadingService,
    services,
    contracts,
    technicalSource,
    setTechnicalSource,
    getServices,
    onChangeServiceOrderType,
    canBeScheduled,
  } = props

  const { getFieldDecorator } = form

  useEffect(() => {
    if (serviceOrderModalVisible) {
      refreshForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceOrderModalVisible])

  return (
    <Form layout="vertical">
      {attendance && (
        <Row type="flex" className="w-full mb-2" gutter={12}>
          <Col className="w-1/3">
            <h3>
              Atendimento:<b className="ml-2">{attendance.numero}</b>
            </h3>
          </Col>
          <Col className="w-2/3 truncate">
            <h3>
              Solicitante:
              <b className="ml-2">
                <Tooltip title={attendance.nomeSolicitante}>
                  {attendance.nomeSolicitante}
                </Tooltip>
              </b>
            </h3>
          </Col>
        </Row>
      )}
      <Row gutter={12} type="flex">
        <Col span={12}>
          <Form.Item label="Tipo de ordem de serviço">
            {getFieldDecorator('serviceOrderType', {
              rules: [
                {
                  required: true,
                  message: 'Campo obrigatório',
                },
              ],
            })(
              <Select
                showSearch
                onChange={value => onChangeServiceOrderType(value)}
                size="default"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {serviceOrderTypes.map(record => (
                  <Option value={record.ServiceOrderTypeId}>
                    {record.Description}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Fabricante">
            {getFieldDecorator('manufacturer', {
              rules: [
                {
                  required: true,
                  message: 'Campo obrigatório',
                },
              ],
            })(
              <Select
                showSearch
                size="default"
                onChange={value => {
                  form.resetFields([
                    'priority',
                    'classification',
                    'channel',
                    'service',
                  ])
                  getServices(value)
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {manufacturers.map(record => (
                  <Option value={record.ManufacturerId}>{record.Name}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12} type="flex">
        <Col span={12}>
          <Form.Item label="Prioridade">
            {getFieldDecorator('priority', {})(
              <Select
                allowClear
                showSearch
                size="default"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {form.getFieldValue('manufacturer') &&
                  priorities
                    .filter(
                      x =>
                        x.idFabricante === form.getFieldValue('manufacturer'),
                    )
                    .map(record => (
                      <Option value={record.id}>{record.descricao}</Option>
                    ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Classificação">
            {getFieldDecorator('classification', {})(
              <Select
                allowClear
                showSearch
                size="default"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {form.getFieldValue('manufacturer') &&
                  classifications
                    .filter(
                      x =>
                        x.manufacturerId === form.getFieldValue('manufacturer'),
                    )
                    .map(record => (
                      <Option value={record.serviceOrderClassificationId}>
                        {record.serviceOrderClassificationDescription}
                      </Option>
                    ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12} type="flex">
        <Col span={12}>
          <Form.Item label="Canal de atendimento">
            {getFieldDecorator('channel', {})(
              <Select
                allowClear
                showSearch
                size="default"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {form.getFieldValue('manufacturer') &&
                  channels
                    .filter(
                      x =>
                        x.idFabricante === form.getFieldValue('manufacturer'),
                    )
                    .map(record => (
                      <Option value={record.id}>{record.descricao}</Option>
                    ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Serviço">
            {getFieldDecorator('service', {})(
              <Select
                allowClear
                showSearch
                loading={loadingService}
                size="default"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {form.getFieldValue('manufacturer') &&
                  services.map(record => (
                    <Option value={record.ServiceId}>{record.Name}</Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12} type="flex">
        <Col span={12}>
          <Form.Item label="Contrato">
            {getFieldDecorator('contract', {})(
              <Select
                allowClear
                showSearch
                size="default"
                optionFilterProp="children"
                optionLabelProp="label"
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
                {contracts.map(record => (
                  <Option label={record.number} value={record.contractId}>
                    <Row type="flex" className="w-full">
                      <Col style={{ width: '70px' }}>{record.number}</Col>
                      <Col>{record.descriptionStatus}</Col>
                      <Col style={{ marginLeft: 'auto' }}>
                        {record.initialDate && record.finalDate && (
                          <Tooltip
                            title={
                              <Row>
                                <Col>
                                  {`Período: ${moment(
                                    record.initialDate,
                                  ).format('DD/MM/YYYY')} ~ ${moment(
                                    record.finalDate,
                                  ).format('DD/MM/YYYY')}`}
                                </Col>
                                <Col>
                                  {`Contratante: ${record.contractorName}`}
                                </Col>
                                <Col>
                                  {`Contratado: ${record.contractedName}`}
                                </Col>
                              </Row>
                            }
                          >
                            <i className="fa fa-info-circle" />
                          </Tooltip>
                        )}
                      </Col>
                    </Row>
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tipo de serviço">
            {getFieldDecorator('serviceType', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: 'Campo obrigatório',
                },
              ],
            })(
              <Select>
                <Option value={0}>Manutenção preventiva</Option>
                <Option value={1}>Manutenção corretiva</Option>
                <Option value={2}>Execução de Serviço</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col className="w-full">
          <Form.Item label="Descrição">
            {getFieldDecorator('request', {
              initialValue: attendance?.descricao,
              rules: [
                {
                  required: true,
                  message: 'Campo obrigatório',
                },
              ],
            })(<TextArea autoSize={{ minRows: 2, maxRows: 3 }} />)}
          </Form.Item>
        </Col>
      </Row>
      <div style={{ display: canBeScheduled ? 'block' : 'none' }}>
        <Row className="mb-2">
          <h4>Agendamento</h4>
          <hr />
        </Row>
        <Row gutter={12} type="flex">
          <Col span={12}>
            <NewServiceOrderModalInputTechnical
              form={form}
              technicalSource={technicalSource}
              setTechnicalSource={setTechnicalSource}
            />
          </Col>
          <Col span={6}>
            <Form.Item label="Data agenda">
              {getFieldDecorator('scheduleDate', {})(
                <DatePicker
                  format={getLocaleDateFormat()}
                  style={{ width: '100%' }}
                  allowClear
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Horário agenda">
              {getFieldDecorator('scheduleTime', {})(
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  defaultOpenValue={moment('08:00', 'HH:mm')}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12} type="flex">
          <Col span={12}>
            <Form.Item label="Período">
              {getFieldDecorator('period', {})(
                <Select>
                  <Option value="M">Manhã</Option>
                  <Option value="T">Tarde</Option>
                  <Option value="C">Comercial</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  )
}

NewServiceOrderModalForm.propTypes = {
  form: PropTypes.any,
  attendance: PropTypes.any,
  serviceOrderModalVisible: PropTypes.bool,
  refreshForm: PropTypes.func,
  manufacturers: PropTypes.array,
  serviceOrderTypes: PropTypes.array,
  priorities: PropTypes.array,
  classifications: PropTypes.array,
  channels: PropTypes.array,
  services: PropTypes.array,
  loadingService: PropTypes.bool,
  contracts: PropTypes.array,
  setTechnicalSource: PropTypes.func,
  technicalSource: PropTypes.array,
  getServices: PropTypes.func,
  onChangeServiceOrderType: PropTypes.func,
  canBeScheduled: PropTypes.bool,
}
