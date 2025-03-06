import { useState, useEffect } from 'react'
import constate from 'constate'
import { apiLog } from '@services/api'
import { getPermissions, setParamValues, hasPermission } from '@utils'
import { useGetTableData } from '@utils/customHooks/header'
import { ISearchOptions } from '../interfaces/ISearchOptions'
import { ITableData } from '../interfaces/ITableData'
import { ITag } from '../interfaces/ITag'
import { getSearchOptions, getEnterprise } from '../services'
import { IEnterprise } from '../interfaces/IEnterpriseInterface'

let params = {}

function useServiceOrder({ screenType = 'standard' }: { screenType: string }) {
  const [searchOptions, setSearchOptions] = useState<ISearchOptions>([])
  const [loadingSearchOptions, setLoadingSearchOptions] =
    useState<boolean>(true)
  const [tags, setTags] = useState<ITag[]>([])
  const query = new URLSearchParams(window.location.search)
  const urlTags = query.get('tags')
  const [userPermissions, setUserPermissions] = useState<any[]>([])
  const [loadingUserPermissions, setLoadingUserPermissions] =
    useState<boolean>(true)
  const [viewDetailModal, setViewDetailModal] = useState<boolean>(false)
  const [viewImportSpreadsheet, setViewImportSpreadsheet] =
    useState<boolean>(false)
  const [keyModal, setKeyModal] = useState<number>(0)
  const [viewAttachmentModal, setViewAttachmentModal] = useState<boolean>(false)
  const [viewModalObject, setViewModalObject] = useState<any>(false)
  const [canView, setCanView] = useState<boolean>(null)
  const [canAlter, setCanAlter] = useState<boolean>(null)
  const [canInclude, setCanInclude] = useState<boolean>(null)
  const [canExclude, setCanExclude] = useState<boolean>(null)
  const [enterprise, setEnterprise] = useState<IEnterprise[]>([])

  const screenConfig = {
    apiHost: apiLog,
    screenName: 'Log/Inicializacao',
  }

  const [tableData, loadingTableData, getTableData] =
    useGetTableData<ITableData>(
      screenConfig,
      `?EmpresaId=${enterprise[0]?.empresaId}${
        screenType == 'standard'
          ? '&InterfaceLogNome=ImportacaoClear'
          : '&InterfaceLogNome=ImportacaoPlanoContas&CargaDados=true'
      }`,
      screenConfig.screenName,
      'log',
      setTags,
      tags,
      urlTags,
      params,
      false,
    )

  const startSearch = async () => {
    setParamValues(params, searchOptions, tags, 1)
    getTableData()
  }

  const setPermissions = async () => {
    const permissions = await getPermissions(
      screenType == 'standard' ? 'OrdemServicoViaPlanilha' : 'ImportarPlanilha',
    )
    setUserPermissions(permissions)
  }

  useEffect(() => {
    setPermissions()
    getEnterprise(setEnterprise)
  }, [])

  useEffect(() => {
    if (userPermissions?.length > 0) {
      setLoadingUserPermissions(false)
      setCanView(hasPermission(userPermissions, 'Visualize'))
      setCanAlter(hasPermission(userPermissions, 'Alter'))
      setCanInclude(hasPermission(userPermissions, 'Include'))
      setCanExclude(hasPermission(userPermissions, 'Exclude'))
    }
  }, [userPermissions])

  useEffect(() => {
    if (canView) {
      getSearchOptions(setSearchOptions, setLoadingSearchOptions)
    }
  }, [canView])

  return {
    tableData,
    loadingSearchOptions,
    tags,
    setTags,
    startSearch,
    searchOptions,
    loadingTableData,
    loadingUserPermissions,
    viewImportSpreadsheet,
    setViewImportSpreadsheet,
    keyModal,
    setKeyModal,
    viewDetailModal,
    setViewDetailModal,
    viewAttachmentModal,
    setViewAttachmentModal,
    viewModalObject,
    setViewModalObject,
    canView,
    canAlter,
    canInclude,
    canExclude,
    userPermissions,
    screenType,
  }
}

const [ServiceOrderProvider, useServiceOrderContext] = constate(useServiceOrder)

export { ServiceOrderProvider, useServiceOrderContext }
