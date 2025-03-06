/**
 * breadcrumb: Solicitar atendimento
 */

import { Form } from '@ant-design/compatible'
import AttachmentsModal from '@components/modals/AttachmentsModal'
import { apiAttachment, apiAttendance } from '@services/api'
import {
  fieldsValidationToast,
  formatCellPhone,
  getHash,
  getNumberLength,
  handleAuthError,
  showApiMessages,
} from '@utils'
import {
  Alert,
  Button,
  Col,
  Input,
  notification,
  Row,
  Select,
  Spin,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'

const { TextArea } = Input
const { Option } = Select

function AttendanceRequest(props) {
  const { form } = props
  const { getFieldDecorator } = form

  const [alertMessages, setAlertMessages] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [classifications, setClassifications] = useState([])
  const [categories, setCategories] = useState([])
  const [attachments, setAttachments] = useState([])
  const [offlineFilesList, setOfflineFilesList] = useState([])
  const [externalFileList, setExternalFileList] = useState([])
  const refRequester = React.useRef()
  const refAlert = React.useRef()
  const hash = getHash()

  useEffect(() => {
    getAttendanceClassification()
    getAttendanceCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (alertMessages.length > 0 && refAlert.current) {
      refAlert.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertMessages])

  function handleSave() {
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        saveAttendance()
      }
    })
  }

  const cellPhoneValidate = (rule, value, callback) => {
    const length = getNumberLength(value)
    if (!(length === 10 || length === 11 || length === 0)) {
      callback('Fone incompleto!')
    } else {
      callback()
    }
  }

  async function getAttendanceClassification() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/SolicitarAtendimento/ClassificacaoAtendimento`,
        params: { status: 1, hash },
      })
      const { data } = response
      if (data.isOk) {
        setClassifications(data.classificacaoAtendimento)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getAttendanceCategory() {
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/SolicitarAtendimento/CategoriaAtendimento`,
        params: { status: 1, hash },
      })
      const { data } = response
      if (data.isOk) {
        setCategories(data.categoriaAtendimento)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function saveAttendance() {
    setIsSaving(true)

    const attendanceBody = {
      nomeSolicitante: form.getFieldValue('requesterName'),
      telefone: formatCellPhone(form.getFieldValue('phone'), true) || null,
      email: form.getFieldValue('email'),
      descricao: form.getFieldValue('description'),
      idClassificacaoAtendimento: form.getFieldValue('classification'),
      idsCategoriasAtendimento: form.getFieldValue('category'),
      hash,
    }

    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/SolicitarAtendimento`,
        data: attendanceBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        offlineFilesList.forEach(async file => {
          const form = new FormData()
          form.append('file', file.file, file.fileName)

          const attachmentsData = await apiAttachment.post(
            `/api/Anexo/${data.idGerado}`,
            form,
          )

          if (!attachmentsData.data.isOk) {
            setAlertMessages(attachmentsData.notificacoes)
            showApiMessages(attachmentsData)
          }
        })
        notification.success({
          message: 'Atendimento gerado com sucesso!',
          description: (
            <h3>
              Número de atendimento gerado:
              <b className="ml-2 mr-2">{data.numeroGerado}</b>
            </h3>
          ),
        })
        form.resetFields()
        setOfflineFilesList([])
        setExternalFileList([])
        if (refRequester.current) {
          refRequester.current.focus()
        }
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  return (
    <div className="container">
      <div
        style={{ minHeight: '700px', margin: 'auto' }}
        className="xl:w-2/6 lg:w-3/6 md:w-4/6 w-full"
      >
        <div className="w-full">
          <Spin spinning={isSaving} size="large">
            <Form layout="vertical">
              <h1 className="mb-4 text-center">Solicitar um atendimento</h1>

              <p clasName="mb-4">
                Informe os campos abaixo para solicitar um atendimento ao nosso
                suporte
              </p>

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

              <Form.Item label="Nome" className="mb-2">
                {getFieldDecorator('requesterName', {
                  rules: [
                    {
                      required: true,
                      message: 'Campo obrigatório!',
                    },
                  ],
                })(<Input autoFocus ref={refRequester} />)}
              </Form.Item>

              <Form.Item label="Telefone" className="mb-2">
                {getFieldDecorator('phone', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: 'Campo obrigatório!',
                    },
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
                  />,
                )}
              </Form.Item>

              <Form.Item label="E-mail" className="mb-2">
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: 'Campo obrigatório!',
                    },
                    {
                      type: 'email',
                      message: 'E-mail invállido!',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Row type="flex" gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Form.Item label="Classificação" className="mb-2">
                    {getFieldDecorator('classification', {
                      rules: [
                        {
                          required: true,
                          message: 'Campo obrigatório!',
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        size="default"
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
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <Form.Item label="Categorias" className="mb-2">
                    {getFieldDecorator('category', {
                      rules: [
                        {
                          required: false,
                          message: 'Campo obrigatório!',
                        },
                      ],
                    })(
                      <Select
                        mode="tags"
                        showSearch
                        size="default"
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
              <Form.Item label="Descrição" className="mb-2">
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: 'Campo obrigatório!',
                    },
                  ],
                })(<TextArea autoSize={{ minRows: 6, maxRows: 10 }} />)}
              </Form.Item>

              <AttachmentsModal
                buttonClassName="mr-2"
                entityId={1}
                hideModal
                offline
                {...{
                  offlineFilesList,
                  setOfflineFilesList,
                  attachments,
                  setAttachments,
                  externalFileList,
                  setExternalFileList,
                }}
              />
              <Button
                className="w-full"
                type="primary"
                onClick={() => handleSave()}
              >
                Enviar solicitação
              </Button>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  )
}

AttendanceRequest.propTypes = {
  form: PropTypes.any,
}

const WrappedAttendanceRequest = Form.create()(AttendanceRequest)
export default WrappedAttendanceRequest
