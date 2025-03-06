import { getLocaleCurrency } from '@utils'
import { Card, Col, Divider, List, Row, Tag } from 'antd'
import update from 'immutability-helper'
import React, { useState } from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { useQuotationAnalysisDetailContext } from '../context/QuotationAnalysisDetailContext'

export default function QuotationAnalysisDetailHeader() {
  const {
    optionsList,
    itemsData,
    setItemsData,
  } = useQuotationAnalysisDetailContext()

  const [selectedCard, setSelectedCard] = useState(0)

  function handleSelectCard(key) {
    setSelectedCard(key)
    let newData = itemsData
    itemsData.map((d, index) => {
      newData = update(newData, {
        [index]: {
          fornecedor: {
            $set: key !== 0 ? key : itemsData[index].melhorValor,
          },
        },
      })
      return true
    })
    setItemsData(newData)
  }

  return (
    <Row type="flex" gutter={12}>
      <Col span={6}>
        <Card
          size="small"
          style={selectedCard === 0 ? { borderColor: '#2d73d0' } : {}}
          className="cursor-pointer mb-2"
          onClick={e => handleSelectCard(0)}
        >
          <div className="flex justify-between">
            <b>Vários fornecedores</b>
            <Tag
              className="my-auto"
              style={{
                color: '#4CAF50',
                border: '1px solid #4CAF50',
              }}
            >
              Melhor opção
            </Tag>
          </div>
          <List.Item>
            <div>Itens</div>
            <div>R$ 34,90</div>
          </List.Item>
          <Divider className="my-0" />
          <List.Item className="py-1">
            <div>Frete</div>
            <div>R$ 6,90</div>
          </List.Item>
          <List.Item className="py-1">
            <div>Condição de pagamento</div>
            <div>Vários</div>
          </List.Item>
          <Divider className="my-0" />
          <List.Item className="justify-end pb-0">
            <b>R$ 41,90</b>
          </List.Item>
        </Card>
      </Col>
      {optionsList.map(o =>
        o.status !== 2 ? (
          <Col span={6}>
            <Card
              size="small"
              style={selectedCard === o.id ? { borderColor: '#2d73d0' } : {}}
              className="cursor-pointer mr-2 mb-2"
              onClick={e => handleSelectCard(o.id)}
            >
              <div className="flex justify-between">
                <b>{o.nome}</b>
              </div>
              <List.Item>
                <div>Itens</div>
                <div>
                  {formatNumber(o.itens || 0, {
                    style: 'currency',
                    currency: getLocaleCurrency(),
                  })}
                </div>
              </List.Item>
              <Divider className="my-0" />
              <List.Item className="py-1">
                <div>Frete</div>
                <div>
                  {formatNumber(o.frete || 0, {
                    style: 'currency',
                    currency: getLocaleCurrency(),
                  })}
                </div>
              </List.Item>
              <List.Item className="py-1">
                <div>Condição de pagamento</div>
                <div>{o.condicaoPagamento}</div>
              </List.Item>
              <Divider className="my-0" />
              <List.Item className="justify-end pb-0">
                <b>
                  {formatNumber(o.itens || 0, {
                    style: 'currency',
                    currency: getLocaleCurrency(),
                  })}
                </b>
              </List.Item>
            </Card>
          </Col>
        ) : (
          <Col span={6}>
            <Card size="small" className="mb-2">
              <div className="flex justify-between">
                <b>{o.nome}</b>
                <i className="fa fa-hourglass-half fa-lg mt-2" />
              </div>
              <div className="my-2">Aguardando cotação</div>
            </Card>
          </Col>
        ),
      )}
    </Row>
  )
}
