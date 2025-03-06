import DefaultTable from '@components/DefaultTable'
import { customSort } from '@utils'
import { Badge } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'

export function DocumentsModalTable({ data, openDocument, validDocumentTypesToOpen }) {
  const columns = [
    {
      title: 'Número',
      dataIndex: 'numero',
      width: 200,
      sorter: (a, b) => customSort(a.numeroOrdenacao ? a.numeroOrdenacao : a.numero, b.numeroOrdenacao ? b.numeroOrdenacao : b.numero),
      render: (text, record) => (
                <React.Fragment>
                  {openDocument === undefined ||
                   (validDocumentTypesToOpen && !validDocumentTypesToOpen.includes(record.tipoDocumento))
                  ?
                    (
                       <span>{record.numero}</span>
                     ):
                     (
                       <span
                         onClick={() => openDocument(record.tipoDocumento, record.idDocumento)}
                         className="primary-color"
                         role="button"
                         style={{ cursor: 'pointer' }}
                       >                       
                        {record.numero}
                       </span>
                     )
                  }                        
                </React.Fragment>
      ),      
    },
    {
      title: 'Tipo',
      dataIndex: 'descricaoTipoDocumento',
      width: 400,
      sorter: (a, b) => customSort(a.descricaoTipoDocumento, b.descricaoTipoDocumento),
    },
    {
      title: 'Registro',
      dataIndex: 'dataRegistro',
      width: 400,
      sorter: (a, b) => customSort(a.dataRegistro, b.dataRegistro),
      render: (text, record) => record.dataRegistro ? moment(record.dataRegistro).format('DD/MM/YYYY HH:mm') : '',
    },
    {
      title: 'Status',
      dataIndex: 'descricaoStatus',
      sorter: (a, b) => customSort(a.descricaoStatus, b.descricaoStatus),
      render: (text, record) => (
        <span>
          {record.corStatus ? (
            <Badge
              color={record.corStatus}
              text={record.descricaoStatus}
            />
          ) : (
          <span>{record.descricaoStatus}</span>
          )}     
        </span>  
      ),
    },
  ]
  return (
    <DefaultTable
      bordered
      dataSource={data}
      rowKey={row => row.idDocumento}
      columns={columns}
    />
  )
}

DocumentsModalTable.propTypes = {
  data: PropTypes.array,
  validDocumentTypesToOpen: PropTypes.array,
  openDocument: PropTypes.func,
}
