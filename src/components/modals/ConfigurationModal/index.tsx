import { QuestionCircleOutlined } from '@ant-design/icons'
import { apiSearch } from '@services/api'
import { sendDataToServer } from '@utils'
import { Button, message, Modal, Row, Spin, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import ConfigurationModalColumns from './ConfigurationModalColumns'
import ConfigurationModalSearch from './ConfigurationModalSearch'

const { TabPane } = Tabs
const { confirm } = Modal

export default function ConfigurationModal({
  visibleConfigurationModal,
  setVisibleConfigurationModal,
  tableName,
  screenName,
  defaultColumns,
  microserviceName,
  microserviceOrigin,
  setUpdateColumnsKey,
  onlyInitialSearch,
}) {
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState(1)
  const [selectedSearchType, setSelectedSearchType] = useState(1)
  const [searchOptions, setSearchOptions] = useState([])
  const [selectedSearch, setSelectedSearch] = useState()
  const [columnsList, setColumnsList] = useState([])
  const [columnsConfigId, setColumnsConfigId] = useState()
  const [checkedList, setCheckedList] = useState([])
  const [keyTable, setKeyTable] = useState(0)

  useEffect(() => {
    if (visibleConfigurationModal) {
      getSearchOptions()
      getDefaultSearch()
      !onlyInitialSearch && getColumnsConfig()
    }
  }, [visibleConfigurationModal])

  async function handleSave() {
    if (selectedSearchType === 2 && !selectedSearch) {
      message.warn('Selecione uma pesquisa personalizada!')
    } else {
      const defaultSearchResult = await saveDefaultSearch()
      const columnsConfigResult =
        onlyInitialSearch || (await saveColumnsConfig())

      if (defaultSearchResult && columnsConfigResult) {
        window.location.reload()
      }
    }
  }

  function handleClose() {
    setVisibleConfigurationModal(false)
    setSelectedSearch()
    setColumnsConfigId()
    setCheckedList([])
    setColumnsList([])
    setSelectedSearchType(1)
  }

  function verifyTitle(data) {
    defaultColumns.map(
      r =>
        'title' in r &&
        data.configuracoes.map(d => {
          const dataItems = d

          return (dataItems.title = dataItems.nomeColuna.includes('Numero')
            ? dataItems.nomeColuna.replace('Numero', 'Número')
            : dataItems.nomeColuna)
        }),
    )
  }

  async function getColumnsConfig() {
    setLoading(true)
    try {
      const response = await microserviceOrigin.get(
        `/api/ConfiguracaoColunas/${tableName}`,
      )
      const { data } = response
      verifyTitle(data)
      if (data) {
        const config = data.configuracoes.sort((a, b) => a.ordem - b.ordem)
        config.forEach(col => {
          const { fixed } = defaultColumns.find(
            c => c.nomeColuna === col.nomeColuna,
          )
          // eslint-disable-next-line no-param-reassign
          col.fixed = fixed
        })
        setColumnsList(config)
        setColumnsConfigId(data.id)
      } else {
        setColumnsList(defaultColumns)
      }
    } catch (error) {     
      setColumnsList(defaultColumns)
      message.error('Não foi possível obter as configurações de colunas')
    }
    setLoading(false)
  }

  async function getDefaultSearch() {
    setLoading(true)
    try {
      const response = await apiSearch.get(
        `/api/Pesquisa/PesquisaInicial/Popup?Tela=${screenName}`,
      )
      const { data } = response
      if (data) {
        setSelectedSearchType(data.usandoConsultaPersonalizada ? 2 : 1)
        setSelectedSearch(
          data.usandoConsultaPersonalizada ? data.pesquisaId : null,
        )
      }
    } catch (error) {
      message.error('Não foi possível obter as informações de pesquisa')
    }
    setLoading(false)
  }

  async function getSearchOptions() {
    setLoading(true)
    try {
      const response = await apiSearch.get(`/api/Pesquisa/${screenName}`)
      const { data } = response
      if (data) {
        setSearchOptions(data?.pesquisas)
      }
    } catch (error) {
      message.error('Não foi possível obter as informações de pesquisa')
    }
    setLoading(false)
  }

  async function saveColumnsConfig() {
    if (!loading) {
      setLoading(true)
      const body = {
        nomeTabela: tableName,
        configuracoes: columnsList.map((col, index) => ({
          nomeColuna: col.nomeColuna,
          ativo: checkedList.includes(col.nomeColuna),
          obrigatorio: col.obrigatorio,
          ordem: index,
        })),
      }
      try {
        const successSave = await sendDataToServer(
          microserviceOrigin,
          'post',
          `api/ConfiguracaoColunas/${tableName}`,
          'Não foi possível salvar as informações',
          body,
        )
        if (successSave) {
          handleClose()
          setUpdateColumnsKey && setUpdateColumnsKey(key => key + 1)
          return true
        }
      } catch (error) {
        message.error(
          formatMessage({
            id: 'errorSave',
          }),
        )
      }
      setLoading(false)
    }
    return false
  }

  async function deleteColumnsConfig() {
    try {
      const response = await microserviceOrigin.delete(
        `/api/ConfiguracaoColunas/${tableName}`,
      )
      const { data } = response
      if (data.isOk) {
        message.success('Configurações restauradas com sucesso!')
        handleClose()
        setUpdateColumnsKey && setUpdateColumnsKey(key => key + 1)
      }
    } catch (error) {
      message.error(
        formatMessage({
          id: 'errorSave',
        }),
      )
    }
  }

  async function saveDefaultSearch() {
    const body = {
      microserviceOrigem: microserviceName,
      tela: screenName,
      usandoConsultaPersonalizada: selectedSearchType === 2,
      pesquisaId: selectedSearchType === 2 ? selectedSearch : null,
    }
    try {
      const successSave = await sendDataToServer(
        apiSearch,
        'post',
        `/api/Pesquisa/PesquisaInicial`,
        'Não foi possível salvar as informações',
        body,
      )
      if (successSave) {
        handleClose()
        sessionStorage.removeItem('originPath')
        return true
      }
    } catch (error) {
      message.error(
        formatMessage({
          id: 'errorSave',
        }),
      )
    }
    return false
  }

  const returnDefault = () => {
    if (columnsConfigId) {
      confirm({
        title: 'Restaurar configuração padrão?',
        content:
          'Deseja deletar a configuração de colunas existente e restaurar o padrão?',
        onOk: () => deleteColumnsConfig(),
        cancelText: 'Cancelar',
        okText: 'Restaurar',
        okType: 'danger',
        icon: <QuestionCircleOutlined />,
      })
    } else {
      setColumnsList(defaultColumns)
      setCheckedList(
        defaultColumns
          .filter(col => col.obrigatorio === true)
          .map(col => col.nomeColuna),
      )
      setKeyTable(key => key + 1)
      setUpdateColumnsKey && setUpdateColumnsKey(key => key + 1)
    }
  }

  return (
    <Modal
      title="Configurações"
      visible={visibleConfigurationModal}
      bodyStyle={{ paddingTop: 0 }}
      onCancel={handleClose}
      destroyOnClose
      footer={
        <Row type="flex">
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            onClick={handleSave}
            loading={loading}
          >
            Salvar
          </Button>
          <Button
            type="secondary"
            className="ml-3 mr-auto"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          {selectedTab === '2' && (
            <Button loading={loading} onClick={returnDefault}>
              Restaurar padrão
            </Button>
          )}
        </Row>
      }
    >
      <Spin spinning={loading}>
        <Tabs
          type="card"
          defaultValue={selectedTab}
          onChange={e => setSelectedTab(e)}
        >
          <TabPane key={1} tab="Pesquisa padrão">
            <ConfigurationModalSearch
              {...{
                selectedSearchType,
                setSelectedSearchType,
                searchOptions,
                selectedSearch,
                setSelectedSearch,
                loading,
              }}
            />
          </TabPane>
          {!onlyInitialSearch && (
            <TabPane key={2} tab="Colunas">
              <ConfigurationModalColumns
                {...{
                  columnsList,
                  setColumnsList,
                  keyTable,
                  checkedList,
                  setCheckedList,
                }}
              />
            </TabPane>
          )}
        </Tabs>
      </Spin>
    </Modal>
  )
}
