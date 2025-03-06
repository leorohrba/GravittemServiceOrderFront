import CommentsModal from '@components/modals/CommentsModal'
import React, { useState } from 'react'

export default function CommentsModalConfig() {
  const entityId = '0710d1af-2b81-459a-83a2-bee0ba624ac5'
  const [commentsData, setCommentsData] = useState({
    nomeUsuario: '',
    comentarios: [],
  })
  return (
    <React.Fragment>
      <CommentsModal
        {...{
          entityId,
          commentsData,
          setCommentsData,
        }}
      />
    </React.Fragment>
  )
}
