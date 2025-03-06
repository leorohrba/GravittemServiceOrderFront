import { Card, Col, Collapse, Divider, Pagination, Row } from 'antd'
import moment from 'moment'
import React from 'react'
import { useNotificationManagementDataContext } from '../context/NotificationManagementData'

const { Panel } = Collapse

export default function NotificationManagementList() {
  const { data, selectedViewType } = useNotificationManagementDataContext()

  const isSentView = selectedViewType === 'sent'
  const pagination = {
    showSizeChanger: true,
    total: data.length,
    locale: {
      items_per_page: '',
    },
    defaultPageSize: 30,
    pageSizeOptions: ['30', '50', '100'],
    defaultCurrent: 1,
    showTotal: (total, range) => `${range[0]} - ${range[1]} de ${total} itens`,
  }

  return (
    <React.Fragment>
      <Collapse className="mt-5">
        {data.map(d => (
          <Panel
            key={d.id}
            header={
              <Row type="flex" gutter={32}>
                <Col span={3}>
                  <span className={!isSentView && !d.lido ? 'font-bold' : ''}>
                    {d.remetente}
                  </span>
                </Col>
                <Col>
                  <i
                    className={`fa fa-${d.icon} fa-lg mr-3`}
                    style={{ color: '#2d73d0' }}
                  />
                  <span className={!isSentView && !d.lido ? 'font-bold' : ''}>
                    {d.assunto}
                  </span>
                </Col>
                <Col className="ml-auto">
                  <i
                    className="fa fa-exclamation-circle fa-lg"
                    style={{
                      color: d.prioridade === 1 ? '#e53935' : '#fb8c00',
                    }}
                  />
                  {isSentView && (
                    <span>
                      <i
                        className="fa fa-check fa-lg ml-3"
                        style={{
                          right: '-11px',
                          position: 'relative',
                          color: d.lido ? '#2d73d0' : 'gray',
                        }}
                      />
                      <i
                        className="fa fa-check fa-lg"
                        style={{
                          color: d.lido ? '#2d73d0' : 'gray',
                        }}
                      />
                    </span>
                  )}
                </Col>
                <Col>
                  <span className={!isSentView && !d.lido ? 'font-bold' : ''}>
                    {moment(d.data).format('DD MMM, LT')}
                  </span>
                </Col>
                <Col>
                  <i
                    className="fa fa-ellipsis-v fa-lg"
                    style={{
                      color: 'gray',
                    }}
                    onClick={event => {
                      event.stopPropagation()
                    }}
                  />
                </Col>
              </Row>
            }
          >
            {d.mensagem}
            {d.documentos && (
              <span>
                <Divider />
                <b>{d.documentos.length} documentos</b>
                <div className="flex mt-3">
                  {d.documentos.map(doc => (
                    <Card key={doc.id} className="mr-2">
                      <i className="fa fa-link fa-lg mr-2" /> <a>{doc.nome}</a>
                    </Card>
                  ))}
                </div>
              </span>
            )}
          </Panel>
        ))}
      </Collapse>
      <Pagination
        {...pagination}
        className="mt-5 ant-table-pagination mini ant-table-pagination-right"
      />
    </React.Fragment>
  )
}
