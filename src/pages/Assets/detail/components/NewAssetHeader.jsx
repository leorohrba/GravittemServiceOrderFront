import AttachmentsModal from '@components/modals/AttachmentsModal'
import CommentsModal from '@components/modals/CommentsModal'
import HistoryModal from '@components/modals/HistoryModal'
import { apiAttendance } from '@services/api'
import { Button, Col, Divider, Dropdown, Menu, Row } from 'antd'
import React, { useState } from 'react'
import router from 'umi/router'
import { useNewAssetContext } from '../context/NewAssetContext'
import AdditionalWarrantyModal from '../modals/AdditionalWarrantyModal'
import AssetAddressModal from '../modals/AssetAddressModal'
import ComplementaryDataModal from '../modals/ComplementaryDataModal'
import InstallerModal from '../modals/InstallerModal'
import LinkAssetsModal from '../modals/LinkAssetsModal'
import PostageModal from '../modals/PostageModal'
import ResellerModal from '../modals/ResellerModal'
import ServiceOrderModal from '../modals/ServiceOrderModal'

export default function NewAssetHeader() {
  const {
    assetId,
    canBeUpdated,
    isSaving,
    loading,
    setVisibleAssetAddressModal,
    setVisibleServiceOrderModal,
    setVisibleLinkAssetModal,
    setVisibleAdditionalWarrantyModal,
    setVisiblePostageModal,
  } = useNewAssetContext()

  const title = isSavingForm => (isSavingForm ? 'Salvando...' : 'Carregando...')

  const [history, setHistory] = useState([])
  const [historyModalVisible, setHistoryModalVisible] = useState(false)

  const [attachments, setAttachments] = useState([])
  const [commentsData, setCommentsData] = useState({
    nomeUsuario: '',
    comentarios: [],
  })

  const menu = (
    <Menu>
      <HistoryModal
        showLabel
        entityId={assetId}
        api={apiAttendance}
        {...{
          history,
          historyModalVisible,
          setHistoryModalVisible,
          setHistory,
        }}
      />
      <Menu.Item key={2} onClick={() => setVisibleServiceOrderModal(true)}>
        Ordens de serviço
      </Menu.Item>
      <Menu.Item key={3} onClick={() => setVisibleLinkAssetModal(true)}>
        Ativos vinculados
      </Menu.Item>
      <Menu.Item key={4} onClick={() => setVisibleAssetAddressModal(true)}>
        Endereço do ativo
      </Menu.Item>
      <Menu.Item
        key={5}
        onClick={() => setVisibleAdditionalWarrantyModal(true)}
      >
        Garantia adicional
      </Menu.Item>
      <Menu.Item key={6} onClick={() => setVisiblePostageModal(true)}>
        Postagem
      </Menu.Item>
    </Menu>
  )

  return (
    <React.Fragment>
      <ServiceOrderModal />
      <LinkAssetsModal />
      <AssetAddressModal />
      <AdditionalWarrantyModal />
      <PostageModal />
      <ComplementaryDataModal />
      <ResellerModal />
      <InstallerModal />
      <Row type="flex" className="mb-4">
        <Col>
          <span
            style={{
              color: '#1976D2',
              cursor: 'pointer',
            }}
            onClick={() => router.goBack()}
            role="button"
          >
            Ativos
          </span>
          <i className="mx-3 fa fa-angle-right" />
          {loading ? (
            title(isSaving)
          ) : assetId ? (
            <span>{`${canBeUpdated ? 'Editar' : 'Consultar'} ativo`}</span>
          ) : (
            'Novo ativo'
          )}
        </Col>
      </Row>
      <Row type="flex" justify="end">
        <CommentsModal
          buttonClassName="mr-2"
          entityId={assetId}
          {...{
            commentsData,
            setCommentsData,
          }}
        />

        <AttachmentsModal
          buttonClassName="mr-2"
          entityId={assetId}
          {...{
            attachments,
            setAttachments,
          }}
        />

        <Dropdown overlay={menu}>
          <Button className="iconButton">
            <i className="fa fa-ellipsis-v fa-lg" />
          </Button>
        </Dropdown>
      </Row>
      <Divider className="my-2" />
    </React.Fragment>
  )
}
