import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Dropdown, Menu } from 'antd'
import React from 'react'
import { usePurchaseRequestContext } from '../context/PurchaseRequestContext'
import CancelRequestModal from '../modals/CancelRequestModal'
import NewPurchaseRequestModal from '../modals/NewPurchaseRequestModal'

export default function PurchaseRequestHeader() {
  const {
    selectedRows,
    dropdownVisible,
    setDropdownVisible,
    searchOptions,
    setTags,
    tags,
    startSearch,
    setVisiblePurchaseRequestModal,
    setVisibleQuotationRequestModal,
    setVisibleJustifyModal,
  } = usePurchaseRequestContext()

  function handleCancel() {
    setVisibleJustifyModal(true)
  }

  const pendingItems = selectedRows.filter(d => d.status === 1)
  // eslint-disable-next-line no-unused-vars
  const rejectedItems = selectedRows.filter(d => d.status === 2)
  const quotationItems = selectedRows.filter(d => d.status === 3)
  const requestedItems = selectedRows.filter(d => d.status === 4)
  // eslint-disable-next-line no-unused-vars
  const receivedItems = selectedRows.filter(d => d.status === 5)

  return (
    <div>
      <div className="flex justify-end">
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          startSearch={startSearch}
        />
      </div>
      <NewPurchaseRequestModal />
      <div className="flex my-5">
        {selectedRows.length > 0 ? (
          <React.Fragment>
            {pendingItems.length === selectedRows.length && (
              <Button
                onClick={() => setVisibleQuotationRequestModal(true)}
                style={{ color: '#2e54ea', borderColor: '#2e54ea' }}
                className="mr-3"
              >
                <i className="fa fa-hourglass-half fa-lg mr-3" />
                Solicitar cotação ({selectedRows.length})
              </Button>
            )}
            {quotationItems.length === selectedRows.length && (
              <Button
                style={{ color: '#1dbfbf', borderColor: '#1dbfbf' }}
                className="mr-3"
              >
                <i className="fa fa-paper-plane fa-lg mr-3" />
                Realizar pedido ({selectedRows.length})
              </Button>
            )}
            {requestedItems.length === selectedRows.length && (
              <Button
                style={{ color: 'red', borderColor: 'red' }}
                className="mr-3"
              >
                <i className="fa fa-thumbs-o-down fa-lg mr-3" />
                Rejeitar ({selectedRows.length})
              </Button>
            )}
            {
              <Button
                style={{ color: 'gray', borderColor: 'gray' }}
                onClick={() => CancelRequestModal(handleCancel)}
              >
                <i className="fa fa-ban fa-lg mr-3" />
                Cancelar ({selectedRows.length})
              </Button>
            }
          </React.Fragment>
        ) : (
          <Button
            type="primary"
            onClick={() => setVisiblePurchaseRequestModal(true)}
          >
            Nova solicitação de compra
          </Button>
        )}
        <Dropdown
          className="ml-auto"
          overlay={
            <Menu>
              <Menu.Item key="1">Configurações</Menu.Item>
            </Menu>
          }
          visible={dropdownVisible}
          trigger={['click']}
          onVisibleChange={visible => setDropdownVisible(visible)}
        >
          <Button>
            <i className="fa fa-ellipsis-v fa-lg" aria-hidden="true" />
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}
