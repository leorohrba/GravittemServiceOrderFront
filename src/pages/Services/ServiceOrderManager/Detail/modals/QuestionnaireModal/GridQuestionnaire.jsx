import { Table } from 'antd'
import update from 'immutability-helper'
import React, { useEffect, useState } from 'react'

export default function GridQuestionnaire({ questionnaire }) {
  const [tableData, setTableData] = useState(questionnaire.perguntas)

  useEffect(() => {
    let data = tableData
    questionnaire.perguntas.forEach((pergunta, rowIndex) => {
      pergunta.respostas.forEach((resposta, index) => {
        if (resposta.assinalado) {
          data = update(data, {
            [rowIndex]: {
              selected: { $set: resposta.descricao },
            },
          })
          setTableData(data)
        }
      })
    })
  }, [])

  const columns = [
    {
      title: 'Pergunta',
      render: record => (
        <span>
          {record.respostaObrigatoria && (
            <span className="text-red-600 font-bold mr-1">*</span>
          )}
          {record.descricao}
        </span>
      ),
    },
    ...questionnaire.matrizRespostas.map(resposta => ({
      title: resposta.descricao,
      dataIndex: 'selected',
      key: resposta.respostaId,
      align: 'center',
      render: d => (
        <i
          className="fa fa-check-circle fa-lg cursor-pointer"
          style={{
            color: `${d === resposta.descricao ? '#1976D2' : 'lightgray'}`,
          }}
        />
      ),
      onCell: (record, rowIndex) => {
        return {
          onClick: event => {
            const updatedData = update(tableData, {
              [rowIndex]: {
                selected: { $set: resposta.descricao },
              },
            })
            // eslint-disable-next-line no-param-reassign
            questionnaire.perguntas[rowIndex].respostas = [
              {
                respostaId: resposta.respostaId,
                assinalado: true,
              },
            ]
            setTableData(updatedData)
          },
        }
      },
    })),
  ]
  return (
    <Table
      dataSource={tableData}
      columns={columns}
      rowKey={row => row.perguntaId}
      pagination={false}
      bordered
    />
  )
}
