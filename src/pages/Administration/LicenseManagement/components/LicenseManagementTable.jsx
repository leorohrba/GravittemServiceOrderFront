import DefaultTable from '@components/DefaultTable'
import HistoryModal from '@components/modals/HistoryModal'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Badge, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useLicenseManagementContext } from '../context/LicenseManagementContext'

export default function LicenseManagementTable() {
  const {
    data,
    setSelectedRows,
    setSelectedRowKeys,
    selectedRowKeys,
  } = useLicenseManagementContext()

  const [history, setHistory] = useState([])
  const [historyModalVisible, setHistoryModalVisible] = useState(false)

  const columns = [
    {
      title: 'Nome',
      render: d => (
        <span>
          <p className="mb-0">{d.nome}</p>
          {!!d.documento && (
            <SmallTableFieldDescription
              label={d.documento}
              fontStyle="italic"
              color="gray"
            />
          )}
        </span>
      ),
    },
    {
      title: 'Módulo',
      dataIndex: 'modulo',
    },
    {
      title: 'Licenças',
      dataIndex: 'licencas',
    },
    {
      title: 'Número de série',
      dataIndex: 'numeroSerie',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: d => (
        <Badge
          style={{ color: d === 'ativo' ? 'green' : 'red' }}
          color={d === 'ativo' ? 'green' : 'red'}
          text={d === 'ativo' ? 'Ativo' : 'Inativo'}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title="Histórico">
          <span>
            <HistoryModal
              entityId={d.id}
              hideLabel
              buttonClassName="iconButton"
              {...{
                history,
                historyModalVisible,
                setHistoryModalVisible,
                setHistory,
              }}
            />
          </span>
        </Tooltip>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey, selectedRow) => {
      setSelectedRows(selectedRow)
      setSelectedRowKeys(selectedRowKey)
    },
  }
  return (
    <DefaultTable
      className="mt-5"
      dataSource={data}
      columns={columns}
      rowKey={record => record.id}
      rowSelection={rowSelection}
    />
  )
}
