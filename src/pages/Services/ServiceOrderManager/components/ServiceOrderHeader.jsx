import Button from '@components/Button'
import NewSimpleSearch from '@components/NewSimpleSearch'
import { Dropdown, Menu } from 'antd'
import React from 'react'
import { router } from 'umi'
import { useServiceOrderContext } from '../context/ServiceOrderContext'

function ServiceOrderHeader() {
  const {
    searchOptions,
    setTags,
    tags,
    startSearch,
    selectedRows,
  } = useServiceOrderContext()

  const menu = (
    <Menu onClick={handleMenu}>
      <Menu.Item key="1">Padrão</Menu.Item>
      <Menu.Item key="2">Whirlpool</Menu.Item>
      <Menu.Item key="3">Importar</Menu.Item>
    </Menu>
  )

  const extraMenu = (
    <Menu>
      <Menu.Item key="1">Histórico de importações</Menu.Item>
      <Menu.Item key="2">Configurações</Menu.Item>
    </Menu>
  )

  const printMenu = (
    <Menu>
      <Menu.Item key="1">Ordem de serviço padrão</Menu.Item>
      <Menu.Item key="2">Orçamento</Menu.Item>
      <Menu.Item key="3">Histórico de ordem de serviço</Menu.Item>
    </Menu>
  )

  const inProcessSO = selectedRows.every(x => x.status === 3)

  function handleMenu(e) {
    if (e.key === '1') {
      router.push('/Services/ServiceOrderManager/Detail/Default')
    }
  }

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
      <div className="flex my-5">
        {selectedRows.length === 0 ? (
          <Dropdown overlay={menu}>
            <Button type="primary" className="mr-1">
              Nova ordem de serviço
              <i className="fa fa-chevron-down ml-2" />
            </Button>
          </Dropdown>
        ) : (
          <React.Fragment>
            {inProcessSO ? (
              <React.Fragment>
                <Button
                  className="mr-3"
                  buttonColor="#2d73d0"
                  faIcon="calendar-o"
                >
                  Agendar
                </Button>
                <Button className="mr-3" buttonColor="#43a047" faIcon="check">
                  Concluir
                </Button>
                <Button className="mr-3" buttonColor="#e53935" faIcon="ban">
                  Cancelar
                </Button>
              </React.Fragment>
            ) : (
              <Button className="mr-3" buttonColor="#2d73d0" faIcon="retweet">
                Reabrir
              </Button>
            )}
          </React.Fragment>
        )}
        {selectedRows.length > 0 && (
          <Dropdown overlay={printMenu} className="ml-auto">
            <Button>
              Imprimir
              <i className="fa fa-chevron-down ml-2" />
            </Button>
          </Dropdown>
        )}
        <Button className={selectedRows.length > 0 ? 'ml-2' : 'ml-auto'}>
          <i className="fa fa-download fa-lg mr-3" />
          Exportar
        </Button>
        <Dropdown className="ml-2" overlay={extraMenu}>
          <Button>
            <i className="fa fa-ellipsis-v fa-lg" aria-hidden="true" />
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default ServiceOrderHeader
