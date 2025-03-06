import React, { Fragment } from 'react'
import NewSimpleSearch from '@components/NewSimpleSearch'
import ConfigurationModal from '@components/modals/ConfigurationModal'
import useConfigurationModal from '@models/useConfigurationModal'

function SearchConfigHeader(props) {
  const {
    searchOptions,
    setTags,
    tags,
    screenName,
    getSelectLabel,
    startSearch,
    searchBoxWidth,
    selectOptionsWidth,
    setUpdateColumnsKey,
    configScreen,
    tableName,
    defaultColumns,
    microserviceName,
    microserviceOrigin,
  } = props

  const { visibleConfigurationModal, setVisibleConfigurationModal } =
    useConfigurationModal()

  return (
    <Fragment>
      <NewSimpleSearch
        {...{
          searchOptions,
          setTags,
          tags,
          screenName,
          getSelectLabel,
          startSearch,
          searchBoxWidth,
          selectOptionsWidth,
        }}
      />
      <ConfigurationModal
        {...{
          visibleConfigurationModal,
          setVisibleConfigurationModal,
          setUpdateColumnsKey,
          tableName,
          defaultColumns,
          microserviceName,
          microserviceOrigin,
        }}
        screenName={configScreen}
      />
    </Fragment>
  )
}

export default SearchConfigHeader
