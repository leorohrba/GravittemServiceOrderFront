import AttachmentsModal from '@components/modals/AttachmentsModal'
import CommentsModal from '@components/modals/CommentsModal'
import DocumentsModal from '@components/modals/DocumentsModal'
import Button from '@components/Button'
import { Divider, Row, Col, Modal } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import NewAttendanceModalAssets from '../../modals/NewAttendanceModalAssets'
import NewAttendanceModal from '../../modals/NewAttendanceModal'

export default function EditAttendanceHeader(props) {
  
  const {attendanceId, 
         attendanceNumber, 
         loading, 
         isSaving, 
         canBeUpdated,
         form, 
         setSelectedAssets, 
         assets, 
         selectedAssets, 
         requesterSource, 
         setRequesterSource,         
         userPermissions, 
         createLinkedAttendance,     
         documents,
         getDocuments,
         loadingDocuments,
         returnAttendances,
         handleChangeRequesterFromAssets,
         onChangeAssets,
        } = props
        
  const title = (isSavingForm) => ( isSavingForm ? 'Salvando...' : 'Carregando...')
  const [newAttendanceModal, setNewAttendanceModal] = useState(false)
  const [keyModalAttendance, setKeyModalAttendance] = useState(0)
  const [assetsModalVisible, setAssetsModalVisible] = useState(false)
  const [documentId, setDocumentId] = useState(null)
  const [documentsModalVisible, setDocumentsModalVisible] = useState(false)
  const [attachments, setAttachments] = useState([])
  // const [history, setHistory] = useState([])
  const [commentsData, setCommentsData] = useState({
      nomeUsuario: '',
      comentarios: [],
    })  
  
  const openAssets = () => {
    setAssetsModalVisible(true)
  }
  
  const openDocuments = () => {
    setDocumentsModalVisible(true)
  }
  
  const openDocument = (type, id) => {
    if (type === 1) {
      setDocumentId(id)
      setNewAttendanceModal(true)
      setKeyModalAttendance(keyModalAttendance + 1)
    }
  }
  return (
    <React.Fragment>

      <Row type="flex" className="mb-4">
        <Col>
          <span
            style={{
              color: '#1976D2',
              cursor: 'pointer',
            }}
            onClick={() => returnAttendances()}
            role="button"
          >
            Atendimentos
          </span>
          <i className="mx-3 fa fa-angle-right" />
          {loading ? title(isSaving) : 
             (!attendanceId || createLinkedAttendance) ? 
               'Novo atendimento' :
               (<span>{`${canBeUpdated ? 'Editar' : 'Consultar'} atendimento`}</span>) 
          }
        </Col>
      </Row> 

      <div className="flex">
        <h2>
          {loading && !isSaving ? 
             'Carregando atendimento...' :
             createLinkedAttendance ? 
             `Criar atendimento vinculado a ${!attendanceNumber ? '...' : attendanceNumber}` : 
             `Atendimento ${attendanceNumber}`
          }
        </h2>
        <div className="ml-auto">

          {attendanceId && !createLinkedAttendance && (
            <Button
              className="iconButton"
              loading={loadingDocuments}
              disabled={!attendanceId || createLinkedAttendance}
              onClick={() => openDocuments()}
              quantity={documents.length}
            >
              <i className="fa fa-files-o fa-lg mr-3" />
              Documentos
            </Button>
          )}
          
          <Button quantity={selectedAssets.length} onClick={() => openAssets()} className="ml-2 iconButton">
            <i className="fa fa-archive fa-lg mr-3" />
            Ativos
          </Button>

          {attendanceId && !createLinkedAttendance && (
            <React.Fragment> 
              <CommentsModal
                buttonClassName="ml-2"
                entityId={attendanceId}
                {...{
                  commentsData,
                  setCommentsData,
                }}
              />

              <AttachmentsModal
                buttonClassName="ml-2"
                entityId={attendanceId}
                {...{
                  attachments,
                  setAttachments,
                }}
              />

              {/*
              <HistoryModal
                buttonClassName="ml-2"
                entityId={attendanceId}
                {...{
                  history,
                  setHistory,
                }}
              />
              */}

            </React.Fragment>
          )}
         
          <Button disabled className="ml-2 iconButton">
            <i className="fa fa-ellipsis-v fa-lg" />
          </Button>
          
        </div>
      </div>
      <Divider className="mt-2" />
      
      <NewAttendanceModal
        newAttendanceModal={newAttendanceModal}
        setNewAttendanceModal={setNewAttendanceModal}
        attendanceId={documentId}
        key={keyModalAttendance}
        userPermissions={userPermissions}
        refreshData={() => getDocuments()}
      />
      
      <DocumentsModal
        documentsModalVisible={documentsModalVisible}
        setDocumentsModalVisible={setDocumentsModalVisible}
        data={documents}
        openDocument={openDocument}
        loading={loadingDocuments}
        validDocumentTypesToOpen={[1]}
        getDocuments={getDocuments}
      />
     
      <Modal
        title="Ativos"
        width={780}
        visible={assetsModalVisible}
        centered
        onCancel={() => setAssetsModalVisible(false)}
        footer={
          <Row type="flex">
            <Col className="ml-auto">
              <Button
                type="secondary"
                onClick={() => setAssetsModalVisible(false)}
              >
                Fechar
              </Button>
            </Col>
          </Row>
        }
      >
        <NewAttendanceModalAssets
          assets={assets}
          form={form}
          setSelectedAssets={setSelectedAssets}
          selectedAssets={selectedAssets}
          canBeUpdated={canBeUpdated}
          requesterSource={requesterSource}
          setRequesterSource={setRequesterSource}
          userPermissions={userPermissions}
          handleChangeRequesterFromAssets={handleChangeRequesterFromAssets}
          onChange={onChangeAssets}
        />
      </Modal>      
    </React.Fragment>
  )
}

EditAttendanceHeader.propTypes = {
  attendanceId: PropTypes.number,
  attendanceNumber: PropTypes.string,
  loading: PropTypes.bool,
  isSaving: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
  form: PropTypes.any,
  rowSelection: PropTypes.any,
  keyTableAsset: PropTypes.number,
  assets: PropTypes.array,
  selectedAssets: PropTypes.array,
  requesterSource: PropTypes.array,
  setAssets: PropTypes.func,
  userPermissions: PropTypes.array,
  createLinkedAttendance: PropTypes.array,
  documents: PropTypes.array,
  getDocuments: PropTypes.array,
  loadingDocuments: PropTypes.bool,
  returnAttendances: PropTypes.func,
}
