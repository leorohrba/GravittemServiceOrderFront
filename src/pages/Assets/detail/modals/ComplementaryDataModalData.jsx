import { Checkbox, Col, Form, Input, Row, Select } from 'antd'
import React from 'react'

export default function ComplementaryDataModalData() {
  return (
    <Form layout="vertical">
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Fabricante" name="fabricante">
            <Select
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              suffixIcon={<i className="fa fa-search" />}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Modelo" name="modelo">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Marca" name="marca">
            <Select
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              suffixIcon={<i className="fa fa-search" />}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Cor" name="cor">
            <Select
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              suffixIcon={<i className="fa fa-search" />}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Linha" name="linha">
            <Select
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              suffixIcon={<i className="fa fa-search" />}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Capacidade" name="capacidade">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Voltagem">
            <Select
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              suffixIcon={<i className="fa fa-search" />}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Código de barras" name="codigoBarras">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Código GTIN" name="codigoGTIN">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={16}>
        <Col span={8}>
          <Form.Item label="Versão de engenharia" name="versaoEngenharia">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Quantidade mínima em estoque"
            name="quantidadeMinimaEstoque"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Tempo de garantia (meses)" name="tempoGarantia">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex">
        <Col span={8}>
          <Form.Item label="Aplicabilidade" name="aplicabilidade">
            <Select />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item noStyle>
        <Checkbox.Group className="mt-3">
          <Checkbox value="devolucaoObrigatoria">
            Devolução obrigatória
          </Checkbox>
          <Checkbox value="produtoInstalavel">Produto instalável</Checkbox>
          <Checkbox value="sugerirCompra">Sugerir compra</Checkbox>
          <Checkbox value="exclusivoBalcao">
            Exclusivo atendimento balcão
          </Checkbox>
          <Checkbox value="permiteFracionada">
            Permite quantidade fracionada
          </Checkbox>
        </Checkbox.Group>
      </Form.Item>
    </Form>
  )
}
