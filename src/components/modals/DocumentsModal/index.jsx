import { Button, Modal, Spin, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { DocumentsModalTable } from './DocumentsModalTable'

export default function DocumentsModal({
  documentsModalVisible,
  setDocumentsModalVisible,
  data,
  // OBS: Os parâmetros abaixo são opcionais
  openDocument,
  validDocumentTypesToOpen,
  loading,
  getDocuments,
}) {
  return (
    <Modal
      title="Documentos"
      visible={documentsModalVisible}
      centered
      destroyOnClose
      width="50%"
      onCancel={() => setDocumentsModalVisible(false)}
      footer={
        <Row type="flex"> 
          {getDocuments !== undefined && (
            <Button
              type="secondary"
              onClick={() => getDocuments()}
            >
              <i className="fa fa-repeat mr-2" />Atualizar
            </Button>
          )}  
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => setDocumentsModalVisible(false)}
          >
            Voltar
          </Button>
        </Row>  
      }
    >
      <Spin spinning={loading} size="large">
        <DocumentsModalTable 
          data={data} 
          openDocument={openDocument} 
          validDocumentTypesToOpen={validDocumentTypesToOpen}
        />
      </Spin>  
    </Modal>
  )
}

DocumentsModal.propTypes = {
  documentsModalVisible: PropTypes.bool,
  setDocumentsModalVisible: PropTypes.func,
  data: PropTypes.array,
  openDocument: PropTypes.func,
  validDocumentTypesToOpen: PropTypes.array,
  loading: PropTypes.bool,
  getDocuments: PropTypes.bool,
}
