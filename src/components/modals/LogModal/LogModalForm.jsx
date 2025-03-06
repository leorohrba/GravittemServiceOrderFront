import React from 'react'
import { DatePicker, Button } from 'antd'
import { Form } from '@ant-design/compatible'

export default function LogModalForm({
  initialDate,
  setInitialDate,
  endDate,
  setEndDate,
  getData,
}) {
  return (
    <React.Fragment>
      <Form layout="vertical">
        <Form.Item label="Data inicial" required>
          <DatePicker
            className="mr-3"
            onSelect={value => setInitialDate(value)}
            value={initialDate}
            format="DD/MM/YYYY"
          />
        </Form.Item>
        <Form.Item label="Data final">
          <DatePicker
            className="mr-3"
            value={endDate}
            onSelect={value => setEndDate(value)}
            format="DD/MM/YYYY"
          />
        </Form.Item>
        <Button
          disabled={!initialDate}
          onClick={() => getData()}
          type="primary"
        >
          Buscar
        </Button>
      </Form>
    </React.Fragment>
  )
}
