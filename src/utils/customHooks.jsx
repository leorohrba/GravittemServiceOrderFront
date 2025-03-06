import { apiFinancial, apiSearch } from '@services/api'
import { getImgToBase64, handleAuthError } from '@utils'
import { message } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'

export function useSearchOptions({ apiHost, screenName }) {
  const [searchOptions, setSearchOptions] = useState([])
  const [loadingSearchOptions, setLoadingSearchOptions] = useState(true)

  useEffect(() => {
    const getSearchOptions = async () => {
      try {
        const response = await apiHost.get(`/api/${screenName}/Campos`)
        setSearchOptions(response.data)
        setLoadingSearchOptions(false)
      } catch (error) {
        handleAuthError(error)
        message.error('Não foi possível obter os campos da pesquisa')
      }
    }
    getSearchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [searchOptions, loadingSearchOptions]
}

export function useGetTableData(
  { apiHost, screenName },
  searchQuery,
  screen,
  microservice,
  setTags,
  tags,
  urlTags = '[]',
) {
  const [tableData, setTableData] = useState({})
  const [loadingTableData, setLoadingTableData] = useState(true)

  const [initialSearch, setInitialSearch] = useState(null)

  const originPath = sessionStorage.getItem('originPath')

  const backToGrid = async () => {
    const response = await apiHost.get(`/api/${screenName}`)
    setTableData(response.data)
    setLoadingTableData(false)
  }

  const getTableData = async () => {
    setLoadingTableData(true)
    try {
      const response = await apiHost.get(`/api/${screenName}${searchQuery}`)
      setTableData(response.data)
      setLoadingTableData(false)
    } catch (error) {
      handleAuthError(error)
      message.error('Não foi possível obter os dados da tabela')
      backToGrid()
    }
  }

  useEffect(() => {

    const getInitialSearch = async () => {
      setLoadingTableData(true)
      try {
        const response = await apiSearch.get(
          `/api/Pesquisa/PesquisaInicial?Tela=${screen}&MicroserviceOrigem=${microservice}`,
        )
        const search = response.data?.condicoes
        const isCustom = response.data?.usandoConsultaPersonalizada
        if (search && isCustom) {
          const newQuery = search.map(c => {
            const isRange = c.tipo === 'rangeDate'
            return {
              fieldName: c.descricao || c.propriedade,
              fieldValue: c.propriedade,
              searchField: c.valor,
              searchFieldValue: isRange
                ? [c.chave.split('|')[0], c.chave.split('|')[1]]
                : c.chave || c.valor,
              fieldType: c.tipo || 'search',
            }
          })
          if (urlTags === '[]' || !urlTags) {
            setTags(newQuery)
          } else if (!tags || tags.length === 0) {
            setTags(JSON.parse(urlTags) ?? [])
          } else {
            getTableData()
          }
        } else if (
          urlTags &&
          urlTags !== '[]' &&
          (!tags || tags.length === 0)
        ) {
          setTags(JSON.parse(urlTags) ?? [])
        } else {
          setTags([])
          getTableData()
        }
        sessionStorage.setItem('originPath', screen)
      } catch (error) {
        getTableData()
        handleAuthError(error)
        message.error('Não foi possível obter a pesquisa padrão')
      }
    }

    getInitialSearch()

    setInitialSearch(searchQuery)
  }, [screen, screenName])

  useEffect(() => {
    if (initialSearch && originPath === screen) {
      getTableData()
    }
  }, [searchQuery])

  return [tableData, loadingTableData, getTableData]
}

export function usePostTableData(
  { apiHost, screenName },
  searchQuery,
  screen,
  microservice,
  setTags,
  tags,
  urlTags = '[]',
  body = {},
) {
  const [tableData, setTableData] = useState({})
  const [loadingTableData, setLoadingTableData] = useState(true)

  const [initialSearch, setInitialSearch] = useState(null)

  const originPath = sessionStorage.getItem('originPath')

  const getTableData = async () => {
    if (body?.centrosCustoId?.length > 0) {
      setLoadingTableData(true)
      try {
        const response = await apiHost.post(
          `/api/${screenName}${searchQuery}`,
          body,
        )
        setTableData(response.data)
        setLoadingTableData(false)
      } catch (error) {
        handleAuthError(error)
        message.error('Não foi possível obter os dados da tabela')
      }
    }
  }

  useEffect(() => {
    const getInitialSearch = async () => {
      setLoadingTableData(true)
      try {
        const response = await apiSearch.get(
          `/api/Pesquisa/PesquisaInicial?Tela=${screen}&MicroserviceOrigem=${microservice}`,
        )
        const search = response.data?.condicoes
        const isCustom = response.data?.usandoConsultaPersonalizada
        if (search && isCustom) {
          const newQuery = search.map(c => {
            const isRange = c.tipo === 'rangeDate'
            return {
              fieldName: c.descricao || c.propriedade,
              fieldValue: c.propriedade,
              searchField: c.valor,
              searchFieldValue: isRange
                ? [c.chave.split('|')[0], c.chave.split('|')[1]]
                : c.chave || c.valor,
              fieldType: c.tipo || 'search',
            }
          })
          if (urlTags === '[]' || !urlTags) {
            setTags(newQuery)
          } else if (!tags || tags.length === 0) {
            setTags(JSON.parse(urlTags) ?? [])
          } else {
            getTableData()
          }
        } else if (
          urlTags &&
          urlTags !== '[]' &&
          (!tags || tags.length === 0)
        ) {
          setTags(JSON.parse(urlTags) ?? [])
        } else {
          setTags([])
          body?.centrosCustoId.length > 0 && getTableData()
        }
        sessionStorage.setItem('originPath', screen)
      } catch (error) {
        // getTableData()
        handleAuthError(error)
        message.error('Não foi possível obter a pesquisa padrão')
      }
    }

    if (body?.centrosCustoId?.length > 0) getInitialSearch()

    setInitialSearch(searchQuery)
  }, [screen, screenName])

  useEffect(() => {
    if (
      initialSearch &&
      body?.centrosCustoId.length > 0 &&
      originPath === screen
    ) {
      getTableData()
    }
  }, [searchQuery])

  return [tableData, loadingTableData, getTableData]
}

export const getInitialSearch = async (
  screen,
  microservice,
  setTags,
  startSearch,
) => {
  try {
    const response = await apiSearch.get(
      `/api/Pesquisa/PesquisaInicial?Tela=${screen}&MicroserviceOrigem=${microservice}`,
    )
    const search = response.data?.condicoes
    const isCustom = response.data?.usandoConsultaPersonalizada
    if (search && isCustom) {
      const newQuery = search.map(c => {
        const isRange = c.tipo === 'rangeDate'
        return {
          fieldName: c.descricao || c.propriedade,
          fieldValue: c.propriedade,
          searchField: c.valor,
          searchFieldValue: isRange
            ? [moment(c.chave.split('|')[0]), moment(c.chave.split('|')[1])]
            : c.chave || c.valor,
          fieldType: c.tipo || 'search',
        }
      })
      setTags(newQuery)
      if (startSearch) {
        startSearch()
      }
    }
    sessionStorage.setItem('originPath', screen)
  } catch (error) {
    handleAuthError(error)
    message.error('Não foi possível obter a pesquisa padrão')
    if (startSearch) {
      startSearch()
    }
  }
}

export function useGetDataFromServer(
  apiHost,
  apiUrl,
  errorMessage,
  getOnMount,
  dataStarterValue = [],
) {
  const [loadingData, setLoadingData] = useState(true)
  const [data, setData] = useState(dataStarterValue)
  const getDataFromServer = async () => {
    setLoadingData(true)
    if (apiUrl) {
      try {
        const response = await apiHost.get(apiUrl)
        setData(response.data)
      } catch (error) {
        handleAuthError(error)
        message.error(errorMessage)
      }
    }
    setLoadingData(false)
  }
  useEffect(() => {
    getOnMount && getDataFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOnMount])
  return [data, loadingData, getDataFromServer]
}

export function useGetColumnsConfiguration(apiHost, tableName, defaultColumns) {
  const [loadingColumns, setLoadingData] = useState(true)
  const [columns, setColumns] = useState([])
  const getColumns = async () => {
    setLoadingData(true)
    try {
      const response = await apiHost.get(
        `/api/ConfiguracaoColunas/${tableName}`,
      )
      let columnData = response.data?.configuracoes
      if (columnData) {
        columnData = columnData
          .filter(c => c.ativo)
          .sort((a, b) => a.ordem - b.ordem)
        const newColumnArray = []
        // eslint-disable-next-line array-callback-return
        columnData.map((c, index) => {
          const col = defaultColumns.find(
            col => c.nomeColuna === col.nomeColuna,
          )
          col && newColumnArray.splice(index, 0, col)
        })
        newColumnArray.length > 0
          ? setColumns(newColumnArray)
          : setColumns(defaultColumns.filter(col => col.obrigatorio))
      } else {
        setColumns(defaultColumns.filter(col => col.padrao))
      }
    } catch (error) {
      setColumns(defaultColumns.filter(col => col.padrao))
      message.error('Não foi possível obter a configuração de colunas')
    }
    setLoadingData(false)
  }
  useEffect(() => {
    getColumns()
  }, [tableName])
  return [columns, loadingColumns, getColumns]
}

export async function getLoginData(setData) {
  try {
    const response = await apiFinancial({
      method: 'GET',
      url: `/api/Empresa/LogoEUsuario`,
    })
    const { data } = response
    if (data) {
      setData({
        empresa: data.empresa,
        logo:
          data.logo !== null
            ? `data:image/png;base64,${data.logo}`
            : await getImgToBase64(
                require(`@assets/images/companyLogo/emptyLogo.png`),
              ),
        usuario: data.usuario,
      })
    }
  } catch (error) {
    setData({
      empresa: '',
      logo: await getImgToBase64(
        require(`@assets/images/companyLogo/emptyLogo.png`),
      ),
      usuario: '',
    })
  }
}
