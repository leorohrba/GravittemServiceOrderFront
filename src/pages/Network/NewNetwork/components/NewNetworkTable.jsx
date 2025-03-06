import DefaultTable from '@components/DefaultTable'
import { defaultStatus } from '@pages/financial/enums'
import { Badge, Button, Dropdown, Menu, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import AccessModal from '../modals/AccessModal'
import CapacityModal from '../modals/CapacityModal'
import DocumentsModal from '../modals/DocumentsModal'
import EditParticipantModal from '../modals/EditParticipantModal'
import ParticipantLinesModal from '../modals/ParticipantLinesModal'
import RegionModal from '../modals/RegionModal'

export default function NewNetworkTable({
  participantsData,
  setParticipantsData,
  rowSelection,
}) {
  const [accessModal, setAccessModal] = useState(false)
  const [documentsModal, setDocumentsModal] = useState(false)
  const [linesModal, setLinesModal] = useState(false)
  const [regionModal, setRegionModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [capacityModal, setCapacityModal] = useState(false)

  const findStatus = idToFind =>
    defaultStatus.find(status => status.id === idToFind)

  const handleEdit = edit => {
    setEditData(edit)
    setEditModal(true)
  }

  const itemMenu = (
    <Menu>
      <Menu.Item onClick={() => setAccessModal(true)}>Acesso</Menu.Item>
      <Menu.Item onClick={() => setDocumentsModal(true)}>Documentos</Menu.Item>
      <Menu.Item onClick={() => setLinesModal(true)}>Linhas</Menu.Item>
      <Menu.Item onClick={() => setRegionModal(true)}>Regiões</Menu.Item>
      <Menu.Item onClick={() => setCapacityModal(true)}>Capacidade</Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: 'Participante',
      key: 'nome',
      dataIndex: 'nome',
    },
    {
      title: 'Data de credenciamento',
      key: 'credenciamento',
      dataIndex: 'credenciamento',
      render: d => d && d.format('DD/MM/YYYY'),
    },
    {
      title: 'Região',
      key: 'regiao',
      dataIndex: 'regiao',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: d => (
        <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <div>
          <Tooltip placement="top" title="Editar">
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              className="iconButton"
              onClick={() => handleEdit(d)}
            >
              <i className="fa fa-pencil fa-lg" />
            </Button>
          </Tooltip>
          <Dropdown overlay={itemMenu}>
            <Button className="iconButton ml-2">
              <i className="fa fa-ellipsis-v" aria-hidden="true" />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ]

  return (
    <React.Fragment>
      <EditParticipantModal
        {...{
          editModal,
          setEditModal,
          participantsData,
          setParticipantsData,
          editData,
        }}
      />
      <AccessModal {...{ accessModal, setAccessModal }} />
      <DocumentsModal
        {...{ documentsModal, setDocumentsModal }}
        type="Participante"
      />
      <ParticipantLinesModal {...{ linesModal, setLinesModal }} />
      <RegionModal {...{ regionModal, setRegionModal }} />
      <CapacityModal {...{ capacityModal, setCapacityModal }} />
      <DefaultTable
        className="mt-5"
        dataSource={participantsData}
        columns={columns}
        rowKey={record => record.id}
        rowSelection={rowSelection}
        locale={{
          emptyText: (
            <span>
              <i
                className="fa fa-exclamation-circle fa-3x m-5"
                aria-hidden="true"
              />
              <h3>
                Não há dados aqui. Para cadastrar clique em
                <b> Adicionar participantes. </b>
              </h3>
            </span>
          ),
        }}
      />
    </React.Fragment>
  )
}

NewNetworkTable.propTypes = {
  participantsData: PropTypes.array,
  setParticipantsData: PropTypes.any,
  rowSelection: PropTypes.any,
}
