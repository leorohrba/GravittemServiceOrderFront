import { apiQuestionnaire } from '@services/api'
import { handleAuthError } from '@utils'
import constate from 'constate'
import { useState } from 'react'

function useQuestionnaire() {
  const [visibleQuestionnaireModal, setVisibleQuestionnaireModal] = useState(
    false,
  )

  const [questionnaireData, setQuestionnaireData] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  async function getList(osId) {
    setLoadingData(true)
    try {
      const response = await apiQuestionnaire({
        method: 'GET',
        url: `/api/Questionario/OrdemServico/${osId}`,
      })
      const { data } = response
      if (data.questionarios) {
        setQuestionnaireData(data.questionarios)
      }
    } catch (error) {
      handleAuthError(error)
    }
    setLoadingData(false)
  }

  return {
    loadingData,
    getList,
    questionnaireData,
    visibleQuestionnaireModal,
    setVisibleQuestionnaireModal,
  }
}

const [QuestionnaireProvider, useQuestionnaireContext] = constate(
  useQuestionnaire,
)

export { QuestionnaireProvider, useQuestionnaireContext }
