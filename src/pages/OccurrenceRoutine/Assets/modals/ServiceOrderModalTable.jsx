import DefaultTable from '@components/DefaultTable'
import { getLocaleDateFormat } from '@utils'
import { Button } from 'antd'
import PropTypes from 'prop-types'

export default function ServiceOrderModalTable({ data, rowSelection }) {
  const columns = [
    {
      title: 'N° da ordem de serviço',
      key: 'number',
      dataIndex: 'number',
      render: d => (
        <Button type="link" className="px-0">
          {d}
          <i className="fa fa-external-link ml-3" aria-hidden="true" />
        </Button>
      ),
    },
    {
      title: 'Classificação',
      key: 'classification',
      dataIndex: 'classification',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: 'Data',
      key: 'date',
      dataIndex: 'date',
      render: d => d && d.format(getLocaleDateFormat()),
    },
  ]

  return (
    <DefaultTable
      className="mt-5"
      dataSource={data}
      columns={columns}
      rowKey={record => record.key}
      rowSelection={rowSelection}
    />
  )
}

ServiceOrderModalTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
}
