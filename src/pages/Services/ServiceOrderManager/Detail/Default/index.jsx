import { soStatus } from '@pages/Services/enums'
import { getLocaleCurrency } from '@utils'
import { Collapse } from 'antd'
import React, { useState } from 'react'
import { router } from 'umi'
import { formatNumber } from 'umi-plugin-react/locale'
import { withWrapper } from 'with-wrapper'
import AssetBlock from '../components/AssetBlock'
import BudgetBlock from '../components/BudgetBlock'
import ClientBlock from '../components/ClientBlock'
import ContractBlock from '../components/ContractBlock'
import ItemsBlock from '../components/ItemsBlock'
import NewServiceOrderFooter from '../components/NewServiceOrderFooter'
import NewServiceOrderHeader from '../components/NewServiceOrderHeader'
import QuestionnaireBlock from '../components/QuestionnaireBlock'
import SchedulingBlock from '../components/SchedulingBlock'
import ServiceOrderBlock from '../components/ServiceOrderBlock'
import ServicesBlock from '../components/ServicesBlock'
import WarrantyBlock from '../components/WarrantyBlock'
import {
  NewServiceOrderProvider,
  useNewServiceOrderContext,
} from '../context/NewServiceOrderContext'
import EditAssetModal from '../modals/EditAssetModal'
import SearchAssetModal from '../modals/SearchAssetModal'

const { Panel } = Collapse

