import { customDateTimeFormat } from '@utils'
import { Avatar, Col, List, Row } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

export default function CommentsModalList({ commentsData }) {
  const data = commentsData.comentarios
    .slice()
    .sort((a, b) => moment(b.data).unix() - moment(a.data).unix())
  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <Row type="flex">
            <Avatar className="mt-2" />
            <Col className="ml-5">
              <span style={{ fontSize: 12 }}>
                <span className="font-bold">{`${item.nomeUsuario} - `}</span>
                <span>
                  {customDateTimeFormat(item.data, 'DD/MM/YYYY HH:mm')}
                </span>
              </span>
              <br />
              <div style={{ width: '26vw' }}>
                <span className="text.lg">{item.texto}</span>
              </div>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  )
}

CommentsModalList.propTypes = {
  commentsData: PropTypes.array,
}
