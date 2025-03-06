import DefaultTable from '@components/DefaultTable'
import { Badge, Button, Tooltip } from 'antd'
import React from 'react'

export default function QuestionnaireBlockTable({
  setSelectedQuestionnaire,
  questionnaireData,
  setVisibleQuestionnaireModal,
}) {
  const isPendingQuestionnaire = questionnaire =>
    questionnaire.respondido === false

  function handleQuestionnaire(data) {
    setSelectedQuestionnaire(data)
    setVisibleQuestionnaireModal(true)
  }

  const columns = [
    {
      title: 'Questionário',
      render: d => d.questionario ?? d.descricao,
    },
    {
      title: 'Status',
      render: d => (
        <Badge
          color={isPendingQuestionnaire(d) ? 'orange' : 'green'}
          text={isPendingQuestionnaire(d) ? 'Pendente' : 'Concluído'}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: record => (
        <Tooltip placement="top" title="Questionário">
          <Button
            shape="circle"
            type="primary"
            className="iconButton"
            ghost
            size="default"
            onClick={() => handleQuestionnaire(record)}
          >
            <i className="fa fa-list-ul fa-lg" />
          </Button>
        </Tooltip>
      ),
    },
  ]
  return (
    <DefaultTable
      dataSource={questionnaireData}
      columns={columns}
      rowKey={row => row.id}
    />
  )
}
