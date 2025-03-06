import AttachmentsModal from '@components/modals/AttachmentsModal'
import CommentsModal from '@components/modals/CommentsModal'
import { Button, Col, Divider, Dropdown, Form, Input, Menu } from 'antd'
import React, { useState } from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'
import ResponsibleModal from '../modals/ResponsibleModal'

export default function NewServiceOrderHeader() {
  const {
    responsible,
    setVisibleResponsibleModal,
  } = useNewServiceOrderContext()

  const [attachments, setAttachments] = useState([])
  const [commentsData, setCommentsData] = useState({
    nomeUsuario: '',
    comentarios: [],
  })

  const printMenu = (
    <Menu>
      <Menu.Item key="1">Ordem de serviço padrão</Menu.Item>
      <Menu.Item key="2">Orçamento</Menu.Item>
      <Menu.Item key="3">Histórico de ordem de serviço</Menu.Item>
    </Menu>
  )

  return (
    <div>
      <ResponsibleModal />
      <div className="flex">
        <Col className="ml-auto">
          <Dropdown overlay={printMenu} className="mr-2">
            <Button>
              Imprimir
              <i className="fa fa-chevron-down ml-2" />
            </Button>
          </Dropdown>
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
      <Form layout="vertical">
        <Col span={10}>
          <Form.Item
            label="Responsável"
            extra={
              responsible && `${responsible.endereco}  ${responsible.telefone}`
            }
          >
            <Input
              defaultValue={responsible && responsible.nome}
              addonAfter={
                <i
                  className="fa fa-pencil fa-lg cursor-pointer"
                  onClick={() => setVisibleResponsibleModal(true)}
                />
              }
            />
          </Form.Item>
        </Col>
      </Form>
    </div>
  )
}
