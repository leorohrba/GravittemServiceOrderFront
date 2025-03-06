/* eslint-disable no-unneeded-ternary */
import React, { useEffect, useState, useRef } from 'react'
import DefaultTable from '@components/DefaultTable'
import { apiContract } from '@services/api'
import { handleAuthError } from '@utils'
import { Button, Col, DatePicker, Form, message, Row, Select, TimePicker } from 'antd'
import { useNewServiceContext } from '../context/newServiceContext'
import { formatDateInput } from '@utils/components'

const { Option } = Select

export default function SchedulingTab() {
  const [selectedRows, setSelectedRows] = useState([])
  const [key, setKey] = useState(0)

  const { scheduleForm, assistants, setAssistants, technicals, setTechnicals } =
    useNewServiceContext()
  const dateRef = useRef(null)

  useEffect(() => {
    getTechnicals()
  }, [])

  async function getTechnicals() {
    try {
      const {
        data: { technical },
      } = await apiContract.get(`/api/Services/Technical`)
      setTechnicals(technical)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os técnicos')
    }
  }

  const columns = [{ title: 'Colaborador', dataIndex: 'name' }]
  const rowSelection = {
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRowKey)
    },
  }

  function handleAddAssistant() {
    const { technicalId, name, personGuid } = scheduleForm.getFieldValue('auxiliar')?.tech
    if (!assistants.find(x => x.technicalId == technicalId)) {
      const assistant = {
        technicalId,
        name,
        personGuid
      }
      setAssistants([...assistants, assistant])
    }
  }

  function handleDeleteAssistants() {
    const filteredAssistants = assistants.filter(
      assist => !selectedRows.includes(assist.technicalId),
    )
    setAssistants(filteredAssistants)
    setSelectedRows([])
  }

  function handleSelect(option) {
    scheduleForm.setFieldsValue({ auxiliar: option })
  }

  return (
    <Form form={scheduleForm}>
      <Row gutter={16}>
        <Col md={6}>
          <Form.Item
            label="Executor"
            rules={[{ required: true }]}
            name="technicalId"
          >
            <Select allowClear onChange={() => setKey(key + 1)}>
              {technicals.map(tech => (
                <Option value={tech.technicalId} key={tech.technicalId}>
                  {tech.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label="Data de agendamento"
            name="date"
            rules={[{ required: true }]}
            onChange={e =>
              formatDateInput(e.target.value, scheduleForm, 'date', dateRef)
            }
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              ref={dateRef}
            />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item name="durationTime" label="Duração">
            <TimePicker className='w-full' placeholder="HH:MM" format="HH:mm" disabled/>
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item 
            name="scheduleTime" 
            label="Horário"
            rules={[{ required: true }]}
          >
            <TimePicker className='w-full' placeholder="HH:MM" format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>
      {selectedRows.length > 0 ? (
        <Button
          danger
          icon={<i className="fa fa-trash fa-lg mr-3" />}
          onClick={() => handleDeleteAssistants()}
        >
          Excluir
        </Button>
      ) : (
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item name="auxiliar" label="Auxiliar">
              <Select
                labelInValue
                disabled={
                  scheduleForm.getFieldValue('technicalId') === undefined
                    ? true
                    : false
                }
                onSelect={(_, option) => handleSelect(option)}
              >
                {technicals.map(tech => (
                  <Option 
                    value={tech.technicalId} 
                    key={tech.technicalId} 
                    tech={tech} 
                    disabled={tech.technicalId == scheduleForm.getFieldValue('technicalId')}
                  >
                    {tech.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Button
            type="primary"
            className="mt-8"
            onClick={() => handleAddAssistant()}
          >
            Incluir auxiliar
          </Button>
        </Row>
      )}
      <DefaultTable
        className="mt-5"
        dataSource={assistants}
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        rowKey="technicalId"
      />
    </Form>
  )
}
