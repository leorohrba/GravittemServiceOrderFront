/* eslint-disable no-param-reassign */
import { Form, Input } from 'antd'
import React from 'react'

export default function TextQuestionnaire({ questionnaire }) {
  return questionnaire.perguntas.map(q => (
    <Form.Item
      label={q.descricao}
      name={q.perguntaId}
      tooltip={q.orientacao}
      rules={[
        {
          required: q.respostaObrigatoria,
          message: 'Campo obrigatório!',
        },
      ]}
      initialValue={q.resposta}
    >
      <Input.TextArea
        autoSize={{ minRows: 2, maxRows: 4 }}
        onChange={e => (q.resposta = e.target.value)}
        onPressEnter={e => (q.resposta = e.target.value)}
      />
    </Form.Item>
  ))
}
