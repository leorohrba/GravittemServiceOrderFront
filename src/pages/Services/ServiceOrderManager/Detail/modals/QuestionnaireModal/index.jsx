import { apiQuestionnaire } from '@services/api'
import { handleAuthError, sendDataToServer } from '@utils'
import { Button, Form, message, Modal, Row, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-locale'
import DateQuestionnaire from './DateQuestionnaire'
import GridQuestionnaire from './GridQuestionnaire'
import MultiSelectQuestionnaire from './MultiSelectQuestionnaire'
import NumberQuestionnaire from './NumberQuestionnaire'
import SelectQuestionnaire from './SelectQuestionnaire'
import SimpleQuestionnaire from './SimpleQuestionnaire'
import TextQuestionnaire from './TextQuestionnaire'

export default function QuestionnaireModal({
  osId,
  selectedQuestionnaire,
  visibleQuestionnaireModal,
  setVisibleQuestionnaireModal,
}) {
  const [form] = Form.useForm()
  const [questions, setQuestions] = useState()
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)

  useEffect(() => {
    if (visibleQuestionnaireModal) {
      getQuestionnaireForm()
    }
  }, [visibleQuestionnaireModal])

  function handleClose() {
    setVisibleQuestionnaireModal(false)
    form.resetFields()
    setQuestions()
  }

  async function getQuestionnaireForm() {
    setLoadingQuestions(true)
    try {
      const response = await apiQuestionnaire({
        method: 'GET',
        url: `/api/${
          selectedQuestionnaire.respondido
            ? 'QuestionarioRespondido'
            : 'Questionario'
        }?QuestionarioId=${selectedQuestionnaire.questionarioId}`,
      })
      const { data } = response
      if (data.length > 0) {
        setQuestions(data[0])
      }
    } catch (error) {
      handleAuthError(error)
    }
    setLoadingQuestions(false)
  }

  function handleSave() {
    form.validateFields().then(values => {
      let cantSave = false
      questions.gruposQuestionario.map(grupo =>
        grupo.gruposPerguntas
          .find(pergunta => pergunta.tipoPergunta === 6)
          ?.perguntas.map(pergunta => {
            if (pergunta.respostas.length === 0) {
              cantSave = true
            }
          }),
      )
      if (cantSave) {
        message.error('Preencha as respostas obrigatórias na matriz!')
      } else {
        saveQuestionnaire()
      }
    })
  }

  async function saveQuestionnaire() {
    setLoadingSave(true)
    try {
      questions.ordemServicoId = osId
      const successSave = await sendDataToServer(
        apiQuestionnaire,
        'post',
        `/api/QuestionarioRespondido`,
        'Não foi possível salvar as informações',
        questions,
      )
      if (successSave) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        handleClose()
      }
    } catch (error) {
      handleAuthError(error)
    }
    setLoadingSave(false)
  }

  return (
    <Modal
      title={
        selectedQuestionnaire?.descricao ?? selectedQuestionnaire?.questionario
      }
      visible={visibleQuestionnaireModal}
      width="50%"
      onCancel={handleClose}
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
            loading={loadingSave}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3"
            style={{
              marginRight: 'auto',
            }}
            onClick={handleClose}
            loading={loadingSave}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <Spin spinning={loadingQuestions}>
        {questions?.gruposQuestionario.map(group => (
          <React.Fragment>
            <h3>{group.descricao}</h3>
            {group.gruposPerguntas.map(questionnaire => (
              <Form layout="vertical" form={form}>
                {questionnaire.tipoPergunta === 1 && (
                  <SimpleQuestionnaire {...{ questionnaire }} />
                )}
                {questionnaire.tipoPergunta === 2 && (
                  <TextQuestionnaire {...{ questionnaire }} />
                )}
                {questionnaire.tipoPergunta === 3 && (
                  <SelectQuestionnaire {...{ questionnaire }} />
                )}
                {questionnaire.tipoPergunta === 4 && (
                  <MultiSelectQuestionnaire {...{ questionnaire }} />
                )}
                {questionnaire.tipoPergunta === 5 && (
                  <NumberQuestionnaire {...{ questionnaire }} />
                )}
                {questionnaire.tipoPergunta === 6 && (
                  <GridQuestionnaire {...{ questionnaire }} />
                )}
                {questionnaire.tipoPergunta === 7 && (
                  <DateQuestionnaire {...{ questionnaire }} />
                )}
              </Form>
            ))}
          </React.Fragment>
        ))}
      </Spin>
    </Modal>
  )
}
