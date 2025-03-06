import { cleanup, render } from '@testing-library/react'
import { Table } from 'antd'
import React from 'react'

afterEach(cleanup)

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

it('renders table', async () => {
  const { getByRole } = render(<Table />)

  const table = getByRole('table')

  expect(table).toBeInTheDocument()
})

it('renders table data', async () => {
  const { getByText } = render(
    <Table
      columns={[{ title: 'Column 1', dataIndex: 'column' }]}
      dataSource={[{ column: 'Test data' }]}
      rowkey={row => row.column}
    />,
  )
  const data = getByText('Test data')

  expect(data).toBeInTheDocument()
})
