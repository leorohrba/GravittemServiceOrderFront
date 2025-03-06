/* eslint-disable no-param-reassign */
import { Form, Radio } from 'antd'
import React from 'react'

export default function SelectQuestionnaire({ questionnaire }) {
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  }
  return questionnaire.perguntas.map(q => (
    <Form.Item
      label={q.descricao}
      name={q.id}
      tooltip={q.orientacao}
      rules={[
        {
          required: q.respostaObrigatoria,
          message: 'Campo obrigatório!',
        },
      ]}
      initialValue={q.respostas?.find(r => r.assinalado)?.respostaId}
    >
      <Radio.Group
        onChange={e =>
          (q.respostas = [
            {
              respostaId: e.target.value,
              assinalado: true,
            },
          ])
        }
      >
        {q.respostas.map(o => (
          <Radio style={radioStyle} value={o.respostaId}>
            {o.descricao}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  ))
}
