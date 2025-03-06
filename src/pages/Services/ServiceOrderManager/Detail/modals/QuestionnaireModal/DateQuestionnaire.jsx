/* eslint-disable no-param-reassign */
import { DatePicker, Form } from 'antd'
import moment from 'moment'
import React from 'react'

export default function DateQuestionnaire({ questionnaire }) {
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
      initialValue={q.resposta && moment(q.resposta)}
    >
      <DatePicker
        format="DD/MM/YYYY HH:mm"
        showTime={{ format: 'HH:mm' }}
        onChange={e => (q.resposta = e)}
        onPressEnter={e => (q.resposta = e)}
        onOk={e => (q.resposta = e)}
      />
    </Form.Item>
  ))
}
