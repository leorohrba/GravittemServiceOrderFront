import React from 'react'
import { Row, Col } from 'antd'

function NoDataResult() {
  return (
    <Row className="w-full" align="middle" type="flex" justify="center">
      <Col className="text-center w-full" style={{ height: '320px' }}>
        <span style={{ color: 'gray' }}>
          Não há dados
        </span>  
      </Col>  
    </Row>
  )
}

export default NoDataResult