export function DefaultServiceOrder() {
  const {
    showServiceOrderBlock,
    showClientBlock,
    showAssetBlock,
    showSchedulingBlock,
    showServicesBlock,
    showItemsBlock,
    serviceOrderResume,
    clientTableData,
    assetTableData,
    schedulingTableData,
    itemsTableData,
    showWarrantyBlock,
    showContractBlock,
    showBudgetBlock,
    showQuestionnaireBlock,
  } = useNewServiceOrderContext()

  const findStatus = idToFind => soStatus.find(status => status.id === idToFind)

  const [activeKeys, setActiveKeys] = useState(['14'])

  return (
    <div>
      <div className="mb-4">
        <a onClick={() => router.goBack()}>Ordem de serviço</a>
        <span>{' > Nova ordem de serviço Padrão'}</span>
      </div>
      <NewServiceOrderHeader />
      <EditAssetModal />
      <SearchAssetModal />
      <Collapse
        defaultActiveKey="2"
        bordered={false}
        activeKey={activeKeys}
        onChange={e => setActiveKeys(e)}
        expandIcon={({ isActive }) =>
          isActive ? (
            <React.Fragment>
              <i
                className="fa fa-minus-square-o"
                style={{
                  position: 'absolute',
                  color: 'gray',
                  left: '20px',
                  top: '12px',
                  fontSize: '24px',
                }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <i
                className="fa fa-plus-square-o"
                style={{
                  position: 'absolute',
                  color: 'gray',
                  left: '20px',
                  top: '12px',
                  fontSize: '24px',
                }}
              />
            </React.Fragment>
          )
        }
      >
        {showServiceOrderBlock && (
          <Panel
            key="1"
            header={
              <h3 className="ml-3 flex">
                Ordem de serviço #{serviceOrderResume.numero}
                {!activeKeys.some(k => k === '1') && (
                  <React.Fragment>
                    <div className="mx-2 font-normal">
                      <i
                        className={`fa fa-${
                          findStatus(serviceOrderResume.status).icon
                        } mr-2`}
                        style={{
                          color: findStatus(serviceOrderResume.status).color,
                        }}
                      />
                      {findStatus(serviceOrderResume.status).name}
                    </div>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-exclamation-circle mr-2"
                        style={{ color: '#f5222d' }}
                      />
                      Prioridade {serviceOrderResume.prioridade}
                    </div>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-calendar mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {serviceOrderResume.data.format('DD/MM/YYYY')}
                    </div>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-flag mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {serviceOrderResume.idade}
                    </div>
                  </React.Fragment>
                )}
              </h3>
            }
          >
            <ServiceOrderBlock />
          </Panel>
        )}
        {showClientBlock && (
          <Panel
            key="2"
            header={
              <h3 className="ml-3 flex">
                Cliente
                {!activeKeys.some(k => k === '2') && (
                  <React.Fragment>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-user mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {clientTableData[0]?.nome}
                    </div>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-phone mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {clientTableData[0]?.telefone}
                    </div>
                  </React.Fragment>
                )}
              </h3>
            }
          >
            <ClientBlock />
          </Panel>
        )}
        {showAssetBlock && (
          <Panel
            key="3"
            header={
              <h3 className="ml-3 flex">
                Ativo
                {!activeKeys.some(k => k === '3') && (
                  <div className="mx-2 font-normal">
                    <i
                      className="fa fa-archive mr-2"
                      style={{ color: '#2d73d0' }}
                    />
                    {assetTableData[0]?.ativo}
                  </div>
                )}
              </h3>
            }
          >
            <AssetBlock />
          </Panel>
        )}
        {showSchedulingBlock && (
          <Panel
            key="4"
            header={
              <h3 className="ml-3 flex">
                Agendamento
                {!activeKeys.some(k => k === '4') && (
                  <React.Fragment>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-wrench mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {schedulingTableData[0]?.servico}
                    </div>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-user mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {schedulingTableData[0]?.tecnico}
                    </div>
                  </React.Fragment>
                )}
              </h3>
            }
          >
            <SchedulingBlock />
          </Panel>
        )}
        {showServicesBlock && (
          <Panel
            key="5"
            header={
              <h3 className="ml-3 flex">
                Serviços
                {!activeKeys.some(k => k === '5') && (
                  <React.Fragment>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-eye mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {formatNumber(itemsTableData[0]?.total, {
                        style: 'currency',
                        currency: getLocaleCurrency(),
                      })}
                    </div>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-usd mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {formatNumber(itemsTableData[0]?.total, {
                        style: 'currency',
                        currency: getLocaleCurrency(),
                      })}
                    </div>
                  </React.Fragment>
                )}
              </h3>
            }
          >
            <ServicesBlock />
          </Panel>
        )}
        {showItemsBlock && (
          <Panel
            key="6"
            header={
              <h3 className="ml-3 flex">
                Itens
                {!activeKeys.some(k => k === '6') && (
                  <React.Fragment>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-eye mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {formatNumber(itemsTableData[0]?.total, {
                        style: 'currency',
                        currency: getLocaleCurrency(),
                      })}
                    </div>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-usd mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {formatNumber(itemsTableData[0]?.total, {
                        style: 'currency',
                        currency: getLocaleCurrency(),
                      })}
                    </div>
                  </React.Fragment>
                )}
              </h3>
            }
          >
            <ItemsBlock />
          </Panel>
        )}
        {showWarrantyBlock && (
          <Panel key="7" header={<h3 className="ml-3 flex">Garantia</h3>}>
            <WarrantyBlock />
          </Panel>
        )}
        {showContractBlock && (
          <Panel key="12" header={<h3 className="ml-3 flex">Contrato</h3>}>
            <ContractBlock />
          </Panel>
        )}
        {showBudgetBlock && (
          <Panel
            key="13"
            header={
              <h3 className="ml-3 flex">
                Orçamento
                {!activeKeys.some(k => k === '13') && (
                  <React.Fragment>
                    <div className="mx-2 font-normal">
                      <i
                        className={`fa fa-${
                          findStatus(serviceOrderResume.status).icon
                        } mr-2`}
                        style={{
                          color: findStatus(serviceOrderResume.status).color,
                        }}
                      />
                      {findStatus(serviceOrderResume.status).name}
                    </div>
                    <div className="mx-2 font-normal">
                      <i
                        className="fa fa-usd mr-2"
                        style={{ color: '#2d73d0' }}
                      />
                      {formatNumber(itemsTableData[0]?.total, {
                        style: 'currency',
                        currency: getLocaleCurrency(),
                      })}
                    </div>
                  </React.Fragment>
                )}
              </h3>
            }
          >
            <BudgetBlock />
          </Panel>
        )}
        {showQuestionnaireBlock && (
          <Panel key="14" header={<h3 className="ml-3 flex">Questionário</h3>}>
            <QuestionnaireBlock />
          </Panel>
        )}
      </Collapse>
      <NewServiceOrderFooter />
    </div>
  )
}

const WrapperSODetailWithProvider = withWrapper((element, props) => (
  <div className="container">{element}</div>
))(props => {
  return (
    <NewServiceOrderProvider>
      <DefaultServiceOrder />
    </NewServiceOrderProvider>
  )
})

export default WrapperSODetailWithProvider
