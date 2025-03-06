import { Button, Col, Dropdown, Form, Menu, Row, Select } from 'antd'
import React from 'react'
import { useNewServiceOrderContext } from '../context/NewServiceOrderContext'

const { Option } = Select

export default function ServicesBlockTableHeader({
  selectedRows,
  setSelectedService,
}) {
  const {
    services,
    servicesTableData,
    setServicesTableData,
    setVisibleServiceModal,
  } = useNewServiceOrderContext()
  const useStatus = selectedRows.filter(s => s.status === 1)
  const cancelStatus = selectedRows.filter(s => s.status === 2)

  const extraMenu = (
    <Menu onClick={handleMenu}>
      <Menu.Item key={1}>Ocultar serviços cancelados</Menu.Item>
      <Menu.Item key={2}>Configurações</Menu.Item>
    </Menu>
  )

  function handleMenu(e) {
    if (e.key === '1') {
      setServicesTableData(servicesTableData.filter(s => s.status !== 6))
    }
  }

  function handleService(e) {
    setSelectedService(e)
    setVisibleServiceModal(true)
  }

  return (
    <Row type="flex">
      {selectedRows.length === 0 ? (
        <Col span={6}>
          <Form.Item label="Serviço">
            <Select
              suffixIcon={<i className="fa fa-search" />}
              showSearch
              onSelect={e => handleService(e)}
            >
              {services.map(s => (
                <Option value={s.id}>{`${s.codigo} ${s.servico}`}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      ) : (
        <div className="mb-8 mt-2">
          {useStatus.length === selectedRows.length && (
            <React.Fragment>
              <Button
                style={{
                  color: '#57b600',
                  borderColor: '#57b600',
                }}
                className="mr-2"
              >
                <i className="fa fa-thumbs-o-up fa-lg mr-3" />
                Incluir no orçamento
              </Button>
              <Button
                style={{
                  color: 'red',
                  borderColor: 'red',
                }}
                className="mr-2"
              >
                <i className="fa fa-thumbs-o-down fa-lg mr-3" />
                Remover do orçamento
              </Button>
              <Button
                style={{
                  color: 'gray',
                  borderColor: 'gray',
                }}
                className="mr-2"
              >
                <i className="fa fa-ban fa-lg mr-3" />
                Cancelar
              </Button>
            </React.Fragment>
          )}
          {cancelStatus.length === selectedRows.length && (
            <Button
              style={{
                color: 'red',
                borderColor: 'red',
              }}
            >
              <i className="fa fa-trash fa-lg mr-3" />
              Excluir
            </Button>
          )}
        </div>
      )}
      <Dropdown overlay={extraMenu}>
        <Button className="ml-auto my-2">
          <i className="fa fa-ellipsis-v" />
        </Button>
      </Dropdown>
    </Row>
  )
}
