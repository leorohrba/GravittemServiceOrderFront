import AttachmentsModal from '@components/modals/AttachmentsModal'
import React, { useState } from 'react'

const AttachmentsModalExample = () => {
  const [attachments, setAttachments] = useState([])
  const entityId = 'A2B01EB3-B495-4099-BC84-598E6F96544A'
  return (
    <AttachmentsModal
      entityId={entityId}
      {...{ attachments, setAttachments }}
    />
  )
}

export default AttachmentsModalExample
