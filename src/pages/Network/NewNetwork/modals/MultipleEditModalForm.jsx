import { Form } from '@ant-design/compatible'
import { defaultStatus } from '@pages/financial/enums'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

export default function MultipleEditModalForm({
  form,
  setChangeAccess,
  setChangeDocuments,
  setChangeLines,
  setChangeStatus,
  changeAccess,
  changeDocuments,
  changeLines,
  changeStatus,
}) {
  const { getFieldDecorator } = form
  return (
    <Form layout="vertical">
      <Form.Item label="Acesso">
        <Select
          style={{
            width: '100%',
          }}
          defaultValue={changeAccess}
          onChange={e => setChangeAccess(e)}
        >
          <Option value={1}>Manter valor existente</Option>
          <Option value={2}>Substituir valor existente com...</Option>
        </Select>
      </Form.Item>
      {changeAccess === 2 &&
        getFieldDecorator(
          'selectedAccess',
          {},
        )(
          <Select
            autoFocus
            style={{
              width: '100%',
            }}
            placeholder="Selecionar"
          >
            <Option value={1}>Liberado</Option>
            <Option value={2}>Bloqueado</Option>
          </Select>,
        )}

      <Form.Item label="Documentos">
        <Select
          style={{
            width: '100%',
          }}
          defaultValue={changeDocuments}
          onChange={e => setChangeDocuments(e)}
        >
          <Option value={1}>Manter valor existente</Option>
          <Option value={2}>Substituir valor existente com...</Option>
        </Select>
      </Form.Item>
      {changeDocuments === 2 &&
        getFieldDecorator(
          'selectedDocuments',
          {},
        )(
          <Select
            autoFocus
            mode="multiple"
            style={{
              width: '100%',
            }}
            placeholder="Selecionar"
          >
            <Option value={1}>OS standard</Option>
            <Option value={2}>OS eletrodoméstico</Option>
          </Select>,
        )}

      <Form.Item label="Linhas">
        <Select
          style={{
            width: '100%',
          }}
          defaultValue={changeLines}
          onChange={e => setChangeLines(e)}
        >
          <Option value={1}>Manter valor existente</Option>
          <Option value={2}>Substituir valor existente com...</Option>
        </Select>
      </Form.Item>
      {changeLines === 2 &&
        getFieldDecorator(
          'selectedLines',
          {},
        )(
          <Select
            autoFocus
            mode="multiple"
            style={{
              width: '100%',
            }}
            placeholder="Selecionar"
          >
            <Option value={1}>Refrigeração</Option>
            <Option value={2}>Lavanderia</Option>
          </Select>,
        )}

      <Form.Item label="Status">
        <Select
          style={{
            width: '100%',
          }}
          defaultValue={changeStatus}
          onChange={e => setChangeStatus(e)}
        >
          <Option value={1}>Manter valor existente</Option>
          <Option value={2}>Substituir valor existente com...</Option>
        </Select>
      </Form.Item>
      {changeStatus === 2 &&
        getFieldDecorator(
          'selectedStatus',
          {},
        )(
          <Select
            autoFocus
            style={{
              width: '100%',
            }}
            placeholder="Selecionar"
          >
            {defaultStatus.map(s => (
              <Option value={s.id}>{s.name}</Option>
            ))}
          </Select>,
        )}
    </Form>
  )
}

MultipleEditModalForm.propTypes = {
  changeAccess: PropTypes.number,
  changeDocuments: PropTypes.number,
  changeLines: PropTypes.number,
  changeStatus: PropTypes.number,
  form: PropTypes.any,
  setChangeAccess: PropTypes.func,
  setChangeDocuments: PropTypes.func,
  setChangeLines: PropTypes.func,
  setChangeStatus: PropTypes.func,
}
