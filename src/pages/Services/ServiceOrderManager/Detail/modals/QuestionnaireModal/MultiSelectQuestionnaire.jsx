/* eslint-disable no-param-reassign */
import { Checkbox, Form } from 'antd'
import React from 'react'

export default function MultiSelectQuestionnaire({ questionnaire }) {
  const checkboxStyle = {
    display: 'block',
    marginLeft: 0,
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
      initialValue={q.respostas
        ?.filter(r => r.assinalado)
        ?.map(r => r.respostaId)}
    >
      <Checkbox.Group
        onChange={e =>
          (q.respostas = e.map(value => ({
            respostaId: value,
            assinalado: true,
          })))
        }
      >
        {q.respostas.map(o => (
          <Checkbox value={o.respostaId} className="mb-3" style={checkboxStyle}>
            {o.descricao}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Form.Item>
  ))
}
