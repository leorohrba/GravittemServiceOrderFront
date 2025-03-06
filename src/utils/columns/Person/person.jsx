import React from 'react'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { customSort, formatCellPhone, formatPhone } from '@utils'
import { Badge, Button, Popover, Tooltip } from 'antd'
import { getAddress, getRegion, getStatusRender } from '@pages/Person/functions'
import { formatMessage } from 'umi-plugin-react/locale'

export const personColumns = (
  type,
  documentoRepetido,
  setDocumentoRepetido,
  getDocumentoRepetido,
  popoverVisible,
  setPopoverVisible,
  handleContactModal,
) => [
  {
    title: 'Nome',
    nomeColuna: 'Nome',
    key: 'name',
    obrigatorio: true,
    sorter: (a, b) => customSort(a.nome, b.nome),
    render: d => (
      <span className="flex">
        <div className="table-icon mr-3">
          <i
            className={`fa fa-${
              d.tipoPessoa === 1 ? 'user' : 'industry'
            } fa-lg fa-fw`}
            aria-hidden="true"
          />
        </div>
        <p className="my-auto">{d.nome}</p>
      </span>
    ),
  },
  {
    title: 'Endereço',
    nomeColuna: 'Endereço',
    key: 'address',
    obrigatorio: true,
    render: d => (
      <span>
        <p className="mb-0">{getAddress(d.endereco)}</p>
        <SmallTableFieldDescription
          label={getRegion(d.endereco)}
          fontStyle="italic"
          color="gray"
        />
      </span>
    ),
  },
  {
    title: 'Contato',
    nomeColuna: 'Contato',
    key: 'contact',
    obrigatorio: true,
    render: d => (
      <span>
        {d.contato?.fone && (
          <p className="mb-0">{formatPhone(d.contato.fone)}</p>
        )}
        {d.contato?.celular && (
          <p className="mb-0">{formatCellPhone(d.contato.celular)}</p>
        )}
        <SmallTableFieldDescription
          label={d.contato.email}
          fontStyle="italic"
          color="gray"
        />
      </span>
    ),
  },
  {
    title: formatMessage({
      id: 'person.index.status',
    }),
    nomeColuna: 'Status',
    obrigatorio: true,
    key: 'status',
    width: 150,
    sorter: (a, b) => customSort(a.statusDescricao, b.statusDescricao),
    render: d => getStatusRender(d, null, null, type),
  },
  {
    title: '',
    nomeColuna: 'Icones',
    obrigatorio: false,
    key: 'icons',
    width: 60,
    render: d => (
      <div>
        {d.status === 3 && (
          <Tooltip placement="top" title={<div>Cadastro bloqueado</div>}>
            <i className="fa fa-lock fa-lg mr-3" style={{ color: '#f5222d' }} />
          </Tooltip>
        )}
        {d.documentoQuantidade > 1 && (
          <Tooltip
            placement="top"
            zIndex="1020"
            title={
              <div>
                {d.documentoQuantidade - 1} registro(s) encontrado(s) com esse
                documento.
                <Popover
                  visible={
                    documentoRepetido?.documento === d.documentoUnico &&
                    popoverVisible
                  }
                  onVisibleChange={visible => {
                    !visible && setDocumentoRepetido(null)
                    setPopoverVisible(visible)
                  }}
                  content={
                    <div className="mr-4 mt-2">
                      <ul>
                        {documentoRepetido?.pessoas &&
                          documentoRepetido.pessoas.map(d => <li>{d.nome}</li>)}
                      </ul>
                    </div>
                  }
                >
                  <Button onClick={() => getDocumentoRepetido(d)} type="link">
                    Clique aqui para ver detalhes.
                  </Button>
                </Popover>
              </div>
            }
          >
            <Badge
              count={d.documentoQuantidade - 1}
              style={{
                backgroundColor: '#f56a00',
              }}
            />
          </Tooltip>
        )}
      </div>
    ),
  },
  type === 'clienteCrm'
    ? {
        title: 'Responsável',
        nomeColuna: 'Responsável',
        obrigatorio: false,
        sorter: (a, b) => customSort(a.responsavelNome, b.responsavelNome),
        render: d => d.responsavelNome,
      }
    : {
        nomeColuna: 'Responsável',
        dataIndex: 'hide',
      },
  {
    title: '',
    nomeColuna: 'Contatos',
    key: 'action',
    width: 0,
    align: 'right',
    obrigatorio: false,
    render: d => (
      <React.Fragment>
        <Tooltip placement="top" title="Contato">
          <Button
            shape="circle"
            size="default"
            type="primary"
            ghost
            className="iconButton mr-1"
            onClick={() => handleContactModal(d)}
          >
            <i className="fa fa-address-book-o fa-lg" />
          </Button>
        </Tooltip>
      </React.Fragment>
    ),
  },
]
