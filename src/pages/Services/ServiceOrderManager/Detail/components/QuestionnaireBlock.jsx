import React, { useState } from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import QuestionnaireModal from '../modals/QuestionnaireModal'
import QuestionnaireBlockHeader from './QuestionnaireBlockHeader'
import QuestionnaireBlockTable from './QuestionnaireBlockTable'

export default function QuestionnaireBlock() {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState()
  const {
    questionnaireData,
    visibleQuestionnaireModal,
    setVisibleQuestionnaireModal,
  } = useNewServiceOrderContext()

  return (
    <div>
      <QuestionnaireModal
        {...{
          selectedQuestionnaire,
          visibleQuestionnaireModal,
          setVisibleQuestionnaireModal,
        }}
      />
      <QuestionnaireBlockHeader />
      <QuestionnaireBlockTable
        {...{
          setSelectedQuestionnaire,
          questionnaireData,
          setVisibleQuestionnaireModal,
        }}
      />
    </div>
  )
}
