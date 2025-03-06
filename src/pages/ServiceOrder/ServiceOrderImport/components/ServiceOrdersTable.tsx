import DefaultTable from '@components/DefaultTable'
import AttachmentsModalConfig from '@components/modals/AttachmentsModal'
import { isObjEmpty } from '@utils'
import React from 'react'
import { IServiceOrdersTableProps } from '../interfaces/IServiceOrdersTableProps'
import { useServiceOrderContext } from '../context/ServiceOrderContext'
import { ITableData } from '../interfaces/ITableData'
import { serviceOrderImportColumns } from '../utils'
import DetailModal from '../modals/DetailModal'

const ServiceOrdersTable: React.FC<IServiceOrdersTableProps> = () => {
  const {
    tableData,
    viewDetailModal,
    setViewDetailModal,
    viewAttachmentModal,
    setViewAttachmentModal,
    viewModalObject,
    setViewModalObject,
    screenType,
  } = useServiceOrderContext()

  const handleDownloadClick = (logObject: ITableData) => {
    setViewAttachmentModal(true)
    setViewModalObject(logObject)
  }

  const handleDetailClick = (logObject: ITableData) => {
    setViewDetailModal(true)
    setViewModalObject(logObject)
  }

  const columns = serviceOrderImportColumns(
    handleDownloadClick,
    handleDetailClick,
    screenType,
  )

  return (
    <div>
      <DefaultTable
        dataSource={!isObjEmpty(tableData) ? tableData : []}
        columns={columns}
      />
      {viewAttachmentModal && (
        <AttachmentsModalConfig
          entityId={viewModalObject.logInicializacaoId}
          hideModal={false}
          openModal={viewAttachmentModal}
          setOpenModal={setViewAttachmentModal}
          buttonClassName="invisible"
          canEdit={false}
        />
      )}
      {viewDetailModal && <DetailModal logObject={viewModalObject} />}
    </div>
  )
}

export default ServiceOrdersTable
