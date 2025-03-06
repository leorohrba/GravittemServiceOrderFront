import { Button, Row } from 'antd'
import React from 'react'

export default function QuestionnaireBlockHeader() {
  return (
    <Row type="flex">
      <Button className="ml-auto my-2">
        <i className="fa fa-ellipsis-v" />
      </Button>
    </Row>
  )
}
