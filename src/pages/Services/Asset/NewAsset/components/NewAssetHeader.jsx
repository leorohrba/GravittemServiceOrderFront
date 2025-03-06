import AttachmentsModal from '@components/modals/AttachmentsModal'
import CommentsModal from '@components/modals/CommentsModal'
import { Button, Col, Divider } from 'antd'
import React, { useState } from 'react'

export default function NewAssetHeader() {
  const [attachments, setAttachments] = useState([])
  const [commentsData, setCommentsData] = useState({
    nomeUsuario: '',
    comentarios: [],
  })

  return (
    <div>
      <div className="flex">
        <Col className="ml-auto">
          <CommentsModal
            buttonClassName="mr-2"
            entityId=""
            {...{
              commentsData,
              setCommentsData,
            }}
          />
        </Col>
        <Col>
          <AttachmentsModal
            buttonClassName="mr-2"
            entityId=""
            {...{
              attachments,
              setAttachments,
            }}
          />
        </Col>
        <Button>
          <i className="fa fa-ellipsis-v" />
        </Button>
      </div>
      <Divider className="mt-1" />
    </div>
  )
}
