/**
 * breadcrumb: Questionário
 */
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { withWrapper } from 'with-wrapper'
import QuestionnaireBlockTable from '../ServiceOrderManager/Detail/components/QuestionnaireBlockTable'
import QuestionnaireModal from '../ServiceOrderManager/Detail/modals/QuestionnaireModal'
import {
  QuestionnaireProvider,
  useQuestionnaireContext,
} from './context/QuestionnaireContext'

function Questionnaire() {
  const query = new URLSearchParams(window?.location?.search)
  const originPath = query.get('path') 
  const osId = query.get('documentId')

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState()
  const [updateKey, setUpdateKey] = useState(0)
  const {
    loadingData,
    getList,
    questionnaireData,
    setVisibleQuestionnaireModal,
    visibleQuestionnaireModal,
  } = useQuestionnaireContext()

  useEffect(() => {
    getList(osId)
  }, [updateKey])

  useEffect(() => {
    if (!visibleQuestionnaireModal) {
      setUpdateKey(key => key + 1)
    }
  }, [visibleQuestionnaireModal])

  return (
    <div className="container">
      <Spin spinning={loadingData}>
        <QuestionnaireModal
          {...{
            osId,
            selectedQuestionnaire,
            visibleQuestionnaireModal,
            setVisibleQuestionnaireModal,
          }}
        />
        <QuestionnaireBlockTable
          {...{
            setSelectedQuestionnaire,
            questionnaireData,
            setVisibleQuestionnaireModal,
          }}
        />
      </Spin>
    </div>
  )
}

export const WrapperQuestionnaire = withWrapper((element, props) => {
  return <QuestionnaireProvider>{element}</QuestionnaireProvider>
})(props => {
  return <Questionnaire />
})

export default WrapperQuestionnaire
