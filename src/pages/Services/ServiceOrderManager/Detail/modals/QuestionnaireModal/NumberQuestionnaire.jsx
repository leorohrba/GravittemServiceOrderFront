/* eslint-disable no-param-reassign */
import { Form, InputNumber } from 'antd'
import React from 'react'

export default function NumberQuestionnaire({ questionnaire }) {
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
      <InputNumber
        style={{ width: '50%' }}
        precision={q.apenasNumerosInteiros ? 0 : 2}
        onChange={e => (q.resposta = e)}
        onPressEnter={e => (q.resposta = e)}
      />
    </Form.Item>
  ))
}
